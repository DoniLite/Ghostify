import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { List, ListOrdered } from 'lucide-react';

export const ListsPluginComponent: React.FC = () => {
	const [editor] = useLexicalComposerContext();

	const insertList = (type: 'bullet' | 'number') => {
		editor.dispatchCommand(
			{ type: 'INSERT_UNORDERED_LIST_COMMAND' },
			type === 'bullet'
				? 12 /* INSERT_UNORDERED_LIST_COMMAND */
				: 13 /* INSERT_ORDERED_LIST_COMMAND */,
		);
	};

	return (
		<>
			<ListPlugin />
			<CheckListPlugin />
			<div className="border-border mr-2 flex items-center gap-1 border-r pr-2">
				<button
					type="button"
					onClick={() => insertList('bullet')}
					className="hover:bg-accent text-foreground hover:text-accent-foreground rounded p-2"
					title="Liste à puces"
				>
					<List size={16} />
				</button>
				<button
					type="button"
					onClick={() => insertList('number')}
					className="hover:bg-accent text-foreground hover:text-accent-foreground rounded p-2"
					title="Liste numérotée"
				>
					<ListOrdered size={16} />
				</button>
			</div>
		</>
	);
};
