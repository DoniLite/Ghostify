import 'dotenv/config';
import { sign, verify } from 'hono/jwt';

const { JWT_SECRET } = Bun.env;

if (!JWT_SECRET) {
	throw new Error(
		`You have to define the JWT_SECRET variable in your .env file`,
	);
}

export const verifyJWT = async <T extends Record<string, unknown>>(token: string) => {
	return await verify(token, JWT_SECRET) as T;
};

export const generateToken = async <T extends Record<string, unknown>>(
	payload: T,
) => {
	return await sign(payload, JWT_SECRET);
};
