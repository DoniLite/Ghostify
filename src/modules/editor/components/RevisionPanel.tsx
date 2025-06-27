import { Check, X } from 'lucide-react'
import type { Revision, User } from '../types'

export const RevisionsPanel: React.FC<{
  revisions: Revision[]
  onAcceptRevision: (revisionId: string) => void
  onRejectRevision: (revisionId: string) => void
  collaborators: User[]
}> = ({ revisions, onAcceptRevision, onRejectRevision, collaborators }) => {
  const getUser = (id: string) => collaborators.find((c) => c.id === id)
  const pendingRevisions = revisions.filter((r) => r.accepted === undefined)

  return (
    <div className="bg-card border-border h-full w-80 overflow-y-auto border-l p-4">
      <h2 className="text-card-foreground mb-4 text-lg font-semibold">
        Modifications ({pendingRevisions.length})
      </h2>
      {pendingRevisions.length > 0 ? (
        <div className="space-y-4">
          {pendingRevisions.map((revision) => {
            const author = getUser(revision.authorId)
            return (
              <div
                key={revision.id}
                className="bg-sidebar rounded-lg border-l-4 p-3"
                style={{
                  borderColor:
                    revision.type === 'insert'
                      ? 'var(--color-chart-4)'
                      : 'var(--color-destructive)'
                }}
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
                    {new Date(revision.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-foreground mb-3 text-sm break-words">
                  <span
                    className={`font-bold ${
                      revision.type === 'insert'
                        ? 'text-[var(--color-chart-4)]'
                        : 'text-[var(--color-destructive)]'
                    }`}
                  >
                    {revision.type === 'insert' ? 'Ajout' : 'Suppression'}:
                  </span>
                  "{revision.content}"
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onAcceptRevision(revision.id)}
                    className="flex flex-1 items-center justify-center gap-1 rounded bg-green-600/20 px-2 py-1 text-xs text-green-400 hover:bg-green-600/30"
                  >
                    <Check size={14} /> Accepter
                  </button>
                  <button
                    type="button"
                    onClick={() => onRejectRevision(revision.id)}
                    className="flex flex-1 items-center justify-center gap-1 rounded bg-red-600/20 px-2 py-1 text-xs text-red-400 hover:bg-red-600/30"
                  >
                    <X size={14} /> Rejeter
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-muted-foreground mt-8 text-center text-sm">
          Aucune modification en attente.
        </div>
      )}
    </div>
  )
}
