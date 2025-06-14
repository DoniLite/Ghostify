import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { List, ListOrdered } from 'lucide-react';

export const ListsPluginComponent: React.FC = () => {
  const [editor] = useLexicalComposerContext();

  const insertList = (type: 'bullet' | 'number') => {
    editor.dispatchCommand(
      { type: 'INSERT_UNORDERED_LIST_COMMAND' },
      type === 'bullet'
        ? 12 /* INSERT_UNORDERED_LIST_COMMAND */
        : 13, /* INSERT_ORDERED_LIST_COMMAND */
    );
  };

  return (
    <>
      <ListPlugin />
      <CheckListPlugin />
      <div className='flex items-center gap-1 border-r border-border pr-2 mr-2'>
        <button
          type='button'
          onClick={() => insertList('bullet')}
          className='p-2 hover:bg-accent rounded text-foreground hover:text-accent-foreground'
          title='Liste à puces'
        >
          <List size={16} />
        </button>
        <button
          type='button'
          onClick={() => insertList('number')}
          className='p-2 hover:bg-accent rounded text-foreground hover:text-accent-foreground'
          title='Liste numérotée'
        >
          <ListOrdered size={16} />
        </button>
      </div>
    </>
  );
};
