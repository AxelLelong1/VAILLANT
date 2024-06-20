import React from 'react';

interface FolderSelectionInputProps {
    onFolderSelect: (folderPath: string) => void;
}

const FolderSelectionInput: React.FC<FolderSelectionInputProps> = ({ onFolderSelect }) => {
    const handleFileInputChange = async (event: Event) => {
        const target = event.target as HTMLInputElement;
        const files = target.files;
        if (files && files.length > 0) {
            console.log(files[0])
            const folderPath = files[0].webkitRelativePath?.split('/')[0] ?? '';
            try {
                // Replace with your fetch logic to get file tree based on folderPath
                const response = await fetch('http://localhost:8080/api/create/file', {
                    method:'POST',
                    headers: {
                        "Content-Type":"application/json",
                    },
                    body: JSON.stringify({path: folderPath})
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch file tree');
                }
                //const data = await response.json();
                //setContent(data.children);
            } catch (error) {
                console.error('Error fetching file tree:', error);
            }
            onFolderSelect("../projets/" + folderPath);
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
            Ouvrir un dossier ...
        </div>
    );
};

export default FolderSelectionInput;