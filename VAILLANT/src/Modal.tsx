import React, { useEffect, useState } from 'react';
import '../css/modal.css'; // Assurez-vous que le fichier CSS est importé

interface ModalProps {
    show: boolean;
    errors: string|null;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ show, errors, onClose }) => {

    const [position, setPosition] = useState({ top: '50%', left: '50%' });

    useEffect(() => {
        if (show) {
            const randomTop = Math.random() * (window.innerHeight - 200) + 100; // Ajustez les valeurs pour s'assurer que la fenêtre ne dépasse pas les bords de l'écran
            const randomLeft = Math.random() * (window.innerWidth - 200) + 100;
            setPosition({ top: `${randomTop}px`, left: `${randomLeft}px` });
        }
    }, [show]);

    if (!show) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <p style={{ fontSize: '40' }}>{"Compilation Errors: "}</p>
                <p>{errors}</p>
            </div>
        </div>
    );
};

export default Modal;