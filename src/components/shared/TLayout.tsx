import { LocalsContext } from './Layout.tsx';
import Meta, { type MetaProps } from './Meta.tsx';
import { PropsWithChildren, FC } from 'hono/jsx';

type TLayout = PropsWithChildren<{
  meta?: MetaProps;
  locales?: Record<string, unknown>;
  currentLocal?: string;
}>;

const Layout: FC<TLayout> = ({ meta, children, locales, currentLocal }) => {
  return (
    <html lang={currentLocal}>
      <head>
        <meta charset='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta
          name='author'
          content='This website is powered by Doni Lite and its contributors'
        />
        <meta name='creator' content='Doni Lite' />
        <link rel='stylesheet' href='/static/all.min.css' />
        <link rel='icon' type='image/svg+xml' href='/static/SVG/gostify.svg' />
        <link rel='stylesheet' href='/static/css/main.css' />
        <Meta {...meta} />
      </head>
      <body>
        <LocalsContext.Provider value={locales ?? {}}>
          {children}
        </LocalsContext.Provider>
      </body>
    </html>
  );
};

export default Layout;
