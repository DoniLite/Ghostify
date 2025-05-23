import path from 'node:path';
import mime from '../../modules/mime.ts';


export function getFileHeaders(filePath: string, download?: boolean) {
  // Extraire le nom de fichier
  const fileName = path.basename(filePath);

  // Déterminer le type MIME
  const contentType = mime.getType(fileName) || 'application/octet-stream';

  // Déterminer le mode de disposition
  const disposition = download
    ? 'attachment' // Affichage direct dans le navigateur
    : 'inline'; // Téléchargement forcé

  return {
    'Content-Disposition': `${disposition}; filename="${fileName}"`,
    'Content-Type': contentType,
  };
}