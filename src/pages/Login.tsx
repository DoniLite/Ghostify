import { Github } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Google } from '@/components/shared/Icons';
import {
	useLocalURI,
	useTranslation,
} from '@/components/shared/TranslationContext';
import { Button } from '@/components/utils/button';
import { InputField } from '@/components/utils/InputWithLabels';

const Login = () => {
	const { t } = useTranslation();
	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');
	return (
		<div className="flex min-h-screen w-full items-center justify-center">
			<div className="bg-card min-w-[300px] rounded-lg dark:border dark:border-border p-8 shadow-lg md:min-w-md lg:min-w-lg xl:min-w-xl">
				<h1 className="text-lg font-bold md:text-lg xl:text-3xl">
					{t('common.login')}
				</h1>
				<span>{t('login.form_heading')}</span>
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
						value={login}
						onChange={(v) => setLogin(v)}
						label={t('login.form.login.label')}
						placeholder={t('login.form.login.placeholder')}
					/>
					<InputField
						value={password}
						onChange={(v) => setPassword(v)}
						label={t('login.form.password.label')}
						placeholder={t('login.form.password.placeholder')}
						type="password"
					/>
					<Button className="w-full bg-primary cursor-pointer text-white hover:bg-accent rounded-md px-5 py-2 transition-colors">
						{t('login.form_submit')}
					</Button>
					<div className="w-full flex items-center justify-between">
						<NavLink
							to={useLocalURI('/forgot-password')}
							className="text-foreground hover:underline hover:text-primary"
						>
							{t('login.form_forgot_password')}
						</NavLink>
						<NavLink
							to={useLocalURI('/register')}
							className="text-primary hover:underline"
						>
							{t('login.form_create_account')}
						</NavLink>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
