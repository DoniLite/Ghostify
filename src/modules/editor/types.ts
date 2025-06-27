/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
	id: string;
	name: string;
	email: string;
	avatar?: string;
	color: string;
}

export interface Comment {
	id: string;
	authorId: string;
	content: string;
	nodeKey: string;
	resolved: boolean;
	createdAt: Date;
	updatedAt: Date;
	replies?: Comment[];
}

export interface Revision {
	id: string;
	authorId: string;
	type: 'insert' | 'delete' | 'format';
	content: string; // Could be a diff or a description
	nodeKey: string;
	timestamp: Date;
	accepted?: boolean; // true for accepted, false for rejected, undefined for pending
}

export interface DocumentState {
	id: string;
	title: string;
	content: string; // JSON string of Lexical state
	version: number;
	lastModified: Date;
	collaborators: User[];
	comments: Comment[];
	revisions: Revision[];
}

export interface PluginConfig {
	id: string;
	name: string;
	icon: React.ComponentType<any>;
	description: string;
	category: 'formatting' | 'media' | 'structure' | 'collaboration' | 'advanced';
	component: React.ComponentType<any>;
	dependencies?: string[];
	nodes?: any[];
}

export interface CollaborationUpdate {
	type: 'content' | 'cursor' | 'comment' | 'revision';
	data: any;
	userId: string;
	timestamp: number;
}
