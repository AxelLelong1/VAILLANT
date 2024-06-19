import { editor } from 'monaco-editor';
import React, { useState } from 'react';
import MonacoEditor, { EditorDidMount }from 'react-monaco-editor';

const EditorComponent: React.FC = () => {
    const [code, setCode] = useState<string>('Enter a ruby code !'); // State to hold the code
    const [cursorLine, setCursorLine] = useState<number>(0); // State to hold the cursor position
    const [timerId, setTimerId] = useState<number | null>(null); // State to hold the timer ID
    const [remainingTime, setRemainingTime] = useState<number>(0); // State to hold the remaining time

    // Handler for editor content change
    const handleEditorChange = (newValue: string) => {
        setCode(newValue);
    };

    const deleteLine = (editor: editor.IStandaloneCodeEditor , lineNumber: number ) => {
        // TODO : delete line here
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
            if (timerId) {
                clearTimeout(timerId);
            }

            // Set the remaining time
            setRemainingTime(15);
            // Set a new timer to update the remaining time and delete the line
            const newTimerId = window.setInterval(() => {
                setRemainingTime((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(newTimerId);
                        deleteLine(editor, position.lineNumber);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
            setTimerId(newTimerId);
        }
    });
  };



  // Options for Monaco Editor
  const editorOptions = {
      selectOnLineNumbers: true,
      automaticLayout: true,
      language: 'ruby' // Specify language for syntax highlighting
  };

  return (
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
  );
};

export default EditorComponent;