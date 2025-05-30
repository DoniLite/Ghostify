export interface OGImageParams {
  type: 'page' | 'document' | 'resume';
  title: string;
  description?: string;
  author?: string;
  template?: string;
  userId?: string;
  documentId?: string;
  theme?: 'light' | 'dark';
  brandColor?: string;
}

export interface DocumentOGData {
  title: string;
  author: string;
  type: 'resume' | 'document';
  createdAt: string;
  template: string;
  preview?: string; // Base64 or preview URI
}
