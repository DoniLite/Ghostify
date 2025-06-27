import { Check } from 'lucide-react'
import type { Comment, User } from '../types'

export const CommentsPanel: React.FC<{
  comments: Comment[]
  onResolveComment: (commentId: string) => void
  collaborators: User[]
}> = ({ comments, onResolveComment, collaborators }) => {
  const getUser = (id: string) => collaborators.find((c) => c.id === id)
  const activeComments = comments.filter((c) => !c.resolved)

  return (
    <div className="bg-card border-border h-full w-80 overflow-y-auto border-l p-4">
      <h2 className="text-card-foreground mb-4 text-lg font-semibold">
        Commentaires ({activeComments.length})
      </h2>
      {activeComments.length > 0 ? (
        <div className="space-y-4">
          {activeComments.map((comment) => {
            const author = getUser(comment.authorId)
            return (
              <div
                key={comment.id}
                className="bg-sidebar rounded-lg p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold"
                      style={{
                        backgroundColor: author?.color,
                        color: 'white'
                      }}
                    >
                      {author?.name.charAt(0)}
                    </div>
                    <span className="text-foreground text-sm font-medium">
                      {author?.name || 'Inconnu'}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-foreground mb-3 text-sm">
                  {comment.content}
                </p>
                <button
                  type="button"
                  onClick={() => onResolveComment(comment.id)}
                  className="bg-primary/20 text-primary hover:bg-primary/30 flex w-full items-center justify-center gap-1 rounded px-2 py-1 text-xs"
                >
                  <Check size={14} /> Marquer comme résolu
                </button>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-muted-foreground mt-8 text-center text-sm">
          Aucun commentaire actif.
        </div>
      )}
    </div>
  )
}
