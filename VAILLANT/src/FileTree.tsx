import React, { useState, useEffect, useCallback, useRef } from 'react';
import FolderTree from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';

interface FileTreeNode {
    name: string;
    children?: FileTreeNode[];
}

interface FileTreeProps {
    folderPath: string;
    onFileClick: (filePath: string) => void;
}

const FileTree: React.FC<FileTreeProps> = ({ folderPath, onFileClick }) => {
    const [fileTree, setFileTree] = useState<FileTreeNode | null>(null);
    const fileTreeRef = useRef<FileTreeNode | null>(null);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        if (folderPath.length !== 0 && !isFetching) {
            fetchFileTree();
        } else {
            setFileTree(null);
        }
    }, [folderPath]);

    const getPathFromIndices = (indices, tree) => {
        let current = tree;
        let path = current.name;
        for (const index of indices) {
            if (!current.children || current.children.length <= index) {
                return null;
            }
            current = current.children[index];
            path += `/${current.name}`;
        }
        return path;
    };

    const handleFileClick = ({ defaultOnClick, nodeData }) => {
        const path = getPathFromIndices(nodeData.path, fileTreeRef.current);
        if (path) {
            if (nodeData.isOpen === undefined) {
                onFileClick(path);
            }
        } else {
            console.error('Invalid path', nodeData.path);
        }

        defaultOnClick();
    };

    const fetchFileTree = useCallback(async () => {
        try {
            setIsFetching(true);
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
            fileTreeRef.current = data; // Store the tree in the ref
        } catch (error) {
            console.error('Error fetching file tree:', error);
        } finally {
            setIsFetching(false);
        }
    }, [folderPath]);

    const changeName = async (before, name) => {
        try {
            const path = getPathFromIndices(before, fileTree);
            const pos = path.lastIndexOf('/');
            const newpath = path.substring(0, pos + 1) + name;

            const response = await fetch('http://localhost:8080/api/move', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ src: "../Projets/" + path, dst: "../Projets/" + newpath })
            });

            if (response.ok) {
                updateFileTreeNodeName(before, name); // Update the tree locally
            } else {
                console.error('Failed to move the file');
            }
        } catch (error) {
            console.error("Couldn't move the selected file", error);
        }
    };

    const updateFileTreeNodeName = (pathIndices, newName) => {
        if (!fileTreeRef.current) return;

        const newTree = { ...fileTreeRef.current };
        let current = newTree;

        for (let i = 0; i < pathIndices.length - 1; i++) {
            current = current.children[pathIndices[i]];
        }

        const childIndex = pathIndices[pathIndices.length - 1];
        current.children[childIndex] = {
            ...current.children[childIndex],
            name: newName,
        };

        fileTreeRef.current = newTree;
    };

    const onTreeStateChange = (state, event) => {
        switch (event.type) {
            case "renameNode":
                changeName(event.path, event.params[0]);
                break;
            case "deleteNode":
                // Handle delete node logic
                break;
            case "addNode":
                // Handle add node logic
                break;
            default:
                break;
        }
    };

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
