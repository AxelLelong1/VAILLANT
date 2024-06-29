import React, { useState, useEffect, useCallback } from 'react';
import FolderTree from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';

// Define types for tree nodes and props
interface FileTreeNode {
    name: string;
    children?: FileTreeNode[];
}

interface FileTreeProps {
    folderPath: string;
    onFileClick: (filePath: string) => void;
    onFetchComplete: () => void;
    onGitPullComplete: boolean;
}

const FileTree: React.FC<FileTreeProps> = ({ folderPath, onFileClick, onFetchComplete, onGitPullComplete }) => {
    // State for managing the tree structure displayed in UI
    const [fileTree, setFileTree] = useState<FileTreeNode | null>(null);

    // State to track fetching status
    const [isFetching, setIsFetching] = useState(false);
    const [init, setInit] = useState(false);

    // Effect to fetch the initial tree structure or update when folderPath changes
    useEffect(() => {
        if (folderPath.length !== 0 && !isFetching) {
            fetchFileTree();
        } else {
            setFileTree(null);
        }
    }, [folderPath, onGitPullComplete]);

    // Function to fetch the file tree from the server
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
            setFileTree(data); // Update the state with fetched data
        } catch (error) {
            console.error('Error fetching file tree:', error);
        } finally {
            setIsFetching(false);
            onFetchComplete();
        }
    }, [folderPath]);

    // Function to handle file/folder click
    // @ts-ignore 
    const handleFileClick = ({ defaultOnClick, nodeData }) => {
        const path = getPathFromIndices(nodeData.path, fileTree);
        if (path) {
            if (nodeData.isOpen === undefined) {
                onFileClick(folderPath + path);
            }
        } else {
            console.error('Invalid path', nodeData.path);
        }
        defaultOnClick();
    };

    // @ts-ignore 
    const changeName = async (before, name) => {
        if (init)
            setInit(false);
        else
        {
            try {
                const path = getPathFromIndices(before, fileTree);
                const pos = path.lastIndexOf('/');
                const newpath = path.substring(0, pos + 1) + name;

                const response = await fetch('http://localhost:8080/api/move', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ src: folderPath + path, dst: folderPath + newpath })
                });

                if (response.ok) {
                    fetchFileTree();
                } else {
                    console.error('Failed to move the file');
                }
            } catch (error) {
                console.error("Couldn't move the selected file", error);
            }
            setInit(true);
        }
    };

    // Function to add a file or folder
    // @ts-ignore 
    const addFile = async (path, isFolder) => {
        if (init)
            setInit(false);
        else {
            const folderP = getPathFromIndices(path, fileTree);
            console.log(folderP);
            const newPath = `${folderP}/new ${isFolder ? 'folder' : 'file'}`;

            const url = isFolder
                ? 'http://localhost:8080/api/create/folder'
                : 'http://localhost:8080/api/create/file';

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ path: folderPath + newPath })
                });

                if (response.ok) {
                    fetchFileTree(); // Refetch the tree to reflect the new addition
                } else {
                    console.error('Failed to create the file or folder');
                    fetchFileTree();
                }
            } catch (error) {
                console.error("Couldn't create the file or folder", error);
            }
            setInit(true);
    }};

    // @ts-ignore 
    const deleteNode = async (node) => {
        if (init)
            setInit(false);
        else
        {
            try {
                const path = getPathFromIndices(node, fileTree);

                const response = await fetch('http://localhost:8080/api/delete/folder', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ path: folderPath + path})
                });

                if (response.ok) {
                    fetchFileTree();
                } else {
                    console.error('Failed to move the file');
                }
            } catch (error) {
                console.error("Couldn't move the selected file", error);
            }
            setInit(true);
        }
    };

    // Function to handle tree state changes (rename, delete, add)
    // @ts-ignore 
    const onTreeStateChange = (state, event) => {

        console.log(event);
        switch (event.type) {
            case "initialization":
                break;
            case "renameNode":
                changeName(event.path, event.params[0]);
                break;
            case "deleteNode":
                deleteNode(event.path);
                break;
            case "addNode":
                addFile(event.path, event.params[0]);
                break;
            default:
                break;
        }
    };

    // Function to get path from indices
    // @ts-ignore 
    const getPathFromIndices = (indices, tree) => {
        let current = tree;
        let path = "";//current.name;
        for (const index of indices) {
            if (!current.children || current.children.length <= index) {
                return null;
            }
            current = current.children[index];
            path += `/${current.name}`;
        }
        return path;
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

