/** biome-ignore-all lint/suspicious/noExplicitAny: Manipulation of method params is needed here due to the fact that there inference are complex we will keep this */
import { Context } from 'node_modules/hono/dist/types/context';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import 'reflect-metadata';

const REPOSITORY_METADATA = Symbol('repository');
const SERVICE_METADATA = Symbol('service');
const DTO_METADATA = Symbol('dto');

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
		Reflect.defineMetadata(DTO_METADATA, true, cons);
		return cons;
	};
}

export function ValidateDTO(provider: 'json' | 'formData' | 'query' = 'json') {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;
		const paramTypes = Reflect.getMetadata(
			'design:paramtypes',
			target,
			propertyKey,
		);

		const dtoParamIndex = paramTypes.findIndex((param: any) =>
			Reflect.getMetadata(DTO_METADATA, param),
		);

		if (dtoParamIndex === -1) {
			console.warn(
				`the decorator @ValidateDTO on ${target.constructor.name}.${propertyKey} found no parameter of type DTO.`,
			);
			return;
		}

		descriptor.value = async function (...args: any[]) {
			const c: Context | undefined = args.find((arg) => arg instanceof Context);

			if (!c) {
				throw new Error(
					`method ${propertyKey} decorated with @ValidateDTO must receive the Hono context (c) as an argument.`,
				);
			}

			const body = await c.req[provider]();

			args[dtoParamIndex] = body;

			const dtoClass = paramTypes[dtoParamIndex];
			const dtoInstance = plainToInstance(dtoClass, args[dtoParamIndex]);

			const errors = await validate(dtoInstance);

			if (errors.length > 0) {
				const errorResponse = {
					statusCode: 400,
					message: 'Validation failed',
					errors: errors.map((err) => ({
						property: err.property,
						constraints: err.constraints,
					})),
				};
				return c.json(errorResponse, 400);
			}

			args[dtoParamIndex] = dtoInstance;

			return originalMethod.apply(this, args);
		};
	};
}
