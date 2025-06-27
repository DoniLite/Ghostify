import {
	Download,
	GitBranch,
	Loader2,
	MessageCircle,
	Plus,
	Save,
	Upload,
} from 'lucide-react';
import React, { useState } from 'react';
import type { Comment, PluginConfig, Revision, User } from '../types';

export const Toolbar: React.FC<{
	onPluginLoad: (pluginId: string) => void;
	loadedPlugins: PluginConfig[];
	availablePlugins: PluginConfig[];
	onSave: () => void;
	onExport: (format: 'docx' | 'pdf' | 'html') => void;
	onImport: () => void;
	isCollaborating: boolean;
	isSaving: boolean;
	collaborators: User[];
	comments: Comment[];
	revisions: Revision[];
	onAddComment: (nodeKey: string, content: string) => void;
	onResolveComment: (commentId: string) => void;
	onAcceptRevision: (revisionId: string) => void;
	onRejectRevision: (revisionId: string) => void;
	toggleSidebar: (panel: 'comments' | 'revisions') => void;
}> = ({
	onPluginLoad,
	loadedPlugins,
	availablePlugins,
	onSave,
	onExport,
	onImport,
	isCollaborating,
	isSaving,
	collaborators,
	comments,
	revisions,
	onAddComment,
	onResolveComment,
	onAcceptRevision,
	onRejectRevision,
	toggleSidebar,
}) => {
	const [showPluginMenu, setShowPluginMenu] = useState(false);
	const [showExportMenu, setShowExportMenu] = useState(false);

	const loadedPluginIds = new Set(loadedPlugins.map((p) => p.id));

	return (
		<div className="border-border bg-card flex flex-wrap items-center justify-between gap-1 border-b p-2">
			<div className="flex flex-grow items-center">
				<div className="mr-4 flex items-center gap-1">
					<button
						type="button"
						onClick={onSave}
						className="hover:bg-accent text-foreground hover:text-accent-foreground rounded p-2"
						title="Sauvegarder (Ctrl+S)"
					>
						{isSaving ? (
							<Loader2 size={16} className="animate-spin" />
						) : (
							<Save size={16} />
						)}
					</button>
					<div className="relative">
						<button
							type="button"
							onClick={() => setShowExportMenu(!showExportMenu)}
							className="hover:bg-accent text-foreground hover:text-accent-foreground rounded p-2"
							title="Exporter"
						>
							<Download size={16} />
						</button>
						{showExportMenu && (
							<div className="bg-popover border-border absolute top-full left-0 z-50 mt-1 min-w-32 rounded border shadow-lg">
								<button
									type="button"
									onClick={() => {
										onExport('docx');
										setShowExportMenu(false);
									}}
									className="hover:bg-accent text-popover-foreground hover:text-accent-foreground w-full rounded p-2 text-left"
								>
									Word (.docx)
								</button>
								<button
									type="button"
									onClick={() => {
										onExport('pdf');
										setShowExportMenu(false);
									}}
									className="hover:bg-accent text-popover-foreground hover:text-accent-foreground w-full rounded p-2 text-left"
								>
									PDF
								</button>
								<button
									type="button"
									onClick={() => {
										onExport('html');
										setShowExportMenu(false);
									}}
									className="hover:bg-accent text-popover-foreground hover:text-accent-foreground w-full rounded p-2 text-left"
								>
									HTML
								</button>
							</div>
						)}
					</div>
					<button
						type="button"
						onClick={onImport}
						className="hover:bg-accent text-foreground hover:text-accent-foreground rounded p-2"
						title="Importer"
					>
						<Upload size={16} />
					</button>
				</div>

				{/* Plugins chargés */}
				{loadedPlugins.map((plugin) => {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const props: any = {};
					if (plugin.id === 'comments') {
						props.comments = comments;
						props.onAddComment = onAddComment;
						props.onResolveComment = onResolveComment;
					} else if (plugin.id === 'revisions') {
						props.revisions = revisions;
						props.onAcceptRevision = onAcceptRevision;
						props.onRejectRevision = onRejectRevision;
					}
					return React.createElement(plugin.component, {
						key: plugin.id,
						...props,
					});
				})}

				{/* Bouton pour ajouter des plugins */}
				<div className="relative">
					<button
						type="button"
						onClick={() => setShowPluginMenu(!showPluginMenu)}
						className="bg-secondary text-secondary-foreground hover:bg-secondary/80 ml-2 rounded-full p-2"
						title="Ajouter des fonctionnalités"
					>
						<Plus size={16} />
					</button>
					{showPluginMenu && (
						<div className="bg-popover border-border absolute top-full left-0 z-50 mt-1 min-w-64 rounded border p-2 shadow-lg">
							<h3 className="text-popover-foreground p-2 text-sm font-semibold">
								Fonctionnalités disponibles
							</h3>
							{availablePlugins.map(
								(plugin) =>
									!loadedPluginIds.has(plugin.id) && (
										<button
											type="button"
											key={plugin.id}
											onClick={() => {
												onPluginLoad(plugin.id);
												setShowPluginMenu(false);
											}}
											className="hover:bg-accent flex w-full items-center gap-3 rounded p-2 text-left"
										>
											<plugin.icon
												size={18}
												className="text-accent-foreground"
											/>
											<div>
												<p className="text-popover-foreground font-medium">
													{plugin.name}
												</p>
												<p className="text-muted-foreground text-xs">
													{plugin.description}
												</p>
											</div>
										</button>
									),
							)}
						</div>
					)}
				</div>
			</div>

			{/* Indicateurs de collaboration */}
			<div className="flex items-center gap-4">
				<div className="flex items-center -space-x-2">
					{collaborators.map((user) => (
						<div
							key={user.id}
							title={user.name}
							className="border-card flex h-8 w-8 items-center justify-center rounded-full border-2 font-bold text-white"
							style={{ backgroundColor: user.color }}
						>
							{user.name.charAt(0)}
						</div>
					))}
				</div>
				<button
					type="button"
					onClick={() => toggleSidebar('comments')}
					className="hover:bg-accent text-foreground hover:text-accent-foreground relative rounded p-2"
					title="Commentaires"
				>
					<MessageCircle size={18} />
					{comments.filter((c) => !c.resolved).length > 0 && (
						<span className="bg-primary text-primary-foreground absolute top-0 right-0 h-4 w-4 rounded-full text-xs">
							{comments.filter((c) => !c.resolved).length}
						</span>
					)}
				</button>
				<button
					type="button"
					onClick={() => toggleSidebar('revisions')}
					className="hover:bg-accent text-foreground hover:text-accent-foreground relative rounded p-2"
					title="Suivi des modifications"
				>
					<GitBranch size={18} />
					{revisions.filter((r) => r.accepted === undefined).length > 0 && (
						<span className="bg-primary text-primary-foreground absolute top-0 right-0 h-4 w-4 rounded-full text-xs">
							{revisions.filter((r) => r.accepted === undefined).length}
						</span>
					)}
				</button>
				<span
					className={`h-3 w-3 rounded-full ${isCollaborating ? 'bg-green-500' : 'bg-red-500'}`}
					title={isCollaborating ? 'Connecté' : 'Déconnecté'}
				></span>
			</div>
		</div>
	);
};
