import Layout, { LayoutType } from '../components/shared/Layout.tsx';
import { factory } from '../factory.ts';
import DocumentForm from '../pages/Document.tsx'



const documentApp = factory.createApp();

documentApp.get('/form', (c) => {
    const session = c.get('session');
      const theme = session.get('Theme');
      const footer = {
        bg: 'bg-gray-900',
        text: 'text-gray-100',
        title: 'text-gray-400',
        theme: {
          footer: theme!.footer,
        },
      };
      const layout: LayoutType = {
        isHome: true,
        header: {
          auth: session.get('Auth')!.authenticated,
        },
        footer,
      };

    return c.html(
        <Layout {...layout}>
            <DocumentForm /> 
        </Layout>
    )
});

export default documentApp;