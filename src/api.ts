import { factory } from './factory';
import documentApp from './routes/services/document';
import OgRoutes from './routes/services/og';
import { serverCors } from './utils/security/cors';

const ApiRoutes = factory.createApp();

ApiRoutes.use('*', serverCors());

ApiRoutes.route('/og', OgRoutes);
ApiRoutes.route('/document', documentApp);

export default ApiRoutes;
