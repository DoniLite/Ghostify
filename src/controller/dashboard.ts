import { factory } from '../factory';
import { authMiddleware } from '../hooks/auth';

const dashboardApp = factory.createApp();

dashboardApp.get('/', authMiddleware, (c) => {
	return c.html('');
});

export default dashboardApp;
