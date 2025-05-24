import { PropsWithChildren } from 'react';

type ButtonPropsType = PropsWithChildren<{
  link?: string;
  elClass?: string;
  type?: `button` | `submit` | `reset`;
} & Record<string | number | symbol, unknown>>;

export const Button = (
  { link, children, elClass, type, ...rest }: ButtonPropsType,
) => {
  if (link) {
    return (
      <a
        href={link}
        className={`${elClass} font-bold rounded-lg text-center`}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      type={type ?? 'button'}
      className={`font-bold rounded-lg text-center ${elClass}`}
      {...rest}
    >
      {children}
    </button>
  );
};
