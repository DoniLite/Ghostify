import { factory } from './factory.ts';
import OgRoutes from './routes/og.ts';
import AuthApp from './controller/auth.ts';
import { serverCors } from './utils/security/cors.ts';

const ApiRoutes = factory.createApp();

ApiRoutes.use(
  '*',
  serverCors(),
);

ApiRoutes.route('/og', OgRoutes);
ApiRoutes.route('/auth', AuthApp);

export default ApiRoutes;
