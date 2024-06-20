import React, { useState , useEffect, useRef} from 'react';
import MonacoEditor, { EditorDidMount, monaco }from 'react-monaco-editor';

const EditorComponent: React.FC = () => {
    const [code, setCode] = useState<string>('Enter a ruby code !'); // State to hold the code
    const [cursorLine, setCursorLine] = useState<number>(0); // State to hold the cursor position
    const [remainingTime, setRemainingTime] = useState<number>(0); // State to hold the remaining time
    const intervalRef = useRef<number | null>(null); // Ref to keep track of the interval


    // Handler for editor content change
    const handleEditorChange = (newValue: string) => {
        setCode(newValue);
    };

    const deleteLine = (editor: monaco.editor.IStandaloneCodeEditor , lineNumber: number ) => {
        const model = editor.getModel();
        if (model) {
            const range = new monaco.Range(lineNumber, 1, lineNumber, model.getLineMaxColumn(lineNumber));
            const from = range.getStartPosition;
            const to = range.getEndPosition;
            // TODO : use real path
            const path = "test.txt"
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
        }

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

    editor.onDidChangeCursorPosition((e) =>  {
        const position = editor.getPosition();
        if (position != null && cursorLine != position.lineNumber)
        {
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
                    return prevTime - 1;
                });
            }, 1000);        }
    });
  };



  // Options for Monaco Editor
  const editorOptions = {
      selectOnLineNumbers: true,
      automaticLayout: true,
      language: 'ruby' // Specify language for syntax highlighting
  };

  useEffect(() => {
    return () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };
}, []);

  return (
    <div id="code">
      <MonacoEditor
          width="99.9%"
          height="70%"
          language="ruby"
          theme="vs"
          value={code}
          options={editorOptions}
          onChange={handleEditorChange}
          editorDidMount={editorDidMount}
      />
      Timer : {remainingTime}
      </div>
  );
};

export default EditorComponent;