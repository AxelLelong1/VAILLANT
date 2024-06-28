import React from 'react';
import { useTranslation } from 'react-i18next';

interface SaveButtonProps {
    filePath: string|null;
    filesContents: { [key: string]: string };
}

const SaveButton: React.FC<SaveButtonProps> = ({ filePath, filesContents }) => {
    const { t } = useTranslation();
    const handleButtonClick = async () => {
        if (filePath === null)
        {
            console.error("no active file");
            return;
        }
        console.log(filePath)
        console.log(filesContents)
        try {
            await fetch('http://localhost:8080/api/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ path: filePath, content: filesContents[filePath]}),
            });
        } catch (error) {
            console.error('Error saving file content:', error);
        }
    };

    return (
        <div onClick={handleButtonClick}>
            {t('Save')}
        </div>
    );
};

export default SaveButton;