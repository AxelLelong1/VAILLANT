import React, { useState, useEffect, useRef } from 'react';
import MonacoEditor, { EditorDidMount, monaco } from 'react-monaco-editor';
import { useTheme } from './ThemeContext';
 

interface EditorComponentProps {
    filePath: string;
}

const EditorComponent: React.FC<EditorComponentProps> = ({ filePath }) => {
    const {isDarkMode} = useTheme();
    const [code, setCode] = useState<string>(''); // State to hold the code
    const [cursorLine, setCursorLine] = useState<number>(0); // State to hold the cursor position
    const [remainingTime, setRemainingTime] = useState<number>(0); // State to hold the remaining time
    const intervalRef = useRef<number | null>(null); // Ref to keep track of the interval
    const isFocusedRef = useRef<boolean>(true); // Ref to keep track of the editor focus state
    const filePathh = "bonjour.txt";

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
    };

    const deleteLine = (editor: monaco.editor.IStandaloneCodeEditor, lineNumber: number) => {
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
            if (position != null && cursorLine != position.lineNumber) {
                setCursorLine(position.lineNumber);
                // Clear the previous timer if it exists
                if (intervalRef.current !== null) {
                    clearInterval(intervalRef.current);
                }
                setRemainingTime(15);
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

    return (
        <div id="code">
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
            Timer: {remainingTime}
        </div>
    );
};

export default EditorComponent;
