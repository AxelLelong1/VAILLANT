import React from 'react';

interface OpenedFileProps {
    filename: string;
    onClick: () => void;
}

const OpenedFileComponent: React.FC<OpenedFileProps> = ({ filename, onClick }) => {
    return (
        <li onClick={onClick} style={{ cursor: 'pointer' }}>
            {filename.split('/').reverse()[0]}
        </li>
    );
};

export default OpenedFileComponent;