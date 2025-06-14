
export interface MimeDatabase {
  [extension: string]: string;
}

export class MimeTypes {
  private db: MimeDatabase;

  constructor(customTypes: MimeDatabase = {}) {
    this.db = {
      // Documents
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
      
      // Video
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
      
      // Other
      'wasm': 'application/wasm',
      'xml': 'application/xml',
      'woff': 'font/woff',
      'woff2': 'font/woff2',
      'ttf': 'font/ttf',
      'otf': 'font/otf',
      
      // Fallback
      'bin': 'application/octet-stream',
      
      // Deno specific files
      'jsonc': 'application/jsonc',
      'toml': 'application/toml',
      'yml': 'application/yaml',
      'yaml': 'application/yaml',
    };
    
    this.db = { ...this.db, ...customTypes };
  }

  /**
   * Obtaining the MIME Type from the file extension
   */
  getType(path: string): string | null {
    const extension = path.split('.').pop()?.toLowerCase() || '';
    return this.db[extension] || null;
  }

  /**
   * Obtaining file extension from the MIME
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
   * Adding new MIME Type to the store
   */
  addType(extension: string, mimeType: string): void {
    this.db[extension.toLowerCase()] = mimeType;
  }

  /**
   * Removing a MIME Type
   */
  removeType(extension: string): void {
    delete this.db[extension.toLowerCase()];
  }

  /**
   * Verifying if any extension is known
   */
  hasType(extension: string): boolean {
    return extension.toLowerCase() in this.db;
  }
}

export default new MimeTypes();