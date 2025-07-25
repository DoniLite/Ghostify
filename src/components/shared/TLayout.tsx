import type { FC, PropsWithChildren } from 'react';
import Meta from './Meta';

export type LayoutType = PropsWithChildren;


const TLayout: FC<LayoutType> = ({ children }) => {
	return (
		<html
			lang="en"
		>
			<head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta
					name="author"
					content="This website is powered by Doni Lite and its contributors"
				/>
				<meta name="creator" content="Doni Lite" />
				<link rel="icon" type="image/svg+xml" href="/static/ghostify.svg" />
				<link rel="stylesheet" href="/static/js/client.css" />
				<Meta />
			</head>
			<body>
				{children}
			</body>
		</html>
	);
};

export default TLayout;
