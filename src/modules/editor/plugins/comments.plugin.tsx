import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useState } from 'react';
import { $getSelection } from 'lexical';
import { MessageCircle } from 'lucide-react';
import { Comment } from '../types.ts';

export const CommentsPluginComponent: React.FC<{
  comments: Comment[];
  onAddComment: (nodeKey: string, content: string) => void;
  onResolveComment: (commentId: string) => void;
}> = (
  { comments: _comments, onAddComment, onResolveComment: _onResolveComment },
) => {
  const [editor] = useLexicalComposerContext();
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleAddCommentClick = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (selection) {
        const nodes = selection.getNodes();
        if (nodes.length > 0) {
          setShowCommentDialog(true);
        } else {
          alert('Veuillez sélectionner du texte pour ajouter un commentaire.');
        }
      }
    });
  };

  const addComment = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (selection && commentText.trim()) {
        const nodeKey = selection.getNodes()[0].getKey();
        onAddComment(nodeKey, commentText);
        setCommentText('');
        setShowCommentDialog(false);
      }
    });
  };

  return (
    <div className='relative flex items-center gap-1 border-r border-border pr-2 mr-2'>
      <button
        type='button'
        onClick={handleAddCommentClick}
        className='p-2 hover:bg-accent rounded text-foreground hover:text-accent-foreground'
        title='Ajouter un commentaire'
      >
        <MessageCircle size={16} />
      </button>
      {showCommentDialog && (
        <div className='absolute top-full left-0 mt-1 bg-popover border border-border rounded shadow-lg z-50 p-3 min-w-80'>
          <div className='space-y-2'>
            <textarea
              placeholder='Votre commentaire...'
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className='w-full p-2 border border-border rounded bg-input text-foreground min-h-20 resize-none'
              autoFocus
            />
            <div className='flex gap-2'>
              <button
                type='button'
                onClick={addComment}
                className='px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90'
              >
                Commenter
              </button>
              <button
                type='button'
                onClick={() => setShowCommentDialog(false)}
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
