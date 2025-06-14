import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { Table } from 'lucide-react';

export const TablesPluginComponent: React.FC = () => {
  const [editor] = useLexicalComposerContext();

  const insertTable = () => {
    editor.dispatchCommand(
      { type: 'INSERT_TABLE_COMMAND' },
      /* INSERT_TABLE_COMMAND */ {
        columns: '3',
        rows: '3',
      },
    );
  };

  return (
    <>
      <TablePlugin />
      <div className='flex items-center gap-1 border-r border-border pr-2 mr-2'>
        <button
          type='button'
          onClick={insertTable}
          className='p-2 hover:bg-accent rounded text-foreground hover:text-accent-foreground'
          title='Insérer un tableau'
        >
          <Table size={16} />
        </button>
      </div>
    </>
  );
};
