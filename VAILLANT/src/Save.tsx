import React from 'react';
import { useTranslation } from 'react-i18next';

interface SaveButtonProps {
    filePath: string|null;
    filesContents: { [key: string]: string };
}

export const handleSave = async (filesContents: { [key: string]: string }, filePath: string | null) => {
    if (filePath === null)
    {
        console.error("no active file here");
        return;
    }
    console.log(filePath)
    console.log(filesContents[filePath])
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

const SaveButton: React.FC<SaveButtonProps> = ({ filePath, filesContents }) => {
    const { t } = useTranslation();
    

    return (
        <div onClick={() => handleSave(filesContents, filePath)}>
            {t('Save')}
        </div>
    );
};

export default SaveButton;