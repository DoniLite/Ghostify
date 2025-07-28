import { setSignedCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { BaseService } from '@/core/base.service';
import { Service, ValidateDTO } from '@/core/decorators';
import type { User } from '@/db';
import type { AppContext } from '@/factory';
import { checkUserSession } from '@/hooks/server/auth';
import { compareHash, hashSomething } from '@/utils/security/hash';
import { generateToken, verifyJWT } from '@/utils/security/jwt';
import { CreateUserDTO, type UpdateUserDTO } from '../dto/user.dto';
import { UserRepository } from '../repository/user.repository';

@Service()
export class UserService extends BaseService<
	User,
	CreateUserDTO,
	UpdateUserDTO,
	UserRepository
> {
	constructor() {
		super(new UserRepository());
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.repository.findByEmail(email);
	}

	async findByUsername(username: string): Promise<User | null> {
		return this.repository.findByUsername(username);
	}

	@ValidateDTO(CreateUserDTO)
	async createUser(
		dto: CreateUserDTO,
		context: AppContext,
	): Promise<{
		login: User['email'] | User['username'];
		token: string;
	}> {
		const existingUser = await this.findByEmail(dto.email);
		if (existingUser) {
			throw new HTTPException(400, {
				message: 'User with this email already exists',
				res: new Response(
					JSON.stringify({
						message: 'This email already exist try to login instead',
					}),
					{
						headers: {
							'Content-Type': 'application/json',
						},
					},
				),
			});
		}

		if (dto.username) {
			const existingUsername = await this.findByUsername(dto.username);
			if (existingUsername) {
				throw new HTTPException(400, {
					message: 'Username already taken',
					res: new Response(
						JSON.stringify({
							message: 'This username already exist try to login instead',
						}),
						{
							headers: {
								'Content-Type': 'application/json',
							},
						},
					),
				});
			}
		}

		const hashedPassword = await this.hashPassword(dto.password);

		const user = await this.create(
			{
				...dto,
				password: hashedPassword,
			},
			context,
		);
		const token = await generateToken({
			email: user.email,
			permission: user.permission,
		});

		await this.setUserSession(user, token, context);

		return {
			login: user.email,
			token,
		};
	}

	async login(
		fields: {
			login: string;
			password: string;
		},
		context: AppContext,
	): Promise<{
		login: User['email'] | User['username'];
		token: string;
	}> {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const { login, password } = fields;
		const user = emailRegex.test(login)
			? await this.findByEmail(login)
			: await this.findByUsername(login);
		if (!user) {
			throw new HTTPException(404, {
				message: 'User not found',
				res: new Response(
					JSON.stringify({
						message:
							"User not found be sure that you've provided a valid username/email",
					}),
					{
						headers: {
							'Content-Type': 'application/json',
						},
					},
				),
			});
		}

		if (!user.password) {
			throw new HTTPException(400, {
				message: 'User does not have a password set',
				res: new Response(
					JSON.stringify({
						message:
							"You're trying to login with the bad provider try any of these providers one: Github, Google",
					}),
					{
						headers: {
							'Content-Type': 'application/json',
						},
					},
				),
			});
		}
		const isValid = await this.verifyPassword(password, user.password);
		if (!isValid) {
			throw new HTTPException(400, {
				message: 'Invalid password',
				res: new Response(
					JSON.stringify({
						message: 'Invalid password provided',
					}),
					{
						headers: {
							'Content-Type': 'application/json',
						},
					},
				),
			});
		}
		const token = await generateToken({
			email: user.email,
			permission: user.permission,
		});
		await this.setUserSession(user, token, context);

		return {
			login,
			token,
		};
	}

	private async verifyPassword(
		password: string,
		hashedPassword: string,
	): Promise<boolean> {
		return compareHash(password, hashedPassword);
	}

	private async hashPassword(password: string) {
		return hashSomething(password);
	}

	async checkUserSession(context: AppContext) {
		return checkUserSession(context);
	}

	private async setUserSession(user: User, token: string, context: AppContext) {
		const session = context.get('session');
		const cookieExpiration = new Date();
		cookieExpiration.setMinutes(cookieExpiration.getMinutes() + 15);
		const connection_time = cookieExpiration.getTime().toString();

		session.set('Token', token);

		session.set('Auth', {
			authenticated: true,
			isSuperUser: false,
			login: user.email,
			id: user.id,
			avatar: user.avatar ?? undefined,
			username: user.username ?? undefined,
			fullname: user.fullname ?? undefined,
		});

		await setSignedCookie(
			context,
			'connection_time',
			connection_time,
			// biome-ignore lint/style/noNonNullAssertion: this variable is injected during the server starting
			Bun.env.SIGNED_COOKIE_SECRET!,
		);
	}

	async decodeUserToken(token: string) {
		return verifyJWT<{
			email: User['email'];
			permission: User['permission'];
		}>(token);
	}
}
