import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import {
	Bold,
	GitBranch,
	LinkIcon,
	List,
	MessageCircle,
	Table,
} from 'lucide-react';
import { CommentsPluginComponent } from './plugins/comments.plugin';
import { LinksPluginComponent } from './plugins/links.plugin';
import { ListsPluginComponent } from './plugins/lists.plugin';
import { RevisionsPluginComponent } from './plugins/revisions.plugin';
import { RichTextPluginComponent } from './plugins/richText.plugin';
import { TablesPluginComponent } from './plugins/tables.plugin';
import type { PluginConfig } from './types';

export class PluginManager {
	private loadedPlugins = new Map<string, PluginConfig>();
	private pluginRegistry: Record<string, PluginConfig>;
	// biome-ignore lint/suspicious/noExplicitAny: There are various Type of Nodes
	private pluginNodes: any[] = [];

	constructor() {
		this.pluginRegistry = {
			'rich-text': {
				id: 'rich-text',
				name: 'Texte riche',
				icon: Bold,
				description: 'Formatage de base (gras, italique, titres).',
				category: 'formatting',
				component: RichTextPluginComponent,
				nodes: [HeadingNode, QuoteNode],
			},
			lists: {
				id: 'lists',
				name: 'Listes',
				icon: List,
				description: 'Listes à puces et numérotées.',
				category: 'structure',
				component: ListsPluginComponent,
				nodes: [ListNode, ListItemNode],
			},
			tables: {
				id: 'tables',
				name: 'Tableaux',
				icon: Table,
				description: 'Création et édition de tableaux.',
				category: 'structure',
				component: TablesPluginComponent,
				nodes: [TableNode, TableCellNode, TableRowNode],
			},
			links: {
				id: 'links',
				name: 'Liens',
				icon: LinkIcon,
				description: 'Insertion de liens hypertextes.',
				category: 'formatting',
				component: LinksPluginComponent,
				nodes: [LinkNode],
			},
			comments: {
				id: 'comments',
				name: 'Commentaires',
				icon: MessageCircle,
				description: 'Ajoutez des commentaires sur le document.',
				category: 'collaboration',
				component: CommentsPluginComponent,
				nodes: [
					/* Custom CommentNode could go here */
				],
			},
			revisions: {
				id: 'revisions',
				name: 'Suivi des modifications',
				icon: GitBranch,
				description: 'Suivez et gérez les modifications.',
				category: 'collaboration',
				component: RevisionsPluginComponent,
				nodes: [
					/* Custom RevisionNode could go here */
				],
			},
		};
	}

	loadPlugin(pluginId: string): PluginConfig | undefined {
		if (this.loadedPlugins.has(pluginId)) {
			return this.loadedPlugins.get(pluginId);
		}

		const plugin = this.pluginRegistry[pluginId];
		if (plugin) {
			console.log(`Loading plugin: ${plugin.name}`);
			this.loadedPlugins.set(pluginId, plugin);
			if (plugin.nodes) {
				this.pluginNodes.push(...plugin.nodes);
			}
			return plugin;
		}
		return undefined;
	}

	getAvailablePlugins(): PluginConfig[] {
		return Object.values(this.pluginRegistry);
	}

	getLoadedPlugins(): PluginConfig[] {
		return Array.from(this.loadedPlugins.values());
	}

	// biome-ignore lint/suspicious/noExplicitAny: Type assignment can cause compatibility problems
	getAllNodes(): any[] {
		const baseNodes = [
			HeadingNode,
			QuoteNode,
			ListNode,
			ListItemNode,
			TableNode,
			TableCellNode,
			TableRowNode,
			LinkNode,
		];
		return [...new Set([...baseNodes, ...this.pluginNodes])];
	}
}
