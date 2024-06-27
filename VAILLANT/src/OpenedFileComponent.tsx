import React from 'react';

interface OpenedFileProps {
    filename: string;
    onClick: () => void;
}

const OpenedFileComponent: React.FC<OpenedFileProps> = ({ filename, onClick }) => {
    return (
        <span onClick={onClick} style={{ cursor: 'pointer' }}>
            {filename.split('/').reverse()[0]}
        </span>
    );
};

export default OpenedFileComponent;