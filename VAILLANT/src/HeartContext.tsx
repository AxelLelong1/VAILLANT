import React, { createContext, useState, useContext, Dispatch, SetStateAction } from 'react';

// Définir le type des valeurs du contexte
interface HeartContextType {
  fullHearts: number;
  emptyHearts: number;
  setFullHearts: Dispatch<SetStateAction<number>>;
  setEmptyHearts: Dispatch<SetStateAction<number>>;
}

// Créer le contexte initialisé avec des valeurs par défaut
const HeartContext = createContext<HeartContextType>({
  fullHearts: 5,  // Valeur par défaut pour fullHearts
  emptyHearts: 0,  // Valeur par défaut pour emptyHearts
  setFullHearts: () => {},  // Fonction par défaut pour mettre à jour fullHearts
  setEmptyHearts: () => {}   // Fonction par défaut pour mettre à jour emptyHearts
});

// Composant fournisseur du contexte
export const HeartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fullHearts, setFullHearts] = useState<number>(5);  // État pour fullHearts avec une valeur initiale de 5
  const [emptyHearts, setEmptyHearts] = useState<number>(0);  // État pour emptyHearts avec une valeur initiale de 0

  return (
    <HeartContext.Provider value={{ fullHearts, emptyHearts, setFullHearts, setEmptyHearts }}>
      {children}
    </HeartContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useHearts = (): HeartContextType => useContext(HeartContext);