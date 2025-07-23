import { factory } from './factory';
import OgRoutes from './routes/og';
import { serverCors } from './utils/security/cors';

const ApiRoutes = factory.createApp();

ApiRoutes.use('*', serverCors());

ApiRoutes.route('/og', OgRoutes);

export default ApiRoutes;
