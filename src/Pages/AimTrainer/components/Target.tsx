import React from "react";
import '../styles/Target.css'

// Interfejs właściwości komponentu Target
interface TargetProps {
    positionX: number;    // Pozycja X celu na ekranie
    positionY: number;    // Pozycja Y celu na ekranie
    size: number;         // Rozmiar celu w pikselach
    onClick: () => void;  // Funkcja wywoływana po kliknięciu w cel
}

// Komponent reprezentujący cel do klikania w grze Aim Trainer
export const Target: React.FC<TargetProps> = ({ positionX, positionY, size, onClick }) => {
    return (
        <div
            className="target"
            style={{
                // Pozycjonowanie absolutne celu na podstawie przekazanych współrzędnych
                left: `${positionX}px`,
                top: `${positionY}px`,
                // Ustawienie rozmiaru celu
                width: `${size}px`,
                height: `${size}px`,
            }}
            onClick={onClick} // Obsługa kliknięcia
        />
    );
};