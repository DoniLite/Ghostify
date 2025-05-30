// mime.ts - Module MIME simple pour Deno fonctionnant hors ligne

export interface MimeDatabase {
  [extension: string]: string;
}

export class MimeTypes {
  private db: MimeDatabase;

  constructor(customTypes: MimeDatabase = {}) {
    this.db = {
      // Documents texte
      'txt': 'text/plain',
      'html': 'text/html',
      'htm': 'text/html',
      'css': 'text/css',
      'csv': 'text/csv',
      'md': 'text/markdown',
      
      // JavaScript
      'js': 'application/javascript',
      'mjs': 'application/javascript',
      'ts': 'application/typescript',
      'jsx': 'text/jsx',
      'tsx': 'text/tsx',
      
      // JSON
      'json': 'application/json',
      
      // Images
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'ico': 'image/x-icon',
      
      // Audio
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'ogg': 'audio/ogg',
      
      // Vidéo
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      
      // Documents
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      
      // Archives
      'zip': 'application/zip',
      'tar': 'application/x-tar',
      'gz': 'application/gzip',
      
      // Autres
      'wasm': 'application/wasm',
      'xml': 'application/xml',
      'woff': 'font/woff',
      'woff2': 'font/woff2',
      'ttf': 'font/ttf',
      'otf': 'font/otf',
      
      // Fallback
      'bin': 'application/octet-stream',
      
      // Fichiers spécifiques à Deno
      'jsonc': 'application/jsonc',
      'toml': 'application/toml',
      'yml': 'application/yaml',
      'yaml': 'application/yaml',
    };
    
    // Fusionner avec les types personnalisés
    this.db = { ...this.db, ...customTypes };
  }

  /**
   * Obtient le type MIME à partir de l'extension de fichier
   */
  getType(path: string): string | null {
    const extension = path.split('.').pop()?.toLowerCase() || '';
    return this.db[extension] || null;
  }

  /**
   * Obtient l'extension de fichier à partir du type MIME
   */
  getExtension(mimeType: string): string | null {
    for (const [ext, type] of Object.entries(this.db)) {
      if (type === mimeType) {
        return ext;
      }
    }
    return null;
  }

  /**
   * Ajoute ou met à jour un type MIME
   */
  addType(extension: string, mimeType: string): void {
    this.db[extension.toLowerCase()] = mimeType;
  }

  /**
   * Supprime un type MIME
   */
  removeType(extension: string): void {
    delete this.db[extension.toLowerCase()];
  }

  /**
   * Vérifie si une extension est connue
   */
  hasType(extension: string): boolean {
    return extension.toLowerCase() in this.db;
  }
}

// Exportation d'une instance par défaut prête à l'emploi
export default new MimeTypes();