import React from 'react';
import { useTranslation } from 'react-i18next';

interface FolderSelectionInputProps {
    onFolderSelect: (folderPath: string) => void;
}

const FolderSelectionInput: React.FC<FolderSelectionInputProps> = ({ onFolderSelect }) => {
    const { t } = useTranslation();
    const handleFileInputChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const files = target.files;
        if (files && files.length > 0) {
            console.log(files[0])
            const folderPath = files[0].webkitRelativePath?.split('/')[0] ?? '';
            onFolderSelect("../Projets/" + folderPath);
        }
    };

    const handleButtonClick = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.setAttribute('webkitdirectory', 'true');
        fileInput.setAttribute('directory', 'true');
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', handleFileInputChange);
        document.body.appendChild(fileInput);
        fileInput.click();
    };

    return (
        <div onClick={handleButtonClick}>
            {t('OpenFolder')}
        </div>
    );
};

export default FolderSelectionInput;