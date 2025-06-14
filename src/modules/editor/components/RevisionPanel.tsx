import { Check, X } from 'lucide-react';
import { Revision, User } from '../types.ts';

export const RevisionsPanel: React.FC<{
  revisions: Revision[];
  onAcceptRevision: (revisionId: string) => void;
  onRejectRevision: (revisionId: string) => void;
  collaborators: User[];
}> = ({ revisions, onAcceptRevision, onRejectRevision, collaborators }) => {
  const getUser = (id: string) => collaborators.find((c) => c.id === id);
  const pendingRevisions = revisions.filter((r) => r.accepted === undefined);

  return (
    <div className='w-80 bg-card border-l border-border h-full p-4 overflow-y-auto'>
      <h2 className='text-lg font-semibold mb-4 text-card-foreground'>
        Modifications ({pendingRevisions.length})
      </h2>
      {pendingRevisions.length > 0
        ? (
          <div className='space-y-4'>
            {pendingRevisions.map((revision) => {
              const author = getUser(revision.authorId);
              return (
                <div
                  key={revision.id}
                  className='p-3 bg-sidebar rounded-lg border-l-4'
                  style={{
                    borderColor: revision.type === 'insert'
                      ? 'var(--color-chart-4)'
                      : 'var(--color-destructive)',
                  }}
                >
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center gap-2'>
                      <div
                        className='w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold'
                        style={{
                          backgroundColor: author?.color,
                          color: 'white',
                        }}
                      >
                        {author?.name.charAt(0)}
                      </div>
                      <span className='text-sm font-medium text-foreground'>
                        {author?.name || 'Inconnu'}
                      </span>
                    </div>
                    <span className='text-xs text-muted-foreground'>
                      {new Date(revision.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className='text-sm text-foreground mb-3 break-words'>
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
                  <div className='flex gap-2 mt-2'>
                    <button
                      type='button'
                      onClick={() => onAcceptRevision(revision.id)}
                      className='flex-1 text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded hover:bg-green-600/30 flex items-center justify-center gap-1'
                    >
                      <Check size={14} /> Accepter
                    </button>
                    <button
                      type='button'
                      onClick={() => onRejectRevision(revision.id)}
                      className='flex-1 text-xs bg-red-600/20 text-red-400 px-2 py-1 rounded hover:bg-red-600/30 flex items-center justify-center gap-1'
                    >
                      <X size={14} /> Rejeter
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
        : (
          <div className='text-center text-muted-foreground text-sm mt-8'>
            Aucune modification en attente.
          </div>
        )}
    </div>
  );
};
