/** biome-ignore-all lint/suspicious/noExplicitAny: Manipulation of method params is needed here due to the fact that there inference are complex we will keep this */

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { Context } from 'hono';

export class ValidationError extends Error {
	constructor(
		public statusCode: number,
		public errors: Array<{ property: string; constraints: any; value: any }>,
	) {
		super('Validation failed');
		this.name = 'ValidationError';
	}
}

const REPOSITORY_METADATA = Symbol('repository');
const SERVICE_METADATA = Symbol('service');
const DTO_METADATA = Symbol('dto');
const DTO_CLASSES = new Map<string, any>();

export function Repository(tableName: string) {
	return <T extends { new (...args: unknown[]): object }>(cons: T) => {
		Reflect.defineMetadata(REPOSITORY_METADATA, tableName, cons);
		return cons;
	};
}

export function Service() {
	return <T extends { new (...args: unknown[]): object }>(cons: T) => {
		Reflect.defineMetadata(SERVICE_METADATA, true, cons);
		return cons;
	};
}

export function DTO() {
	return <T extends { new (...args: unknown[]): object }>(cons: T) => {
		console.log(`Saving ${cons.name} as DTO`);

		DTO_CLASSES.set(cons.name, cons);

		Reflect.defineMetadata(DTO_METADATA, true, cons);
		return cons;
	};
}

export function ValidateDTO<T>(
	dtoClassName?: new (...args: any[]) => T,
	provider: 'json' | 'formData' | 'query' = 'json',
) {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: any[]) {
			const c: Context | undefined = args.find(
				(arg) =>
					arg && typeof arg === 'object' && 'req' in arg && 'json' in arg,
			);

			if (!c) {
				throw new Error(
					`The method ${propertyKey} decorated with @ValidateDTO must receive the Hono context (c) as an argument.`,
				);
			}

			const body = await c.req[provider]();

			let dtoClass: any;

			if (dtoClassName) {
				dtoClass = DTO_CLASSES.get(dtoClassName.name);
				if (!dtoClass) {
					throw new Error(`DTO class "${dtoClassName}" not found in registry`);
				}
			} else {
				const paramTypes = Reflect.getMetadata(
					'design:paramtypes',
					target,
					propertyKey,
				);
				dtoClass = paramTypes?.find((param: any) =>
					DTO_CLASSES.has(param.name),
				);

				if (!dtoClass) {
					throw new Error(
						`No DTO class found for ${target.constructor.name}.${propertyKey}`,
					);
				}
			}

			const dtoInstance = plainToInstance(dtoClass, body);
			const errors = await validate(dtoInstance);

			if (errors.length > 0) {
				throw new ValidationError(
					400,
					errors.map((err) => ({
						property: err.property,
						constraints: err.constraints,
						value: err.value,
					})),
				);
			}

			const paramTypes = Reflect.getMetadata(
				'design:paramtypes',
				target,
				propertyKey,
			);
			const dtoParamIndex =
				paramTypes?.findIndex(
					(param: any) => param === dtoClass || DTO_CLASSES.has(param.name),
				) ?? 0;

			args[dtoParamIndex] = dtoInstance;

			return originalMethod.apply(this, args);
		};
	};
}
