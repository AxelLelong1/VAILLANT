import React, { useEffect, useState } from 'react';
import '../css/run.css';
import Modal from './Modal'; 

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
        <li>{(filename.split('/').reverse()[0])}</li>
    );
};

const FileBarComponent: React.FC = () => {
    const { files, error, nbLives } = useOpenedFiles();
    const [runError, setRunError] = useState<string | null>(null);
    const [runOutput, setRunOutput] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [errorCount, setErrorCount] = useState<number>(0);

    const totalLives = 5;
    const fullHearts = nbLives;
    const emptyHearts = totalLives - nbLives;

    const handleRun = async () => {
        try {
            console.log("running code");
            const response = await fetch('http://localhost:8080/api/compile', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: "def greet(name)\n    puts \"Hello, \" + name\nend\n# 1ère erreur : appel de méthode avec le mauvais nombre d'arguments\n greet()\n# 2ème erreur : utilisation d'une variable non définie\nputs message\n# 3ème erreur : syntaxe incorrecte\nif name == \"Alice\"\n    puts \"Hi Alice\"\nend\n"
                })});
            console.log("running code: trying response");
            if (!response.ok) {
                console.log("running code: response not ok");
                throw new Error('Failed to compile and run code');
            }
            console.log("running code: response ok");
            const data = await response.json();
            if (data.nb_errors > 0) {
                setErrorCount(data.nb_errors);
                setRunError(data.output);
                setShowModal(true);
            } else {
                setRunOutput(data.output);
                setRunError(null);
                setErrorCount(data.nb_errors);
                setShowModal(false);
            }
        } catch (error) {
            setRunError('Error running code');
            console.error('Error running code:', error);
            setRunOutput(null);
            setErrorCount(0);
            setShowModal(false);
        }
    };

    const handleCloseModal = () => {
        if (errorCount > 1) {
            setErrorCount(errorCount - 1);
        } else {
            setShowModal(false);
        }
    };

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
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button className="button-run" onClick={handleRun}>
                            <img src="/ImagesPing/BoutonRun.png" alt="Run"/>
                        </button>
                        <div id="life-bar" style={{ display: 'flex', alignItems: 'center' }}>
                            {[...Array(emptyHearts)].map((_, index) => (
                                <img key={index} src="/ImagesPing/empty-heart.png" alt="Empty Heart" style={{ width: '20px', height: '20px', margin: '0 2px' }} />
                            ))}
                            {[...Array(fullHearts)].map((_, index) => (
                                <img key={index} src="/ImagesPing/full-heart.png" alt="Full Heart" style={{ width: '20px', height: '20px', margin: '0 2px' }} />
                            ))}
                        </div>
                    </div>
                </>
            )}
            <Modal show={showModal} errors={runError} onClose={handleCloseModal} errorcount={errorCount}/>
        </div>
    );
};

export default FileBarComponent;