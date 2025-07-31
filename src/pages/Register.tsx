import { Github } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Google } from '@/components/shared/Icons';
import {
	useLocalURI,
	useTranslation,
} from '@/components/shared/TranslationContext';
import { Button } from '@/components/utils/button';
import { InputField } from '@/components/utils/InputWithLabels';
import { useAuthStore } from '@/stores/auth.store';

const Login = () => {
	const { t } = useTranslation();
	const [email, setEmail] = useState('');
	const auth = useAuthStore((s) => s.auth);
	const registerFn = useAuthStore((s) => s.register);
	const [emailFieldError, setEmailFieldError] = useState<string | undefined>(
		undefined,
	);
	const [passwordFieldError, setPasswordFieldError] = useState<
		string | undefined
	>(undefined);
	const [password, setPassword] = useState('');
	const [validatePassword, setValidatePassword] = useState('');
	const [validatePasswordFieldError, setValidatePasswordFieldError] = useState<
		string | undefined
	>(undefined);
	const navigate = useNavigate();
	const handleAuth = async () => {
		const res = await registerFn({
			email,
			password,
		});
		if (auth.authenticationError && 'details' in auth.authenticationError) {
			const errors = auth.authenticationError.details as {
				property: string;
				constraints: string;
				[key: string]: unknown;
			}[];
			console.log('errors =====> ', errors);
			errors.forEach((e) => {
				if (e.property === 'email') {
					setEmailFieldError(
						e.constraints && typeof e.constraints === 'string'
							? e.constraints
							: Object.entries(e.constraints)[0]?.[1],
					);
				}
				if (e.property === 'password') {
					setPasswordFieldError(
						e.constraints && typeof e.constraints === 'string'
							? e.constraints
							: Object.entries(e.constraints)[0]?.[1],
					);
				}
			});
			toast.error(
				auth.authenticationError.message ??
					'Authentication failed please try again',
			);
		}
		console.log('res ====> ', res);
		if (res?.redirectUrl) {
			navigate(res.redirectUrl);
		}
	};

	const handlePasswordField = (v: string) => {
		if (password.trim() !== v.trim()) {
			setValidatePasswordFieldError(t('register.password_field_error'));
			return;
		}
		setValidatePasswordFieldError(undefined);
	};
	return (
		<div className="flex min-h-screen w-full items-center justify-center">
			<div className="bg-card min-w-[300px] rounded-lg dark:border dark:border-border p-8 shadow-lg md:min-w-md lg:min-w-lg xl:min-w-xl">
				<h1 className="text-lg font-bold md:text-lg xl:text-3xl">
					{t('common.register')}
				</h1>
				<span>{t('register.form_heading')}</span>
				<form action="" className="mt-8 flex flex-col gap-4">
					<div className="w-full grid grid-cols-2 gap-2">
						<Button className="px-2 py-2 rounded-md bg-green-500 dark:bg-green-700 flex gap-1 justify-center items-center cursor-pointer">
							<Github className="h-6 w-6 text-white" />
							<span className="text-white">{t('common.github')}</span>
						</Button>
						<Button className="px-2 py-2 rounded-md bg-primary flex gap-1 justify-center items-center cursor-pointer">
							<Google className="h-6 w-6 fill-white" />
							<span className="text-white">{t('common.google')}</span>
						</Button>
					</div>
					<InputField
						name="email"
						value={email}
						error={emailFieldError}
						onChange={(v) => setEmail(v)}
						label={t('register.form.email.label')}
						onFocus={() => setEmailFieldError(undefined)}
						placeholder={t('register.form.email.placeholder')}
					/>
					<InputField
						name="password"
						value={password}
						error={passwordFieldError}
						onChange={(v) => setPassword(v)}
						onFocus={() => setPasswordFieldError(undefined)}
						label={t('register.form.password.label')}
						placeholder={t('register.form.password.placeholder')}
						type="password"
					/>
					<InputField
						name="validate_password"
						value={validatePassword}
						error={validatePasswordFieldError}
						onChange={(v) => {
							setValidatePassword(v);
							handlePasswordField(v);
						}}
						label={t('register.form.validate_password.label')}
						placeholder={t('register.form.validate_password.placeholder')}
						type="password"
					/>
					<Button
						onClick={handleAuth}
						className="w-full bg-primary cursor-pointer text-white hover:bg-accent rounded-md px-5 py-2 transition-colors"
					>
						{t('login.form_submit')}
					</Button>
					<div className="w-full flex items-center justify-between">
						<NavLink
							to={useLocalURI('/login')}
							className="text-primary hover:underline"
						>
							{t('register.form_login_account')}
						</NavLink>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
