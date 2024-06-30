import React, { useState, useEffect, useRef } from 'react';
import MonacoEditor, { EditorDidMount, monaco } from 'react-monaco-editor';
import { useTheme } from './ThemeContext';

import "../css/bomb.css"

interface EditorComponentProps {
    filePath: string;
    folderPath: string;
    content: string;
    onContentChange: (newContent: string) => void;
    onDeleteLine: () =>  void;
}


const EditorComponent: React.FC<EditorComponentProps> = ({ filePath, folderPath, onContentChange, onDeleteLine }) => {
    const { isDarkMode } = useTheme();
    const [code, setCode] = useState<string>(''); // State to hold the code
    const cursorLineRef = useRef<number>(0); // Ref to keep track of the cursor line
    const [remainingTime, setRemainingTime] = useState<number>(0); // State to hold the remaining time
    const intervalRef = useRef<number | null>(null); // Ref to keep track of the interval
    const isFocusedRef = useRef<boolean>(true); // Ref to keep track of the editor focus state
    const debounceRef = useRef<boolean>(false);


    const list_bomb =  ["/ImagesPing/BombTimer/Bomb0.png",
        "/ImagesPing/BombTimer/Bomb1.png",
        "/ImagesPing/BombTimer/Bomb2.png",
        "/ImagesPing/BombTimer/Bomb3.png",
        "/ImagesPing/BombTimer/Bomb4.png",
        "/ImagesPing/BombTimer/Bomb5.png",
        "/ImagesPing/BombTimer/Bomb6.png",
        "/ImagesPing/BombTimer/Bomb7.png",
        "/ImagesPing/BombTimer/Bomb8.png",
        "/ImagesPing/BombTimer/Bomb9.png",
        "/ImagesPing/BombTimer/Bomb10.png",
        "/ImagesPing/BombTimer/Bomb11.png",
        "/ImagesPing/BombTimer/Bomb12.png",
        "/ImagesPing/BombTimer/Bomb13.png",
        "/ImagesPing/BombTimer/Bomb14.png",
        "/ImagesPing/BombTimer/Bomb15.png"];

    // Fetch the file content when the component mounts
    useEffect(() => {
        const fetchFileContent = async () => {
            try {
                await fetch('http://localhost:8080/api/open/file', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ path: filePath }),
                });

                const response = await fetch('http://localhost:8080/api/content', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ path: filePath }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch file content');
                }
                const data = await response.text();
                setCode(data);
                onContentChange(data); 
            } catch (error) {
                console.error('Error fetching file content:', error);
            }
        };

        fetchFileContent();

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [filePath]);

    // Handler for editor content change
    const handleEditorChange = (newValue: string) => {
        setCode(newValue);
        onContentChange(newValue);
    };

    const deleteLine = (editor: monaco.editor.IStandaloneCodeEditor, lineNumber: number) => {
            
        if (debounceRef.current) return;
        debounceRef.current = true;
        setTimeout(() => {
            const model = editor.getModel();
            if (model) {
                const range = new monaco.Range(lineNumber, 1, lineNumber + 1, 0);
                const operation = { range, text: '', forceMoveMarkers: true };

                model.pushEditOperations([], [operation], () => null);
                onDeleteLine();
            }
            debounceRef.current = false;
        }, 100); // Adjust timeout as needed


    };

    const editorDidMount: EditorDidMount = (editor, monaco) => {
        // Register Ruby language
        monaco.languages.register({ id: 'ruby' });

        // Define syntax highlighting rules (Monarch)
        monaco.languages.setMonarchTokensProvider('ruby', {
            tokenizer: {
                root: [
                    // Keywords
                    [/\b(?:def|end|if|else|elsif|unless|while|until|for|in|do|begin|rescue|ensure|case|when|class|module|def|self|super|return|next|break|yield)\b/, 'keyword'],

                    // Identifiers and variables
                    [/[a-zA-Z_]\w*/, 'identifier'],

                    // Numbers
                    [/\b\d+\b/, 'number'],

                    // Strings
                    [/"/, 'string', '@string_double'],
                    [/'/, 'string', '@string_single'],

                    // Comments
                    [/#.*/, 'comment'],
                ],

                string_double: [
                    [/[^\\"]+/, 'string'],
                    [/"/, 'string', '@pop'],
                ],

                string_single: [
                    [/[^\\']+/, 'string'],
                    [/'/, 'string', '@pop'],
                ],
            },
        });

        // Set language configuration
        monaco.languages.setLanguageConfiguration('ruby', {
            comments: {
                lineComment: '#',
                blockComment: ['=begin', '=end'],
            },
            brackets: [['{', '}'], ['[', ']'], ['(', ')']],
            autoClosingPairs: [
                { open: '{', close: '}' },
                { open: '[', close: ']' },
                { open: '(', close: ')' },
                { open: "'", close: "'", notIn: ['string', 'comment'] },
                { open: '"', close: '"', notIn: ['string'] },
            ],
        });

        monaco.editor.defineTheme('my-theme', {
            base: 'vs',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#FFFFFF',
            },
        });

        editor.onDidChangeCursorPosition(() => {
            const position = editor.getPosition();
            if (position != null && cursorLineRef.current !== position.lineNumber) {
                cursorLineRef.current = position.lineNumber;
                console.log("CursorLine = " + cursorLineRef);
                // Clear the previous timer if it exists
                if (intervalRef.current !== null) {
                    clearInterval(intervalRef.current);
                }
                setRemainingTime(15);
                // @ts-ignore 
                intervalRef.current = setInterval(() => {
                    setRemainingTime((prevTime) => {
                        if (prevTime === 0) {
                            deleteLine(editor, cursorLineRef.current);    
                            return 15;
                        }
                        if (!isFocusedRef.current) // Cursor not active
                        {
                            return prevTime;
                        }
                        return prevTime - 1;
                    });
                }, 1000);
            }
        });

        editor.onDidBlurEditorText(() => {
            isFocusedRef.current = false;
        });

        editor.onDidFocusEditorText(() => {
            isFocusedRef.current = true;
        });
    };

    
    // Options for Monaco Editor
    const editorOptions = {
        selectOnLineNumbers: true,
        automaticLayout: true,
        language: 'ruby' // Specify language for syntax highlighting
    };
    const explosionSoundRef = useRef(null);
    useEffect(() => {
        if (remainingTime === 0 && explosionSoundRef.current) {
            explosionSoundRef.current.play();
        }
    }, [remainingTime]);

    return (
        <div className={`${isDarkMode ? "editor dark" : "editor"}`}>
            <MonacoEditor
                width="99.9%"
                height="70%"
                language="ruby"
                theme= {`${isDarkMode ? "vs-dark" : "vs"}`}
                value={code}
                options={editorOptions}
                onChange={handleEditorChange}
                editorDidMount={editorDidMount}
            />
            <div>
            {remainingTime !== 0 ? (
                <img className='bomb' src={`${list_bomb[remainingTime]}`}></img>
            ) : (
                <div className="explosion"><audio ref={explosionSoundRef} src="/music/explosion.mp3" /></div>
            )}
            </div>
        </div>
    );
};

export default EditorComponent;

