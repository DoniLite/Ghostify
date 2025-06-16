import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from '../modules/editor/mod.tsx';

const DocumentEditor = () => {
  const { userId, documentId } = useParams();
  const navigate = useNavigate();

  if (typeof userId !== 'string' || typeof documentId !== 'string') {
    navigate('/api/v1/document/new');
  }

  return <Editor userId={userId!} documentId={documentId!} />;
};

export default DocumentEditor;
