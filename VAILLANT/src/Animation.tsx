// Animation.tsx
import React, { useEffect, useState } from 'react';
import '../css/Animation.css';

const Animation: React.FC<{ visible: boolean }> = ({ visible }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [audio] = useState(new Audio('/music/explosion.mp3'));

    useEffect(() => {
      if (visible) {
        const timer = setTimeout(() => {
            setIsImageLoaded(false);
          // La logique de fin d'animation peut être gérée ici si nécessaire
        }, 3000); // L'animation dure 2 secondes
  
        return () => clearTimeout(timer);
      }
    }, [visible]);

    const handleImageLoad = () => {
        setIsImageLoaded(true);
        audio.play();
      };
  
    if (!visible) return null;

    return (
    <div className="animation-container">
      <img
        src="/ImagesPing/explosion2.png"
        alt="Image"
        className={`animation-image ${isImageLoaded ? 'loaded' : ''}`}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default Animation;