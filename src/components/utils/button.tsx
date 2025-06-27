import type { PropsWithChildren } from 'react';

type ButtonPropsType = PropsWithChildren<
	{
		link?: string;
		elClass?: string;
		type?: `button` | `submit` | `reset`;
	} & Record<string | number | symbol, unknown>
>;

export const Button = ({
	link,
	children,
	elClass,
	type,
	...rest
}: ButtonPropsType) => {
	if (link) {
		return (
			<a
				href={link}
				className={`${elClass} rounded-lg text-center font-bold`}
				{...rest}
			>
				{children}
			</a>
		);
	}
	return (
		<button
			type={type ?? 'button'}
			className={`rounded-lg text-center font-bold ${elClass}`}
			{...rest}
		>
			{children}
		</button>
	);
};
