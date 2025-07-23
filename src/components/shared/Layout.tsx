import { createContext, type FC, type PropsWithChildren } from 'react';
import Footer from './Footer';
import Header from './Header';
import Meta from './Meta';

export const LocalsContext = createContext<{
	default: Record<string, unknown>;
}>({
	default: {},
});

export type LayoutType = PropsWithChildren;

const styles = `
  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
    100% {
      transform: translateY(0px);
    }
  }

  .floating {
    animation: float 6s ease-in-out infinite;
  }

  .floating-delayed {
    animation: float 8s ease-in-out infinite;
    animation-delay: 2s;
  }

  /* Blur effect on glass elements */
  .glass {
    backdrop-filter: blur(16px);
    background: rgba(17, 24, 39, 0.7);
  }

  /* Gradient animation */
  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient 15s ease infinite;
  }

  /* Custom scrollbar */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(99, 102, 241, 0.5);
    border-radius: 8px;
  }

  /* Tooltip style */
  .tooltip {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s, opacity 0.3s ease;
  }

  .tooltip-container:hover .tooltip {
    visibility: visible;
    opacity: 1;
  }
`;

const Layout: FC<LayoutType> = ({ children }) => {
	return (
		<html
			lang="en"
			// data-theme={theme?.default || theme?.userDefault || 'light'}
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
				{/** biome-ignore lint/security/noDangerouslySetInnerHtml: The style injected here is constructed in code only */}
				<style dangerouslySetInnerHTML={{ __html: styles }} />
				<Meta />
			</head>
			<body>
				<Header />
				{children}
				<Footer />
			</body>
		</html>
	);
};

export default Layout;
