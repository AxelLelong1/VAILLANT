import { useEffect } from 'react';

//@ts-ignore
const useKeyboardShortcut = (keyCombination, callback) => {
    console.log("We shorcut");
    
  useEffect(() => {
    //@ts-ignore
    const handleKeyDown = (event) => {
      const keys = keyCombination.split('+');
      const key = keys.pop();
      //@ts-ignore
      const isModifierPressed = keys.every((modifier) => {
        switch (modifier) {
          case 'Control':
            return event.ctrlKey;
          case 'Shift':
            return event.shiftKey;
          case 'Alt':
            return event.altKey;
          case 'Meta':
            return event.metaKey;
          default:
            return false;
        }
      });

      if (isModifierPressed && event.key === key) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [keyCombination, callback]);
};

export default useKeyboardShortcut;
