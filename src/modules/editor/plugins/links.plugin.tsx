import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useState } from 'react';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { LinkIcon } from 'lucide-react';

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
      <div className='relative flex items-center gap-1 border-r border-border pr-2 mr-2'>
        <button
          type='button'
          onClick={() => setShowLinkDialog(true)}
          className='p-2 hover:bg-accent rounded text-foreground hover:text-accent-foreground'
          title='Insérer un lien'
        >
          <LinkIcon size={16} />
        </button>
        {showLinkDialog && (
          <div className='absolute top-full left-0 mt-1 bg-popover border border-border rounded shadow-lg z-50 p-3 min-w-64'>
            <div className='space-y-2'>
              <input
                type='url'
                placeholder='https://example.com'
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className='w-full p-2 border border-border rounded bg-input text-foreground'
                autoFocus
              />
              <div className='flex gap-2'>
                <button
                  type='button'
                  onClick={insertLink}
                  className='px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90'
                >
                  Insérer
                </button>
                <button
                  type='button'
                  onClick={() => setShowLinkDialog(false)}
                  className='px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/90'
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
