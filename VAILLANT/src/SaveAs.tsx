import React from 'react';
import { useTranslation } from 'react-i18next';

interface SaveButtonProps {
    filePath: string|null;
    filesContents: { [key: string]: string };
}

export const handleSaveAs = async (filesContents: {[key: string]: string}, filePath: string | null) => {
    const Path = prompt('Enter ABSOLUTE path of the new file');
    if (!Path) return;
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
    try {
        await fetch('http://localhost:8080/api/move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ src: filePath, dst: Path}),
        });
    } catch (error) {
        console.error('Error moving file', error);
    }
};

const SaveAsButton: React.FC<SaveButtonProps> = ({ filePath, filesContents }) => {
    const { t } = useTranslation();
    
    return (
        <div onClick={() => handleSaveAs(filesContents,filePath)}>
            {t('SaveAs')}
        </div>
    );
};

export default SaveAsButton;