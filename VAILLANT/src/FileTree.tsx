import React, { useState, useEffect } from 'react';
import FolderTree from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';

interface FileTreeNode {
    name: string;
    children: FileTreeNode[];
}

interface FileTreeProps {
    folderPath: string;
    onFileClick: (filePath: string) => void;
}

const FileTree: React.FC<FileTreeProps> = ({ folderPath, onFileClick }) => {
    const [fileTree, setFileTree] = useState<FileTreeNode | null>(null);

    useEffect(() => {
        if (folderPath.length !== 0) {
            fetchFileTree();
        } else {
            // Clear file tree when no folderPath is provided
            setFileTree(null);
        }
    }, [folderPath]);

    const getPathFromIndices = (indices, tree) => {
        let current = tree;
        let path = current.name;
        for (const index of indices) {
            if (!current.children || current.children.length <= index) {
                return null; // Invalid path
            }
            current = current.children[index];
            path += `/${current.name}`;
        }
        return path;
    };
    

    const handleFileClick = ({ defaultOnClick, nodeData }) => {
        const path = getPathFromIndices(nodeData.path, fileTree);
        if (path) {
            if (nodeData.isOpen == undefined)
                onFileClick(path); // Notify parent component about the file click
        } else {
            console.error('Invalid path', nodeData.path);
        }

        defaultOnClick();
    };

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

    const changename = async(before, name) => {
        try {
            const path = getPathFromIndices(before, fileTree);
            const pos = path.lastIndexOf('/');
            const newpath = path.substring(0, pos+1) + name;

            const response = await fetch('http://localhost:8080/api/move', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ src: "../Projets/" + path, dst: "../Projets/" + newpath })
            });

            if (response.ok)
                fetchFileTree()
        }
        catch(error)
        {
            console.log("Coudln't move properly the selected file");
        }
    }

    const onTreeStateChange = (state, event) => 
    {   
        console.log(event)
        console.log(state)

        switch(event.type)
        {
            case "renameNode":
                changename(event.path, event.params[0])
                break;
            case "deleteNode":
                //if state.isOpen undefined
                break;
            case "addNode":
                //if params[0]
                break;
            default:
                break;
        }
    }

    return (
        <div className="file-tree">
            {fileTree && (
                <FolderTree
                    data={fileTree}
                    showCheckbox={false}
                    onNameClick={handleFileClick}
                    onChange={onTreeStateChange}
                />
            )}
        </div>
    );
};

export default FileTree;