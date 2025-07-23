import { Ghostify } from './Icons';

const Logo = ({ ...props }: Record<string, unknown>) => (
	<div className="flex h-full flex-col items-center justify-center" {...props}>
		<h1 className="text-bold font-cookie bg-transparent text-xl text-gray-950 dark:text-white">
			Ghostify
		</h1>
		<Ghostify color="w-6 h-6" />
	</div>
);

export default Logo;
