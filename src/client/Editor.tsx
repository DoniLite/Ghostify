// import 'npm:grapesjs/dist/css/grapes.min.css';
import { grapesjs } from 'npm:grapesjs';
import { FC } from 'hono/jsx';

export interface EditorProps {
    title?: string
}

const Editor: FC<EditorProps> = ({title}) => {
  const editor = grapesjs.init({
    // Indicate where to init the editor. You can also pass an HTMLElement
    container: '#gjs',
    // Get the content for the canvas directly from the element
    // As an alternative we could use: `components: '<h1>Hello World Component!</h1>'`,
    fromElement: true,
    // Size of the editor
    height: 'auto',
    width: 'auto',
    // Disable the storage manager for the moment
    storageManager: false,
    // Avoid any default panel
    panels: { defaults: [] },
  });
  return (
    <>
      <div id='gjs'>
        <h1>{title || 'Editor'}</h1>
      </div>
      <div id='blocks'></div>
    </>
  );
};

export default Editor;
