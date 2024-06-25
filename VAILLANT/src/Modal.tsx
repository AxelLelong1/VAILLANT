import React, { useEffect, useState } from 'react';
import '../css/modal.css'; // Assurez-vous que le fichier CSS est importé

interface ModalProps {
    show: boolean;
    errors: string|null;
    onClose: () => void;
    errorcount: number;
}

const Modal: React.FC<ModalProps> = ({ show, errors, onClose, errorcount }) => {

    const [position, setPosition] = useState({ top: '50%', left: '50%' });

    useEffect(() => {
        if (show) {
            const randomTop = Math.random() * (window.innerHeight - 500) + 100; // Ajustez les valeurs pour s'assurer que la fenêtre ne dépasse pas les bords de l'écran
            const randomLeft = Math.random() * (window.innerWidth - 500) + 100;
            setPosition({ top: `${randomTop}px`, left: `${randomLeft}px` });
        }
    }, [errorcount, show]);

    const currentPosition = position || { top: 0, left: 0 };

    if (!show) {
        return null;
    }

    return (
        <div className="modal"style={{
            position: 'fixed',
            top: currentPosition.top,
            left: currentPosition.left,
            padding: '20px',
            zIndex: 1000,
        }}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <p style={{ fontSize: '40' }}>{"Compilation Errors: "}</p>
                <p>{errors}</p>
            </div>
        </div>
    );
};

export default Modal;