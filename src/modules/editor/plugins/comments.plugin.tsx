import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection } from 'lexical'
import { MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { Comment } from '../types.ts'

export const CommentsPluginComponent: React.FC<{
  comments: Comment[]
  onAddComment: (nodeKey: string, content: string) => void
  onResolveComment: (commentId: string) => void
}> = ({ comments: _comments, onAddComment, onResolveComment: _onResolveComment }) => {
  const [editor] = useLexicalComposerContext()
  const [showCommentDialog, setShowCommentDialog] = useState(false)
  const [commentText, setCommentText] = useState('')

  const handleAddCommentClick = () => {
    editor.update(() => {
      const selection = $getSelection()
      if (selection) {
        const nodes = selection.getNodes()
        if (nodes.length > 0) {
          setShowCommentDialog(true)
        } else {
          alert('Veuillez sélectionner du texte pour ajouter un commentaire.')
        }
      }
    })
  }

  const addComment = () => {
    editor.update(() => {
      const selection = $getSelection()
      if (selection && commentText.trim()) {
        const nodeKey = selection.getNodes()[0].getKey()
        onAddComment(nodeKey, commentText)
        setCommentText('')
        setShowCommentDialog(false)
      }
    })
  }

  return (
    <div className="border-border relative mr-2 flex items-center gap-1 border-r pr-2">
      <button
        type="button"
        onClick={handleAddCommentClick}
        className="hover:bg-accent text-foreground hover:text-accent-foreground rounded p-2"
        title="Ajouter un commentaire"
      >
        <MessageCircle size={16} />
      </button>
      {showCommentDialog && (
        <div className="bg-popover border-border absolute left-0 top-full z-50 mt-1 min-w-80 rounded border p-3 shadow-lg">
          <div className="space-y-2">
            <textarea
              placeholder="Votre commentaire..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="border-border bg-input text-foreground min-h-20 w-full resize-none rounded border p-2"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addComment}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-3 py-1 text-sm"
              >
                Commenter
              </button>
              <button
                type="button"
                onClick={() => setShowCommentDialog(false)}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded px-3 py-1 text-sm"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
