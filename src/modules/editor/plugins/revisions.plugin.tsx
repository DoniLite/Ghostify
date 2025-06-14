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
}> = (
  {
    revisions: _revisions,
    onAcceptRevision: _onAcceptRevision,
    onRejectRevision: _onRejectRevision,
    onAddRevision: onAddRevision,
  },
) => {
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
    <div className='relative flex items-center gap-1 border-r border-border pr-2 mr-2'>
      <button
        type='button'
        onClick={_handleAddRevisionClick}
        className='p-2 hover:bg-accent rounded text-foreground hover:text-accent-foreground'
        title='Suivi des modifications'
      >
        <GitBranch size={16} />
      </button>
      {showRevisionDialog && (
        <div className='absolute top-full left-0 mt-1 bg-popover border border-border rounded shadow-lg z-50 p-3 min-w-80'>
          <div className='space-y-2'>
            <textarea
              placeholder='Description de la modification...'
              value={revisionText}
              onChange={(e) => setRevisionText(e.target.value)}
              className='w-full p-2 border border-border rounded bg-input text-foreground min-h-20 resize-none'
              autoFocus
            />
            <div className='flex gap-2'>
              <button
                type='button'
                onClick={addRevision}
                className='px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90'
              >
                Ajouter
              </button>
              <button
                type='button'
                onClick={() => setShowRevisionDialog(false)}
                className='px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/90'
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
