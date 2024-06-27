import React, { useContext, useEffect, useState } from 'react';
import '../css/run.css';
import Modal from './Modal';

import { useTheme } from './ThemeContext';
import { useHearts } from './HeartContext'

import EditorComponent from './CodeEditor'; // Make sure the EditorComponent is correctly imported
import OpenedFileComponent from './OpenedFileComponent'; // Correct import of OpenedFileComponent

interface FileBarComponentProps {
    files: string[];
    onFileRemove: (filePath: string) => void;
    onFileSelect: (filePath: string) => void;
    activeFile: string | null;
}

const FileBarComponent: React.FC<FileBarComponentProps> = ({ files, onFileRemove, onFileSelect, activeFile }) => {
    const { isDarkMode } = useTheme();
    const [runError, setRunError] = useState<string | null>(null);
    const [runOutput, setRunOutput] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [errorCount, setErrorCount] = useState<number>(0);
    const { fullHearts, emptyHearts, setFullHearts, setEmptyHearts } = useHearts();
    const [fileContents, setFileContents] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (files.length > 0 && !activeFile) {
            onFileSelect(files[0]);
        }
    }, [files]);

    const handleRun = async () => {
        
        if (!activeFile || !fileContents[activeFile]) {
            return;
        }

        try {
            console.log("running code");
            const response = await fetch('http://localhost:8080/api/compile', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: fileContents[activeFile] })
            });
            console.log("running code: trying response");
            if (!response.ok) {
                console.log("running code: response not ok");
                throw new Error('Failed to compile and run code');
            }
            console.log("running code: response ok");
            const data = await response.json();
            if (data.nb_errors > 0) {
                setErrorCount(data.nb_errors + errorCount);
                setRunError(data.output);
                setShowModal(true);
            } else {
                setRunOutput(data.output);
                setRunError(null);
                setErrorCount(0);
                setShowModal(false);
            }
        } catch (error) {
            setRunError('Error running code');
            console.error('Error running code:', error);
            setRunOutput(null);
            setErrorCount(0);
            setShowModal(false);
        }
    };

    const handleCloseModal = () => {
        if (errorCount > 1) {
            setErrorCount(errorCount - 1);
        } else {
            setShowModal(false);
        }
    };

    const handleFileContentChange = (filePath: string, newContent: string) => {
        setFileContents((prevContents) => ({
            ...prevContents,
            [filePath]: newContent
        }));
    };

    useEffect(() => {
    }, [emptyHearts, fullHearts]);

    return (
        <div style={{ height: '80%' }}>
            <div className={`open-files-bar ${isDarkMode ? "black" : ""}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <>
                    <ul id="open-files-list">
                        {files.map((file, index) => (
                            <li key={index} className={activeFile === file ? 'active' : ''}>
                                <OpenedFileComponent filename={file} onClick={() => onFileSelect(file)} />
                                <button className='delete' onClick={() => onFileRemove(file)}></button>
                            </li>
                        ))}
                    </ul>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button className="button-run" onClick={handleRun}>
                            <img src="/ImagesPing/BoutonRun.png" alt="Run" />
                        </button>
                        <div id="life-bar" style={{ display: 'flex', alignItems: 'center' }}>
                            {[...Array(emptyHearts)].map((_, index) => (
                                <img key={index} src="/ImagesPing/empty-heart.png" alt="Empty Heart" style={{ width: '20px', height: '20px', margin: '0 2px' }} />
                            ))}
                            {[...Array(fullHearts)].map((_, index) => (
                                <img key={index} src="/ImagesPing/full-heart.png" alt="Full Heart" style={{ width: '20px', height: '20px', margin: '0 2px' }} />
                            ))}
                        </div>
                    </div>
                </>
                <Modal show={showModal} errors={runError} onClose={handleCloseModal} errorcount={errorCount} />
            </div>
            {files.map((file) => (
                <div className={`${isDarkMode ? "editor dark" : "editor"}`} key={file} style={{ display: activeFile === file ? 'flex' : 'none' }}>
                    <EditorComponent
                        filePath={file}
                        content={fileContents[file] || ""}
                        onContentChange={(newContent: string) => handleFileContentChange(file, newContent)}
                    />
                </div>
            ))}
        </div>
    );
};

export default FileBarComponent;