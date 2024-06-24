import React, { useEffect, useState } from 'react';

const useOpenedFiles = () => {
    const [files, setFiles] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [nbLives, setNbLives] = useState<number>(5);

    useEffect(() => {
        const fetchOpenedFiles = async () => {
            try {
                console.log("getting opened files");
                const response = await fetch('http://localhost:8080/api/getOpenFiles', {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                console.log("getting opened files: trying response");
                if (!response.ok) {
                    console.log("getting opened files: response not ok");
                    throw new Error('Failed to get open files');
                }
                console.log("getting opened files: response ok");
                const data = await response.json();
                setFiles(data);
            } catch (error) {
                setError('Error fetching open files');
                console.error('Error fetching open files:', error);
            }
        };

        fetchOpenedFiles();
    }, []);

    return { files, error, nbLives, setNbLives };
};


const OpenedFileComponent: React.FC<{ filename: string }> = ({ filename }) => {
    return (
        <li>{filename.split('/').reverse()[0]}</li>
    );
};

const FileBarComponent: React.FC = () => {
    const { files, error, nbLives } = useOpenedFiles();

    const totalLives = 5;
    const fullHearts = nbLives;
    const emptyHearts = totalLives - nbLives;

    return (
        <div className="open-files-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {error ? (
                <p>{error}</p>
            ) : (
                <>
                    <ul id="open-files-list">
                        {files.map((file, index) => (
                            <OpenedFileComponent key={index} filename={file} />
                        ))}
                    </ul>
                    <div id="life-bar">
                        {[...Array(emptyHearts)].map((_, index) => (
                            <img key={index} src="/ImagesPing/empty-heart.png" alt="Empty Heart" style={{ width: '20px', height: '20px', margin: '0 2px' }} />
                        ))}
                        {[...Array(fullHearts)].map((_, index) => (
                            <img key={index} src="/ImagesPing/full-heart.png" alt="Full Heart" style={{ width: '20px', height: '20px', margin: '0 2px' }} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default FileBarComponent;