import React, { useState, useEffect } from 'react';
import FolderTree from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';

interface FileTreeNode {
    name: string;
    children: FileTreeNode[];
}

interface FileTreeProps {
    folderPath: string;
}

const FileTree: React.FC<FileTreeProps> = ({ folderPath }) => {
    const [fileTree, setFileTree] = useState<FileTreeNode | null>(null);

    useEffect(() => {
        if (folderPath.length !== 0) {
            fetchFileTree();
        } else {
            // Clear file tree when no folderPath is provided
            setFileTree(null);
        }
    }, [folderPath]);

    const fetchFileTree = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/open/project', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ path: folderPath })
            });
            if (!response.ok) {
                throw new Error('Failed to fetch file tree');
            }
            const data = await response.json();
            setFileTree(data);
        } catch (error) {
            console.error('Error fetching file tree:', error);
        }
    };

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