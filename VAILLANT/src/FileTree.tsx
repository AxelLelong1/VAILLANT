// FileTree.tsx
import React, { useEffect, useState } from 'react';
import FolderTree from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';

interface FileTreeProps {
  onFileSelect: (filePath: string) => void;
}

const FileTree: React.FC<FileTreeProps> = () => {
  const [fileTree, setFileTree] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFileTree = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/open/project', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ path: 'C:\\Users\\axell\\Downloads\\PORRJET TETS' }), // Replace 'pathtoproject' with actual path variable
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setFileTree(data);
      } catch (error) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchFileTree();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="file-tree">
      {fileTree && (
        <FolderTree
          data={fileTree}
          showCheckbox={false}
        />
      )}
    </div>
  );
};

export default FileTree;
