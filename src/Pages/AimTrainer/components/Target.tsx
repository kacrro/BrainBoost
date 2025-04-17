import React from "react";

import '../styles/Target.css'

interface TargetProps {
    positionX: number;
    positionY: number;
    size: number;
    onClick: () => void;
}

export const Target: React.FC<TargetProps> = ({ positionX, positionY, size, onClick }) => {
    return (
        <div
            className="target"
            style={{
                left: `${positionX}px`,
                top: `${positionY}px`,
                width: `${size}px`,
                height: `${size}px`,
            }}
            onClick={onClick}
        />
    );
};