import type { Session } from 'hono-sessions';
import type { JwtVariables } from 'hono/jwt';
import type { Buffer } from 'node:buffer';

export type Variables = {
	session: Session<SessionData>;
	session_key_rotation: boolean;
} & JwtVariables;

export interface Service {
	APIs?: {
		name: string;
		endpoint: string;
		docs?: string | null;
		isSecure?: boolean;
	}[];
	checkHealth?: (service: string, endpoint: string) => boolean;
	Platform?: {
		internals: boolean;
		externals?: boolean;
		API: boolean;
		Sockets?: boolean;
	};
}

export interface SessionData {
	Cookies?: Record<string, unknown>;
	Token?: string;
	ServerKeys?: {
		secretKey: Buffer;
		iv: Buffer;
	};
	Theme?: Record<string, string>;
	Services?: Service;
	Auth?: Auth;
	CVData?: RawCV;
	JobsIDs?: {
		cvJob?: string | number;
	};
	RedirectUrl?: string;
}

export interface Secrets {
	key: Buffer;
	iv: Buffer;
}

export type Actions<T, U extends keyof T = keyof T> = Pick<T, U>;

export interface Auth {
	id?: string;
	login?: string;
	isSuperUser?: boolean;
	authenticated: boolean;
	username?: string;
	fullname?: string;
	avatar?: string;
}

export type BodyXData<T = undefined> = T extends undefined
	? Record<string, unknown>
	: T;

export type QueryXData<T = undefined> = T extends undefined
	? Record<string, unknown>
	: T;

export type PosterUserMeta = Record<
	string,
	| never
	| {
			id: number;
			title: string;
	  }[]
>;

export type Meta<T = unknown> = {
	userId: number;
	service: string;
} & T;

export interface Checker {
	pass: boolean;
	services: Service['APIs'];
}

export interface HealthCheckerInterface {
	check(service: string, endpoint?: string): Promise<boolean>;
	health(): Promise<Service['Platform']>;
}

export interface EnvConfig {
	WEBSOCKET_BASE_URL: string;
	API_BASE_URL: string;
}
declare global {
	var __ENV: EnvConfig;
	var App: Record<string, unknown>;
}

export interface RawCV {
	img?: string;
	cvType: string;
	name: string;
	email: string;
	phone: string;
	address: string;
	birthday: string;
	profile: string;
	skills: string[];
	interest: string[];
	formations: {
		formation: string;
		certificate: string;
		certificationDate: string;
	}[];
	experiences: {
		experience: string;
		details: {
			task: string;
			taskDate: string;
		}[];
	}[];
	languages: {
		lang: string;
		level: string;
	}[];
}

export interface SecurityHashPayload {
	hash: string;
	env: string;
	expire: string;
}
