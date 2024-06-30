// src/components/KeyboardShortcuts.jsx

import React, { useEffect } from 'react';

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
