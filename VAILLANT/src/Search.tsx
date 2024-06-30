import React from 'react';
import { useTranslation } from 'react-i18next';

interface SearchButtonProps {
    folderPath: string|null;
    output: string;
    setOutput: React.Dispatch<React.SetStateAction<string>>
    errors: string;
    setErrors: React.Dispatch<React.SetStateAction<string>>
}

const SearchButton: React.FC<SearchButtonProps> = ({ folderPath, setOutput, setErrors }) => {
    const { t } = useTranslation();
    const handleButtonClick = async () => {
        const content = prompt('Enter the STRING you want to search');
        if (!content) return;
        if (folderPath === null)
        {
            console.error("no active project");
            return;
        }
        const params = [content];
        console.log(params);
        params.push(content);
        try {
            const response = await fetch('http://localhost:8080/api/execFeature', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ feature: "SEARCH", params: params, project: folderPath}),
            });
            const data = await response.json();
            console.log(data);
            if (!response.ok)
            {
                setErrors("Something went wrong when searching");
                setOutput("");
            }
            else
            {
                setOutput(data.output);
                setErrors("");
            }
        } catch (error) {
            console.error('Error searching file content:', error);
            setErrors("Something went wrong when searching");
            setOutput("");
        }
        
    };

    return (
        <div onClick={handleButtonClick}>
            {t('Search')}
        </div>
    );
};

export default SearchButton;