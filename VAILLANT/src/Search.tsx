import React from 'react';
import { useTranslation } from 'react-i18next';

interface SearchButtonProps {
    folderPath: string|null;
    output: string;
    setOutput: React.Dispatch<React.SetStateAction<string>>
}

const SearchButton: React.FC<SearchButtonProps> = ({ folderPath, setOutput }) => {
    const { t } = useTranslation();
    const handleButtonClick = async () => {
        const content = prompt('Enter the STRING you want to search');
        if (!content) return;
        if (folderPath === null)
        {
            console.error("no active project");
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/api/execFeature', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ feature: "SEARCH", params: [content], project: folderPath}),
            });
            const data = await response.json();
            console.log(data);
            setOutput(data);
        } catch (error) {
            console.error('Error saving file content:', error);
        }
        
    };

    return (
        <div onClick={handleButtonClick}>
            {t('Search')}
        </div>
    );
};

export default SearchButton;