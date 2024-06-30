//@ts-ignore
import React, { useEffect,useState } from 'react';
import { useTheme } from './ThemeContext';


interface FolderSelectionInputProps {
    errors: string;
}

const Error: React.FC<FolderSelectionInputProps> = ({ errors })=> {
    const { isDarkMode } = useTheme();

    useEffect(() => {
        
    }, [errors]);


    return (
            <div className={`terminal ${isDarkMode ? "black" : ""}`}>
                <div className={`terminal-output ${isDarkMode ? "black" : ""}`}>
                    <pre>{errors}</pre>
                </div>
            </div>
        );
    };

export default Error;