import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $getSelection, type LexicalNode } from 'lexical';
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
				let node: LexicalNode | undefined;
				if (type === 'h1') node = $createHeadingNode('h1');
				if (type === 'h2') node = $createHeadingNode('h2');
				if (type === 'quote') node = $createQuoteNode();
				if (node) selection.insertNodes([node]);
			}
		});
	};

	return (
		<div className="border-border mr-2 flex items-center gap-1 border-r pr-2">
			<button
				type="button"
				onClick={() => formatText('bold')}
				className="hover:bg-accent text-foreground hover:text-accent-foreground rounded p-2"
				title="Gras (Ctrl+B)"
			>
				<Bold size={16} />
			</button>
			<button
				type="button"
				onClick={() => formatText('italic')}
				className="hover:bg-accent text-foreground hover:text-accent-foreground rounded p-2"
				title="Italique (Ctrl+I)"
			>
				<Italic size={16} />
			</button>
			<button
				type="button"
				onClick={() => formatText('underline')}
				className="hover:bg-accent text-foreground hover:text-accent-foreground rounded p-2"
				title="Souligné (Ctrl+U)"
			>
				<Underline size={16} />
			</button>
			<button
				type="button"
				onClick={() => formatBlock('h1')}
				className="hover:bg-accent text-foreground hover:text-accent-foreground rounded p-2"
				title="Titre 1"
			>
				<Heading1 size={16} />
			</button>
			<button
				type="button"
				onClick={() => formatBlock('h2')}
				className="hover:bg-accent text-foreground hover:text-accent-foreground rounded p-2"
				title="Titre 2"
			>
				<Heading2 size={16} />
			</button>
		</div>
	);
};
