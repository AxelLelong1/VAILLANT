import React, { useState, useEffect } from 'react';

interface FileTreeNode {
    name: string;
    children: FileTreeNode[];
}

interface FileTreeProps {
    folderPath: string;
}

const FileTree: React.FC<FileTreeProps> = ({ folderPath }) => {
    const [fileTree, setFileTree] = useState<FileTreeNode[]>([]);

    useEffect(() => {
        console.log(folderPath)
        if (folderPath.length != 0) {
            fetchFileTree();
        } else {
            // Clear file tree when no folderPath is provided
            setFileTree([]);
        }
    }, [folderPath]);

    const fetchFileTree = async () => {
        try {
            // Replace with your fetch logic to get file tree based on folderPath
            const response = await fetch('http://localhost:8080/api/open/project', {
                method:'POST',
                headers: {
                    "Content-Type":"application/json",
                },
                body: JSON.stringify({path: folderPath})
            });
            if (!response.ok) {
                throw new Error('Failed to fetch file tree');
            }
            const data = await response.json();
            setFileTree(data.children);
        } catch (error) {
            console.error('Error fetching file tree:', error);
        }
    };

    return (
        <div className="file-tree">
            <ul>
                {fileTree.map((node, index) => (
                    <li key={index}>{node.name}</li>
                    // Add recursive rendering for nested nodes if necessary
                ))}
            </ul>
        </div>
    );
};

export default FileTree;