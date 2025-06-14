import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection } from 'lexical';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { Bold, Heading1, Heading2, Italic, Underline } from 'lucide-react';

export const RichTextPluginComponent: React.FC = () => {
  const [editor] = useLexicalComposerContext();

  const formatText = (format: 'bold' | 'italic' | 'underline') => {
    editor.dispatchCommand(
      { type: 'FORMAT_TEXT_COMMAND' },
      /* FORMAT_TEXT_COMMAND */ format,
    );
  };

  const formatBlock = (type: 'h1' | 'h2' | 'quote') => {
    editor.update(() => {
      const selection = $getSelection();
      if (selection) {
        let node;
        if (type === 'h1') node = $createHeadingNode('h1');
        if (type === 'h2') node = $createHeadingNode('h2');
        if (type === 'quote') node = $createQuoteNode();
        if (node) selection.insertNodes([node]);
      }
    });
  };

  return (
    <div className='flex items-center gap-1 border-r border-border pr-2 mr-2'>
      <button
        type='button'
        onClick={() => formatText('bold')}
        className='p-2 hover:bg-accent rounded text-foreground hover:text-accent-foreground'
        title='Gras (Ctrl+B)'
      >
        <Bold size={16} />
      </button>
      <button
        type='button'
        onClick={() => formatText('italic')}
        className='p-2 hover:bg-accent rounded text-foreground hover:text-accent-foreground'
        title='Italique (Ctrl+I)'
      >
        <Italic size={16} />
      </button>
      <button
        type='button'
        onClick={() => formatText('underline')}
        className='p-2 hover:bg-accent rounded text-foreground hover:text-accent-foreground'
        title='Souligné (Ctrl+U)'
      >
        <Underline size={16} />
      </button>
      <button
        type='button'
        onClick={() => formatBlock('h1')}
        className='p-2 hover:bg-accent rounded text-foreground hover:text-accent-foreground'
        title='Titre 1'
      >
        <Heading1 size={16} />
      </button>
      <button
        type='button'
        onClick={() => formatBlock('h2')}
        className='p-2 hover:bg-accent rounded text-foreground hover:text-accent-foreground'
        title='Titre 2'
      >
        <Heading2 size={16} />
      </button>
    </div>
  );
};
