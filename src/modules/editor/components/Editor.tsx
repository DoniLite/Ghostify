import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { PluginManager } from '../pluginManager.ts';
import { CollaborationService } from '../services/collaboration.ts';
import { DocumentService } from '../services/document.ts';
import { DocumentState, PluginConfig } from '../types.ts';
import { CommentsPanel } from './CommentsPanel.tsx';
import { EditorPlaceholder } from './EditorPlaceholder.tsx';
import { RevisionsPanel } from './RevisionPanel.tsx';
import { Toolbar } from './ToolBar.tsx';
import { EditorState, LexicalEditor } from 'lexical';

export const Editor: React.FC<{ documentId: string; userId: string }> = (
  { documentId, userId },
) => {
  const [docState, setDocState] = useState<DocumentState | null>(null);
  const [loadedPlugins, setLoadedPlugins] = useState<PluginConfig[]>([]);
  const [activeSidebar, setActiveSidebar] = useState<
    'comments' | 'revisions' | null
  >(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isCollaborating, setIsCollaborating] = useState(false);
  const editorRef = useRef<LexicalEditor>(null);

  // Initialisation des services et managers. `useMemo` pour éviter les ré-instanciations.
  const documentService = useMemo(() => new DocumentService(), []);
  const pluginManager = useMemo(() => new PluginManager(), []);
  const collaborationService = useMemo(
    () => new CollaborationService(documentId, userId),
    [documentId, userId],
  );

  // Chargement initial du document et configuration de la collaboration
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await documentService.loadDocument(documentId);
        setDocState(data);
        // Charger les plugins de base
        handlePluginLoad('rich-text');
        handlePluginLoad('lists');
      } catch (error) {
        console.error('Erreur lors du chargement du document:', error);
        // Créer un document vide en cas d'échec
        setDocState({
          id: documentId,
          title: 'Nouveau Document',
          content:
            '{"root":{"children":[{"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"version":1}}',
          version: 1,
          lastModified: new Date(),
          collaborators: [],
          comments: [],
          revisions: [],
        });
      }
    };
    loadData();

    // Listeners WebSocket
    collaborationService.on('connected', () => setIsCollaborating(true));
    collaborationService.on('disconnected', () => setIsCollaborating(false));
    collaborationService.on('content-update', (message: { data: string }) => {
      if (editorRef.current) {
        const newEditorState = editorRef.current.parseEditorState(message.data);
        editorRef.current.setEditorState(newEditorState);
      }
    });
    // TODO: Ajouter les listeners pour 'comment-update' et 'revision-update'

    return () => collaborationService.disconnect();
  }, [documentId, documentService, collaborationService, pluginManager]);

  const handlePluginLoad = useCallback((pluginId: string) => {
    const plugin = pluginManager.loadPlugin(pluginId);
    if (plugin) {
      setLoadedPlugins((prev) => [
        ...prev.filter((p) => p.id !== pluginId),
        plugin,
      ]);
    }
  }, [pluginManager]);

  const handleSave = useCallback(async () => {
    if (!docState) return;
    setIsSaving(true);
    try {
      await documentService.saveDocument(docState.id, docState);
      console.log('Document sauvegardé.');
    } catch (error) {
      console.error('Erreur de sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  }, [docState, documentService]);

  const handleEditorChange = (
    editorState: EditorState,
    editor: LexicalEditor,
  ) => {
    editorRef.current = editor;
    const jsonState = JSON.stringify(editorState.toJSON());
    setDocState((prev) => prev ? { ...prev, content: jsonState } : null);
    collaborationService.send('content-update', jsonState);
  };

  // TODO: Implémenter la logique métier pour les commentaires et révisions
  const handleAddComment = (nodeKey: string, content: string) =>
    console.log('Add comment:', { nodeKey, content });
  const handleResolveComment = (commentId: string) =>
    console.log('Resolve comment:', commentId);
  const handleAcceptRevision = (revisionId: string) =>
    console.log('Accept revision:', revisionId);
  const handleRejectRevision = (revisionId: string) =>
    console.log('Reject revision:', revisionId);

  const toggleSidebar = (panel: 'comments' | 'revisions') => {
    setActiveSidebar((prev) => prev === panel ? null : panel);
  };

  const initialConfig = useMemo(() => ({
    namespace: 'WordEditor',
    theme: {/* Thème Lexical (pas le thème CSS) */},
    onError: (error: Error) => {
      throw error;
    },
    editorState: docState?.content,
    nodes: pluginManager.getAllNodes(),
  }), [docState?.content, loadedPlugins]); // La clé sur LexicalComposer forcera la re-création si les nodes changent

  if (!docState) {
    return (
      <div className='flex items-center justify-center h-screen bg-background text-foreground'>
        <Loader2 size={32} className='animate-spin fill-primary' />{' '}
        Chargement du document...
      </div>
    );
  }

  return (
    <LexicalComposer
      initialConfig={initialConfig}
      key={pluginManager.getAllNodes().length}
    >
      <div className='flex flex-col h-screen bg-background text-foreground font-inter'>
        <Toolbar
          onPluginLoad={handlePluginLoad}
          loadedPlugins={loadedPlugins}
          availablePlugins={pluginManager.getAvailablePlugins()}
          onSave={handleSave}
          onExport={(format) =>
            documentService.exportDocument(docState.id, format)}
          onImport={() => {/* Logique d'upload de fichier */}}
          isCollaborating={isCollaborating}
          isSaving={isSaving}
          collaborators={docState.collaborators}
          comments={docState.comments}
          revisions={docState.revisions}
          onAddComment={handleAddComment}
          onResolveComment={handleResolveComment}
          onAcceptRevision={handleAcceptRevision}
          onRejectRevision={handleRejectRevision}
          toggleSidebar={toggleSidebar}
        />
        <div className='flex-grow flex'>
          <div className='flex-grow h-full relative overflow-y-auto'>
            <RichTextPlugin
              contentEditable={
                <ContentEditable className='outline-none h-full p-4 caret-primary' />
              }
              placeholder={<EditorPlaceholder />}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={handleEditorChange} />
            <HistoryPlugin />
          </div>
          {activeSidebar === 'comments' && (
            <CommentsPanel
              comments={docState.comments}
              onResolveComment={handleResolveComment}
              collaborators={docState.collaborators}
            />
          )}
          {activeSidebar === 'revisions' && (
            <RevisionsPanel
              revisions={docState.revisions}
              onAcceptRevision={handleAcceptRevision}
              onRejectRevision={handleRejectRevision}
              collaborators={docState.collaborators}
            />
          )}
        </div>
      </div>
    </LexicalComposer>
  );
};
