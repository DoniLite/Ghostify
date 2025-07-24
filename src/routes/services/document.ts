import { factory, ServiceFactory } from '@/factory';

const documentApp = factory.createApp();

documentApp.get('/new', async (c) => {
	const documentService = ServiceFactory.getDocumentService();
	const newDoc = await documentService.newDocument();
	return c.redirect(`/editor/user1/${newDoc.id}`);
});

documentApp.get('/:id', async (c) => {
	const id = c.req.param('id');
	const documentService = ServiceFactory.getDocumentService();
	const document = await documentService.findById(id);
	if (!document) {
		return c.notFound();
	}
	return c.json(document);
});

documentApp.put('/:id', async (c) => {
	const id = c.req.param('id');
	const documentService = ServiceFactory.getDocumentService();
	const dto = await c.req.json();
	const updatedDocument = await documentService.update(id, dto, c);
	if (!updatedDocument) {
		return c.notFound();
	}
	return c.json(updatedDocument);
});

export default documentApp;
