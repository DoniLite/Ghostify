import { LocalsContext } from './Layout.tsx';
import Meta, { type MetaProps } from './Meta.tsx';
import { PropsWithChildren, FC } from 'react';

export type TLayout = PropsWithChildren<{
  meta?: MetaProps;
  locales?: { default: Record<string, unknown> };
  currentLocal?: string;
  theme?: Record<string, string>;
}>;

const Layout: FC<TLayout> = ({ children, locales, currentLocal, theme }) => {
  return (
    <html lang={currentLocal} data-theme={theme?.default || theme?.userDefault || 'light'}>
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta
          name='author'
          content='This website is powered by Doni Lite and its contributors'
        />
        <meta name='creator' content='Doni Lite' />
        <link rel='stylesheet' href='/static/all.min.css' />
        <link rel='icon' type='image/svg+xml' href='/static/SVG/gostify.svg' />
        <link rel='stylesheet' href='/static/css/main.css' />
        <Meta />
      </head>
      <body>
        <LocalsContext.Provider value={locales ?? {default: {}}}>
          {children}
          <div id="backToTop"></div>
        </LocalsContext.Provider>
      </body>
    </html>
  );
};

export default Layout;
