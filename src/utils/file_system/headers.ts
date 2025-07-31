import path from 'node:path';
import mime from '../../modules/mime.ts';

export function getFileHeaders(filePath: string, download?: boolean) {
	const fileName = path.basename(filePath);

	const contentType = mime.getType(fileName) || 'application/octet-stream';

	const disposition = download ? 'attachment' : 'inline';

	return {
		'Content-Disposition': `${disposition}; filename="${fileName}"`,
		'Content-Type': contentType,
	};
}
