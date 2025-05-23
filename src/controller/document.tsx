import Layout, { LayoutType } from '../components/shared/Layout.tsx';
import { factory } from '../factory.ts';
import DocumentForm from '../pages/Document.tsx';
import { getLoc } from '../utils/helpers.ts';

const documentApp = factory.createApp();

// documentApp.get('/form', async (c) => {
//   const session = c.get('session');
//   const lang = c.get('language') as "fr" | "es" | "en";
//   const loc = await getLoc(lang);
//   const theme = session.get('Theme');
//   const footer = {
//     bg: 'bg-gray-900',
//     text: 'text-gray-100',
//     title: 'text-gray-400',
//     theme: {
//       footer: theme!.footer,
//     },
//   };
//   const layout: LayoutType = {
//     isHome: true,
//     header: {
//       auth: session.get('Auth')!.authenticated,
//     },
//     footer,
//     currentLocal: lang,
//     locales: loc,
//   };

//   return c.html(
//     <Layout {...layout}>
//       <DocumentForm />
//     </Layout>
//   );
// });

export default documentApp;
