import { useAuthStore } from '@/stores/auth.store';
import type { ComponentType, FC, JSX } from 'react';
import { Navigate } from 'react-router-dom';

type MiddlewareFunction = (...args: unknown[]) => JSX.Element;
type ReactComponent<T = unknown> = ComponentType<T> | FC<T>;

// biome-ignore lint/complexity/noBannedTypes: Using Function to check if it's a React component
export function isReactComponent(func: Function): func is ReactComponent {
	if (func.prototype?.isReactComponent) {
		return true;
	}

	return (
		(func.name?.[0]?.toUpperCase &&
			func.name[0] === func.name[0].toUpperCase()) ||
		'displayName' in func ||
		'defaultProps' in func ||
		'propTypes' in func
	);
}

export const authGuard = <T extends {}>(
	WrappedComponent: ReactComponent<T> | MiddlewareFunction,
) => {
	return (props: T) => {
		const authenticated = useAuthStore((s) => s.auth.authenticated);

		if (!authenticated) {
			return <Navigate to="/login" />;
		}

		return <WrappedComponent {...props} />;
	};
};

// Usage: const ProtectedDashboard = AuthGuard(Dashboard);
