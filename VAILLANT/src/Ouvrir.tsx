import React from 'react';
import { useTranslation } from 'react-i18next';

interface FolderSelectionInputProps {
    onFolderSelect: (folderPath: string) => void;
    onFileSelect: (filePath: string) => void;
}

const OuvrirSelectionInput: React.FC<FolderSelectionInputProps> = ({ onFolderSelect, onFileSelect }) => {
    const { t } = useTranslation();
    const handleButtonClick = async () => {
        const Path = prompt('Enter ABSOLUTE path of the folder or the file');
        if (!Path) return;
        try {
            const response = await fetch('http://localhost:8080/api/isfolder', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ path: Path })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.folder)
                    onFolderSelect(Path);
                else
                    onFileSelect(Path);
            } else {
                console.error('folder/file does not exists');
            }
        } catch (error) {
            console.error("Couldn't said if path is folder or not", error);
        }
    };

    return (
        <div onClick={handleButtonClick}>
            {t('Open')}
        </div>
    );
};

export default OuvrirSelectionInput;