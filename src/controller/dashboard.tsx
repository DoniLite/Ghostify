import Dash from '../components/dashboard/Dash.tsx';
import Wrapper from '../components/dashboard/Wrapper.tsx';
import TLayout, {
  type TLayout as LayoutType,
} from '../components/shared/TLayout.tsx';
import { factory } from '../factory.ts';
import { authMiddleware } from '../hooks/auth.ts';
import { getLoc } from '../utils.ts';

const dashboardApp = factory.createApp();

dashboardApp.get('/', authMiddleware, async (c) => {
  const lang = c.get('language') as 'fr' | 'es' | 'en';
  const loc = await getLoc(lang);
  const props: LayoutType = {
    locales: loc,
  };
  return c.html(
    <TLayout {...props}>
      <Wrapper>
        <Dash></Dash>
      </Wrapper>
    </TLayout>
  );
});

export default dashboardApp;
