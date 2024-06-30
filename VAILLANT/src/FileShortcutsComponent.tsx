// src/components/KeyboardShortcuts.jsx

import React, { useEffect } from 'react';

interface FileShortcutsComponentProps {
    onShortcutSave: () => void;
    onShortcutSaveAs: () => void;
}

const FileShortcutsComponent : React.FC<FileShortcutsComponentProps> = ({onShortcutSave, onShortcutSaveAs}) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey) {
      switch (event.key) {
        case 'S':
            event.preventDefault();
            onShortcutSaveAs();
            break;
        case 's':
            event.preventDefault();
            onShortcutSave();
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
      <p>Try pressing the keyboard shortcuts: Ctrl+S, Ctrl+Shift+S</p>
    </div>
  );
};

export default FileShortcutsComponent;
