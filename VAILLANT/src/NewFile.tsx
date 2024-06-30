import React from 'react';
import { useTranslation } from 'react-i18next';

interface FileOpeningInputProps {
    onFileCreation: (folderPath: string) => void;
}

const FileCreationInput: React.FC<FileOpeningInputProps> = ({ onFileCreation }) => {
    const { t } = useTranslation();

    const handleButtonClick = async () => {
        const Path = prompt('Enter ABSOLUTE path of the new file');
        if (!Path) return;
        try {
            const response = await fetch('http://localhost:8080/api/create/file', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ path: Path })
            });

            if (!response.ok) {
                console.error('Cannot cfreate file');
            }
        } catch (error) {
            console.error("Cannot cfreate file", error);
        }
        onFileCreation(Path);
    };

    return (
        <div onClick={handleButtonClick}>
            {t('NewFile')}
        </div>
    );
};

export default FileCreationInput;