import { factory } from '../factory.ts';
import { authMiddleware } from '../hooks/auth.ts';

const dashboardApp = factory.createApp();

dashboardApp.get('/', authMiddleware, (c) => {
  return c.html('');
});

export default dashboardApp;
