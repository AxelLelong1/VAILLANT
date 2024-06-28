import React, { useState, useEffect, useRef } from 'react';
import MonacoEditor, { EditorDidMount, monaco } from 'react-monaco-editor';
import { useTheme } from './ThemeContext';
import { useHearts } from './HeartContext';

import "../css/bomb.css"

interface EditorComponentProps {
    filePath: string;
    content: string;
    onContentChange: (newContent: string) => void;
}

const EditorComponent: React.FC<EditorComponentProps> = ({ filePath, onContentChange}) => {
    const { isDarkMode } = useTheme();
    const [code, setCode] = useState<string>(''); // State to hold the code
    const [cursorLine, setCursorLine] = useState<number>(0); // State to hold the cursor position
    const [remainingTime, setRemainingTime] = useState<number>(0); // State to hold the remaining time
    const intervalRef = useRef<number | null>(null); // Ref to keep track of the interval
    const isFocusedRef = useRef<boolean>(true); // Ref to keep track of the editor focus state
    const { fullHearts, emptyHearts, setFullHearts, setEmptyHearts } = useHearts();

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
                    body: JSON.stringify({ path: "../Projets/" + filePath }),
                });

                const response = await fetch('http://localhost:8080/api/content', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ path: "../Projets/" + filePath }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch file content');
                }
                const data = await response.text();
                setCode(data); 
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
        setFullHearts((fullHearts) => fullHearts - 1); // Decrement lives
        setEmptyHearts((EmptyHearts) => EmptyHearts + 1); // Decrement lives
        /*const model = editor.getModel();
        if (model) {
            const range = new monaco.Range(lineNumber, 1, lineNumber, model.getLineMaxColumn(lineNumber));
            const from = range.getStartPosition;
            const to = range.getEndPosition;
            // TODO: use real path
            const path = "test.txt";
            // Prepare the request payload
            const payload = {
                path: path,
                from: from,
                to: to,
                content: '',
            };
EditorComponent
            fetch('/api/update/file', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log(data); // Handle success response
                })
                .catch((error) => {
                    console.error('Error deleting line:', error); // Handle error
                });
        }*/
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
            if (position != null && cursorLine !== position.lineNumber) {
                setCursorLine(position.lineNumber);
                // Clear the previous timer if it exists
                if (intervalRef.current !== null) {
                    clearInterval(intervalRef.current);
                }
                setRemainingTime(15);
                // @ts-ignore 
                intervalRef.current = setInterval(() => {
                    setRemainingTime((prevTime) => {
                        if (prevTime < 1) {
                            deleteLine(editor, cursorLine);
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
                <div className="explosion"></div>
            )}
                <audio ref={explosionSoundRef} src="/music/explosion.mp3" />
            </div>
        </div>
    );
};

export default EditorComponent;