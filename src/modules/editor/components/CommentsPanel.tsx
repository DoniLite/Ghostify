import { Check } from 'lucide-react';
import { Comment, User } from '../types.ts';

export const CommentsPanel: React.FC<{
  comments: Comment[];
  onResolveComment: (commentId: string) => void;
  collaborators: User[];
}> = ({ comments, onResolveComment, collaborators }) => {
  const getUser = (id: string) => collaborators.find((c) => c.id === id);
  const activeComments = comments.filter((c) => !c.resolved);

  return (
    <div className='w-80 bg-card border-l border-border h-full p-4 overflow-y-auto'>
      <h2 className='text-lg font-semibold mb-4 text-card-foreground'>
        Commentaires ({activeComments.length})
      </h2>
      {activeComments.length > 0
        ? (
          <div className='space-y-4'>
            {activeComments.map((comment) => {
              const author = getUser(comment.authorId);
              return (
                <div key={comment.id} className='p-3 bg-sidebar rounded-lg'>
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
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className='text-sm text-foreground mb-3'>
                    {comment.content}
                  </p>
                  <button
                    type='button'
                    onClick={() =>
                      onResolveComment(comment.id)}
                    className='w-full text-xs bg-primary/20 text-primary px-2 py-1 rounded hover:bg-primary/30 flex items-center justify-center gap-1'
                  >
                    <Check size={14} /> Marquer comme résolu
                  </button>
                </div>
              );
            })}
          </div>
        )
        : (
          <div className='text-center text-muted-foreground text-sm mt-8'>
            Aucun commentaire actif.
          </div>
        )}
    </div>
  );
};
