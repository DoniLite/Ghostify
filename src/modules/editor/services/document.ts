import { ensureUrlEnd } from '@/utils/shared.helpers';
import { API_BASE_URL } from '../constants/services_url';
import type { DocumentState } from '../types';

export class DocumentService {
	private baseUrl = API_BASE_URL;

	async saveDocument(
		docId: string,
		doc: Partial<DocumentState>,
	): Promise<DocumentState> {
		const response = await fetch(`${ensureUrlEnd(this.baseUrl)}/documents/${docId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(doc),
		});
		if (!response.ok) {
			throw new Error('Failed to save document');
		}
		return response.json();
	}

	async loadDocument(id: string): Promise<DocumentState> {
		const response = await fetch(`${ensureUrlEnd(this.baseUrl)}/documents/${id}`);
		if (!response.ok) {
			throw new Error('Failed to load document');
		}
		return response.json();
	}

	async exportDocument(
		id: string,
		format: 'docx' | 'pdf' | 'html',
	): Promise<Blob> {
		const response = await fetch(
			`${ensureUrlEnd(this.baseUrl)}/documents/${id}/export?format=${format}`,
		);
		if (!response.ok) {
			throw new Error('Failed to export document');
		}
		return response.blob();
	}

	async importDocument(file: File): Promise<DocumentState> {
		const formData = new FormData();
		formData.append('file', file);

		const response = await fetch(`${ensureUrlEnd(this.baseUrl)}/documents/import`, {
			method: 'POST',
			body: formData,
		});
		if (!response.ok) {
			throw new Error('Failed to import document');
		}
		return response.json();
	}
}
