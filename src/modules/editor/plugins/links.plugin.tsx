import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { LinkIcon } from 'lucide-react';
import { useState } from 'react';

export const LinksPluginComponent: React.FC = () => {
	const [editor] = useLexicalComposerContext();
	const [showLinkDialog, setShowLinkDialog] = useState(false);
	const [linkUrl, setLinkUrl] = useState('');

	const insertLink = () => {
		if (!linkUrl) return;
		editor.dispatchCommand(
			{ type: 'TOGGLE_LINK_COMMAND' },
			/* TOGGLE_LINK_COMMAND */ linkUrl,
		);
		setShowLinkDialog(false);
		setLinkUrl('');
	};

	return (
		<>
			<LinkPlugin />
			<div className="border-border relative mr-2 flex items-center gap-1 border-r pr-2">
				<button
					type="button"
					onClick={() => setShowLinkDialog(true)}
					className="hover:bg-accent text-foreground hover:text-accent-foreground rounded p-2"
					title="Insérer un lien"
				>
					<LinkIcon size={16} />
				</button>
				{showLinkDialog && (
					<div className="bg-popover border-border absolute top-full left-0 z-50 mt-1 min-w-64 rounded border p-3 shadow-lg">
						<div className="space-y-2">
							<input
								type="url"
								placeholder="https://example.com"
								value={linkUrl}
								onChange={(e) => setLinkUrl(e.target.value)}
								className="border-border bg-input text-foreground w-full rounded border p-2"
								autoFocus
							/>
							<div className="flex gap-2">
								<button
									type="button"
									onClick={insertLink}
									className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-3 py-1 text-sm"
								>
									Insérer
								</button>
								<button
									type="button"
									onClick={() => setShowLinkDialog(false)}
									className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded px-3 py-1 text-sm"
								>
									Annuler
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};
