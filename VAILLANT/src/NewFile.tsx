import React from 'react';
import { useTranslation } from 'react-i18next';

interface FileOpeningInputProps {
    onFileCreation: (folderPath: string) => void;
}

const FileCreationInput: React.FC<FileOpeningInputProps> = ({ onFileCreation }) => {
    const { t } = useTranslation();
    const handleFileCreation = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const files = target.files;
        if (files && files.length > 0) {
            console.log(files[0])
            const folderPath = files[0].webkitRelativePath?.split('/')[0] ?? '';
            onFileCreation("../projets/" + folderPath);
        }
    };

    const handleButtonClick = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.setAttribute('webkitdirectory', 'true');
        fileInput.setAttribute('directory', 'true');
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', handleFileCreation);
        document.body.appendChild(fileInput);
        fileInput.click();
    };

    return (
        <div onClick={handleButtonClick}>
            {t('NewFile')}
        </div>
    );
};

export default FileCreationInput;