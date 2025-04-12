import React from 'react';
import { Target as TargetType } from '../types/aimTrainer';
import { getTargetSizeInPixels } from '../utils/aimTrainerUtils';
import './AimTrainerGame/styles/Target.css';

interface TargetProps {
    target: TargetType;
    onClick: (id: number, event: React.MouseEvent) => void;
}

const Target: React.FC<TargetProps> = ({ target, onClick }) => {
    const sizePixels = getTargetSizeInPixels(target.size as any);

    return (
        <div
            className="target"
            style={{
                width: `${sizePixels}px`,
                height: `${sizePixels}px`,
                left: `${target.x}px`,
                top: `${target.y}px`
            }}
            onClick={(e) => onClick(target.id, e)}
        />
    );
};

export default Target;
