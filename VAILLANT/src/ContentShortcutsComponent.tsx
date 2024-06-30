// src/components/KeyboardShortcuts.jsx

import React, { useEffect } from 'react';
import { monaco } from 'react-monaco-editor';

export const handleShortcutCopy = (editor: monaco.editor.IStandaloneCodeEditor|null) => {
  if (editor) {
      const selection = editor.getSelection();
      if (selection) {
          const model = editor.getModel();
          if (model) {
              const selectedText = model.getValueInRange(selection);
              navigator.clipboard.writeText(selectedText).then(() => {
                  console.log('Text copied to clipboard');
              }).catch((err) => {
                  console.error('Failed to copy text: ', err);
              });
          }
      }
      else
        console.error("selection is null");
  }
  else
    console.error("editor is null");
    
};

export const handleShortcutPaste = (editor: monaco.editor.IStandaloneCodeEditor|null) => {
  if (editor) {
      navigator.clipboard.readText().then((text) => {
          const selection = editor.getSelection();
          if (selection) {
              const range = new monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn);
              editor.executeEdits('', [{
                  range: range,
                  text: text,
                  forceMoveMarkers: true,
              }]);
              editor.setSelection(new monaco.Selection(range.endLineNumber, range.endColumn, range.endLineNumber, range.endColumn));
          }
      }).catch((err) => {
          console.error('Failed to read clipboard content: ', err);
      });
  }
};

export const handleShortcutCut = (editor: monaco.editor.IStandaloneCodeEditor|null) => {
  if (editor) {
      const selection = editor.getSelection();
      if (selection) {
          const model = editor.getModel();
          if (model) {
              const selectedText = model.getValueInRange(selection);
              navigator.clipboard.writeText(selectedText).then(() => {
                  const range = new monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn);
                  editor.executeEdits('', [{
                      range: range,
                      text: '',
                      forceMoveMarkers: true,
                  }]);
                  editor.setSelection(new monaco.Selection(range.startLineNumber, range.startColumn, range.startLineNumber, range.startColumn));
              }).catch((err) => {
                  console.error('Failed to cut text: ', err);
              });
          }
      }
  }
};

export const handleShortcutSelectAll = (editor: monaco.editor.IStandaloneCodeEditor|null) => {
  if (editor) {
      const model = editor.getModel();
      if (model) {
          const lineCount = model.getLineCount();
          const lastLineNumber = lineCount > 0 ? lineCount : 1;
          const lastColumn = model.getLineContent(lastLineNumber).length + 1;
          editor.setSelection(new monaco.Selection(1, 1, lastLineNumber, lastColumn));
      }
  }
};
interface ContentShortcutsComponentProps {
    onShortcutCopy: () => void;
    onShortcutCut: () => void;
    onShortcutPaste: () => void;
    onShortcutSelectAll: () => void;
}

const ContentShortcutsComponent : React.FC<ContentShortcutsComponentProps> = ({onShortcutCopy, onShortcutCut, onShortcutPaste, onShortcutSelectAll}) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey) {
      switch (event.key) {
        case 'a':
          event.preventDefault();
          onShortcutSelectAll();
          break;
        case 'c':
          event.preventDefault();
          onShortcutCopy();
          break;
        case 'v':
          event.preventDefault();
          onShortcutPaste();
          break;
        case 'x':
          event.preventDefault();
          onShortcutCut();
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div style={{display: 'none'}}>
      <h1>Keyboard Shortcuts Example</h1>
      <p>Try pressing the keyboard shortcuts: Ctrl+S, Ctrl+Shift+S, Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X</p>
    </div>
  );
};

export default ContentShortcutsComponent;
