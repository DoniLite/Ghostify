import { factory, ServiceFactory } from '@/factory';

const documentApp = factory.createApp();

documentApp.get('/:id', async (c) => {
	const id = c.req.param('id');
	const documentService = ServiceFactory.getDocumentService();
	const document = await documentService.findById(id);
	if (!document) {
		return c.notFound();
	}
	return c.json(document);
});

documentApp.put('/:id');

export default documentApp;
