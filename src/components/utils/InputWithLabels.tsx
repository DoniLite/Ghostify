import type { ChangeEvent, FocusEvent } from 'react';

type InputTypeHTMLAttribute =
	| 'text'
	| 'email'
	| 'number'
	| 'password'
	| 'search'
	| 'tel'
	| 'url'
	| 'date'
	| 'datetime-local'
	| 'month'
	| 'time'
	| 'week'
	| 'checkbox'
	| 'radio'
	| 'range'
	| 'color'
	| string;

interface InputFieldProps<T = string> {
	label?: string;
	placeholder?: string;
	name?: string;
	required?: boolean;
	type?: InputTypeHTMLAttribute;
	error?: string;
	value: T;
	onChange?: (value: T) => void;
	onFocus?: () => void;
	onBlur?: () => void;
	[key: string]: unknown; // Allow additional props
}

export function InputField<T = string>({
	label = '',
	placeholder = '',
	name = '',
	required = false,
	type = 'text',
	error,
	value,
	onChange,
	onFocus,
	onBlur,
	...rest
}: InputFieldProps<T>) {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value as unknown as T;
		onChange?.(val);
	};

	const handleFocus = (_e: FocusEvent<HTMLInputElement>) => {
		onFocus?.();
	};

	const handleBlur = (_e: FocusEvent<HTMLInputElement>) => {
		onBlur?.();
	};

	return (
		<div className="flex w-full flex-col gap-2">
			{label && (
				<label htmlFor={name} className="font-bold">
					{label}
				</label>
			)}
			<input
				id={name}
				name={name}
				type={type}
				placeholder={placeholder}
				required={required}
				aria-required={required}
				value={value as string}
				onChange={handleChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
				{...rest}
				className="ring-muted focus:ring-primary rounded-md bg-transparent px-4 py-2 ring outline-none"
			/>
			{error && <span className="text-red-400">{error}</span>}
		</div>
	);
}
