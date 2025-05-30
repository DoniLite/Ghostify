import { factory } from './factory.ts';
import OgRoutes from './routes/og.ts';


const ApiRoutes = factory.createApp()

ApiRoutes.route('/og', OgRoutes)


export default ApiRoutes;