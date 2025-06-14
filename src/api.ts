import { cors } from 'hono/cors';
import { factory } from './factory.ts';
import OgRoutes from './routes/og.ts';
import { allowedOrigins } from './utils/security/cors.ts';


const ApiRoutes = factory.createApp()

ApiRoutes.use(
    '*',
    cors({
      origin: allowedOrigins,
      allowMethods: ['GET'],
    }),
  );

ApiRoutes.route('/og', OgRoutes)


export default ApiRoutes;