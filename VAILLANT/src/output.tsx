import React, { useEffect } from 'react';

import { useTheme } from './ThemeContext';


interface FolderSelectionInputProps {
    output: string;
}

const Output: React.FC<FolderSelectionInputProps> = ({ output })=> {
    const { isDarkMode } = useTheme();

    useEffect(() => {
        
    }, [output]);


    return (
            <div className={`terminal ${isDarkMode ? "black" : ""}`}>
                <div className={`terminal-output ${isDarkMode ? "black" : ""}`}>
                    <pre>{output}</pre>
                </div>
            </div>
        );
    };

export default Output;