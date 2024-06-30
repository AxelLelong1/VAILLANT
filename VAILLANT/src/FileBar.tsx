import React, { useEffect, useRef, useState } from 'react';
import '../css/run.css';
import Modal from './Modal';

import { useTheme } from './ThemeContext';

import EditorComponent from './CodeEditor'; // Make sure the EditorComponent is correctly imported
import OpenedFileComponent from './OpenedFileComponent'; // Correct import of OpenedFileComponent
import { monaco } from 'react-monaco-editor';

interface FileBarComponentProps {
    files: string[];
    onFileRemove: (filePath: string) => void;
    onFileSelect: (filePath: string) => void;
    activeFile: string | null;
    folderPath: string;
    filesContents: { [key: string]: string }
    heartsByFile: { [key: string]: number }
    setHeartsByFile : React.Dispatch<React.SetStateAction<{[key: string]: number;}>>
    output: string;
    setOutput: React.Dispatch<React.SetStateAction<string>>
    errors: string;
    setErrors: React.Dispatch<React.SetStateAction<string>>
    editorRefProps: monaco.editor.IStandaloneCodeEditor|null;
}

const FileBarComponent: React.FC<FileBarComponentProps> = ({ files, onFileRemove, onFileSelect, activeFile, folderPath, filesContents, editorRefProps, setOutput, setErrors, errors, heartsByFile, setHeartsByFile }) => {

    const { isDarkMode } = useTheme();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [errorCount, setErrorCount] = useState<number>(0);

    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null);

    useEffect(() => {
        editorRefProps = editorRef.current;
      }, [editorRef.current]);

    useEffect(() => {
        // Initialize hearts for each file if not already set
        if (Object.keys(heartsByFile).length === 0) {
            const initialHearts: { [key: string]: number } = {};
            files.forEach((file) => {
                initialHearts[file] = 5;
            });
            setHeartsByFile(initialHearts);
        }
        if (files.length > 0 && !activeFile) {
            onFileSelect(files[0]);
        }
    }, [files]);

    const handleRun = async () => {
        console.log("RUN");
        if (!activeFile || !filesContents[activeFile]) {
            return;
        }
        console.log("RUN");
        try {
            console.log("running code");
            const response = await fetch('http://localhost:8080/api/compile', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ path: activeFile })
            });
            console.log("running code: trying response");
            if (!response.ok) {
                console.log("running code: response not ok");
                throw new Error('Failed to compile and run code');
            }
            console.log("running code: response ok");
            const data = await response.json();
            console.log(data);
            if (data.nb_errors > 0) {
                setErrorCount(data.nb_errors + errorCount);
                setErrors(data.output);
                setOutput("");
                setShowModal(true);
            } else {
                setOutput(data.output);
                setErrors("");
                setErrorCount(0);
                setShowModal(false);
            }
        } catch (error) {
            setErrors('Error running code');
            console.error('Error running code:', error);
            setOutput("");
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
            filesContents[filePath] = newContent
    };

    const handleDeleteLine = (filePath: string) => {
        setHeartsByFile((prevHearts) => ({
            ...prevHearts,
            [filePath]: Math.max(prevHearts[filePath] - 1, 0) // Ensure hearts don't go below 0
        }));
        // Close and Delete file
    }
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
                        {files.map((file) => (
                        <div id="life-bar" style={{ display: activeFile === file ? 'flex' : 'none', alignItems: 'center' }}>
                            {[...Array(5 - heartsByFile[file] || 0)].map((_, index) => (
                                <img key={index} src="/ImagesPing/empty-heart.png" alt="Empty Heart" style={{ width: '20px', height: '20px', margin: '0 2px' }} />
                            ))}
                            {[...Array(heartsByFile[file] || 0)].map((_, index) => (
                                <img key={index} src="/ImagesPing/full-heart.png" alt="Full Heart" style={{ width: '20px', height: '20px', margin: '0 2px' }} />
                            ))}
                        </div>
                        ))}
                    </div>
                </>
                <Modal show={showModal} errors={errors} onClose={handleCloseModal} errorcount={errorCount} />
            </div>
            {files.map((file) => (
                <div className={`${isDarkMode ? "editor dark" : "editor"}`} key={file} style={{ display: activeFile === file ? 'flex' : 'none' }}>
                    <EditorComponent
                        filePath={file}
                        folderPath={folderPath}
                        content={filesContents[file] || ""}
                        onContentChange={(newContent: string) => handleFileContentChange(file, newContent)}
                        onDeleteLine={() => handleDeleteLine(file)}
                        editorRef={editorRef.current}
                    />
                </div>
            ))}
        </div>
    );
};

export default FileBarComponent;
