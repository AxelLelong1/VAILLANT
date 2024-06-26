import React, { useState } from 'react';
import { useTheme } from './ThemeContext';

const Terminal: React.FC = () => {
    const { isDarkMode } = useTheme();
    const [command, setCommand] = useState<string>('');
    const [output, setOutput] = useState<string[]>([]);
    const [currentPath, setCurrentPath] = useState<string>('/');

    const handleCommandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCommand(event.target.value);
    };

    const handleCommandSubmit = async () => {
        if (command.trim() === '') return;

        const newOutput = [...output, `${currentPath} $ ${command}`];

        let result;

        try {
            const response = await fetch('http://localhost:8080/api/execute-command', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ command }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}, could not find command`);
            }

            result = await response.json();

            if (response.ok && command[0] == 'c' && command[1] == 'd')
                setCurrentPath(result.output);

            setOutput([...newOutput, result.output]);
        } catch (error) {
            let message;
            if (error instanceof Error)
                message = error.message;
            else
                message = result.output;
            setOutput([...newOutput, message])
        }

        setCommand('');
    };

    return (
            <div className={`terminal ${isDarkMode ? "black" : ""}`}>
                <div className={`terminal-output ${isDarkMode ? "black" : ""}`}>
                    {output.map((line, index) => (
                        <pre key={index}>{line}</pre>
                    ))}
                </div>
                <div className={`terminal-input ${isDarkMode ? "black" : ""}`}>
                    <span className="terminal-path">{currentPath} $ </span>
                    <input
                        type="text"
                        value={command}
                        onChange={handleCommandChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleCommandSubmit();
                            }
                        }}
                        //placeholder="Enter command..."
                    />
                </div>
            </div>
        );
    };

export default Terminal;
