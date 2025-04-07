import React from 'react';
import { GameMode, TargetSize } from '../../Pages/AimTrainer/types/aimTrainer';
import '../../styles/AimTrainer/AimTrainer_Game/GameOptions.css';

interface GameOptionsProps {
    gameMode: GameMode;
    targetSize: TargetSize;
    setGameMode: (mode: GameMode) => void;
    setTargetSize: (size: TargetSize) => void;
}

const GameOptions: React.FC<GameOptionsProps> = ({
                                                     gameMode,
                                                     targetSize,
                                                     setGameMode,
                                                     setTargetSize
                                                 }) => {
    return (
        <div className="game-options">
            <div>
                <h3>Tryb gry:</h3>
                <div className="button-group">
                    {(['Time', 'Speed', 'Hardcore'] as GameMode[]).map(mode => (
                        <button
                            key={mode}
                            className={`option-button ${gameMode === mode ? 'active' : ''}`}
                            onClick={() => setGameMode(mode)}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3>Rozmiar celu:</h3>
                <div className="button-group">
                    {(['mały', 'średni', 'duży'] as TargetSize[]).map(size => (
                        <button
                            key={size}
                            className={`option-button ${targetSize === size ? 'active' : ''}`}
                            onClick={() => setTargetSize(size)}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameOptions;