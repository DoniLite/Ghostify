import React, { useState } from 'react';
import { Comment, PluginConfig, Revision, User } from '../types.ts';
import {
  Download,
  GitBranch,
  Loader2,
  MessageCircle,
  Plus,
  Save,
  Upload,
} from 'lucide-react';

export const Toolbar: React.FC<{
  onPluginLoad: (pluginId: string) => void;
  loadedPlugins: PluginConfig[];
  availablePlugins: PluginConfig[];
  onSave: () => void;
  onExport: (format: 'docx' | 'pdf' | 'html') => void;
  onImport: () => void;
  isCollaborating: boolean;
  isSaving: boolean;
  collaborators: User[];
  comments: Comment[];
  revisions: Revision[];
  onAddComment: (nodeKey: string, content: string) => void;
  onResolveComment: (commentId: string) => void;
  onAcceptRevision: (revisionId: string) => void;
  onRejectRevision: (revisionId: string) => void;
  toggleSidebar: (panel: 'comments' | 'revisions') => void;
}> = ({
  onPluginLoad,
  loadedPlugins,
  availablePlugins,
  onSave,
  onExport,
  onImport,
  isCollaborating,
  isSaving,
  collaborators,
  comments,
  revisions,
  onAddComment,
  onResolveComment,
  onAcceptRevision,
  onRejectRevision,
  toggleSidebar,
}) => {
  const [showPluginMenu, setShowPluginMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const loadedPluginIds = new Set(loadedPlugins.map((p) => p.id));

  return (
    <div className='border-b border-border bg-card p-2 flex items-center justify-between gap-1 flex-wrap'>
      <div className='flex items-center flex-grow'>
        <div className='flex items-center gap-1 mr-4'>
          <button
            type='button'
            onClick={onSave}
            className='p-2 hover:bg-accent rounded text-foreground hover:text-accent-foreground'
            title='Sauvegarder (Ctrl+S)'
          >
            {isSaving
              ? <Loader2 size={16} className='animate-spin' />
              : <Save size={16} />}
          </button>
          <div className='relative'>
            <button
              type='button'
              onClick={() => setShowExportMenu(!showExportMenu)}
              className='p-2 hover:bg-accent rounded text-foreground hover:text-accent-foreground'
              title='Exporter'
            >
              <Download size={16} />
            </button>
            {showExportMenu && (
              <div className='absolute top-full left-0 mt-1 bg-popover border border-border rounded shadow-lg z-50 min-w-32'>
                <button
                  type='button'
                  onClick={() => {
                    onExport('docx');
                    setShowExportMenu(false);
                  }}
                  className='w-full text-left p-2 hover:bg-accent rounded text-popover-foreground hover:text-accent-foreground'
                >
                  Word (.docx)
                </button>
                <button
                  type='button'
                  onClick={() => {
                    onExport('pdf');
                    setShowExportMenu(false);
                  }}
                  className='w-full text-left p-2 hover:bg-accent rounded text-popover-foreground hover:text-accent-foreground'
                >
                  PDF
                </button>
                <button
                  type='button'
                  onClick={() => {
                    onExport('html');
                    setShowExportMenu(false);
                  }}
                  className='w-full text-left p-2 hover:bg-accent rounded text-popover-foreground hover:text-accent-foreground'
                >
                  HTML
                </button>
              </div>
            )}
          </div>
          <button
            type='button'
            onClick={onImport}
            className='p-2 hover:bg-accent rounded text-foreground hover:text-accent-foreground'
            title='Importer'
          >
            <Upload size={16} />
          </button>
        </div>

        {/* Plugins chargés */}
        {loadedPlugins.map((plugin) => {
          // deno-lint-ignore no-explicit-any
          const props: any = {};
          if (plugin.id === 'comments') {
            props.comments = comments;
            props.onAddComment = onAddComment;
            props.onResolveComment = onResolveComment;
          } else if (plugin.id === 'revisions') {
            props.revisions = revisions;
            props.onAcceptRevision = onAcceptRevision;
            props.onRejectRevision = onRejectRevision;
          }
          return React.createElement(plugin.component, {
            key: plugin.id,
            ...props,
          });
        })}

        {/* Bouton pour ajouter des plugins */}
        <div className='relative'>
          <button
            type='button'
            onClick={() => setShowPluginMenu(!showPluginMenu)}
            className='p-2 ml-2 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80'
            title='Ajouter des fonctionnalités'
          >
            <Plus size={16} />
          </button>
          {showPluginMenu && (
            <div className='absolute top-full left-0 mt-1 bg-popover border border-border rounded shadow-lg z-50 min-w-64 p-2'>
              <h3 className='text-sm font-semibold p-2 text-popover-foreground'>
                Fonctionnalités disponibles
              </h3>
              {availablePlugins.map((plugin) => (
                !loadedPluginIds.has(plugin.id) && (
                  <button
                    type='button'
                    key={plugin.id}
                    onClick={() => {
                      onPluginLoad(plugin.id);
                      setShowPluginMenu(false);
                    }}
                    className='w-full text-left p-2 flex items-center gap-3 hover:bg-accent rounded'
                  >
                    <plugin.icon size={18} className='text-accent-foreground' />
                    <div>
                      <p className='font-medium text-popover-foreground'>
                        {plugin.name}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {plugin.description}
                      </p>
                    </div>
                  </button>
                )
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Indicateurs de collaboration */}
      <div className='flex items-center gap-4'>
        <div className='flex items-center -space-x-2'>
          {collaborators.map((user) => (
            <div
              key={user.id}
              title={user.name}
              className='w-8 h-8 rounded-full flex items-center justify-center font-bold text-white border-2 border-card'
              style={{ backgroundColor: user.color }}
            >
              {user.name.charAt(0)}
            </div>
          ))}
        </div>
        <button
          type='button'
          onClick={() => toggleSidebar('comments')}
          className='relative p-2 hover:bg-accent rounded text-foreground hover:text-accent-foreground'
          title='Commentaires'
        >
          <MessageCircle size={18} />
          {comments.filter((c) => !c.resolved).length > 0 && (
            <span className='absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full'>
              {comments.filter((c) => !c.resolved).length}
            </span>
          )}
        </button>
        <button
          type='button'
          onClick={() => toggleSidebar('revisions')}
          className='relative p-2 hover:bg-accent rounded text-foreground hover:text-accent-foreground'
          title='Suivi des modifications'
        >
          <GitBranch size={18} />
          {revisions.filter((r) => r.accepted === undefined).length > 0 && (
            <span className='absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full'>
              {revisions.filter((r) => r.accepted === undefined).length}
            </span>
          )}
        </button>
        <span
          className={`w-3 h-3 rounded-full ${
            isCollaborating ? 'bg-green-500' : 'bg-red-500'
          }`}
          title={isCollaborating ? 'Connecté' : 'Déconnecté'}
        >
        </span>
      </div>
    </div>
  );
};
