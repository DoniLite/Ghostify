import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection } from 'lexical';
import { GitBranch } from 'lucide-react';
import { useState } from 'react';
import { Revision } from '../types.ts';

export const RevisionsPluginComponent: React.FC<{
	revisions: Revision[];
	onAcceptRevision: (revisionId: string) => void;
	onRejectRevision: (revisionId: string) => void;
	onAddRevision: (nodeKey: string, content: string) => void;
}> = ({
	revisions: _revisions,
	onAcceptRevision: _onAcceptRevision,
	onRejectRevision: _onRejectRevision,
	onAddRevision: onAddRevision,
}) => {
	const [editor] = useLexicalComposerContext();
	const [showRevisionDialog, setShowRevisionDialog] = useState(false);
	const [revisionText, setRevisionText] = useState('');

	const _handleAddRevisionClick = () => {
		editor.update(() => {
			const selection = $getSelection();
			if (selection) {
				const nodes = selection.getNodes();
				const nodeText = nodes[0].getTextContent();
				if (nodes.length > 0) {
					setRevisionText(nodeText);
					setShowRevisionDialog(true);
				} else {
					alert('Veuillez sélectionner du texte pour ajouter une révision.');
				}
			}
		});
	};

	const addRevision = () => {
		editor.update(() => {
			const selection = $getSelection();
			if (selection && revisionText.trim()) {
				const nodeKey = selection.getNodes()[0].getKey();
				onAddRevision(nodeKey, revisionText);
				setRevisionText('');
				setShowRevisionDialog(false);
			}
		});
	};

	return (
		<div className="border-border relative mr-2 flex items-center gap-1 border-r pr-2">
			<button
				type="button"
				onClick={_handleAddRevisionClick}
				className="hover:bg-accent text-foreground hover:text-accent-foreground rounded p-2"
				title="Suivi des modifications"
			>
				<GitBranch size={16} />
			</button>
			{showRevisionDialog && (
				<div className="bg-popover border-border absolute left-0 top-full z-50 mt-1 min-w-80 rounded border p-3 shadow-lg">
					<div className="space-y-2">
						<textarea
							placeholder="Description de la modification..."
							value={revisionText}
							onChange={(e) => setRevisionText(e.target.value)}
							className="border-border bg-input text-foreground min-h-20 w-full resize-none rounded border p-2"
							autoFocus
						/>
						<div className="flex gap-2">
							<button
								type="button"
								onClick={addRevision}
								className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-3 py-1 text-sm"
							>
								Ajouter
							</button>
							<button
								type="button"
								onClick={() => setShowRevisionDialog(false)}
								className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded px-3 py-1 text-sm"
							>
								Annuler
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
