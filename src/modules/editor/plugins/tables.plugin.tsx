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
			<div className="border-border mr-2 flex items-center gap-1 border-r pr-2">
				<button
					type="button"
					onClick={insertTable}
					className="hover:bg-accent text-foreground hover:text-accent-foreground rounded p-2"
					title="Insérer un tableau"
				>
					<Table size={16} />
				</button>
			</div>
		</>
	);
};
