// src/components/AimTrainer/GameArea.tsx
import React from 'react';
import { Target as TargetType, GameStats } from '../types/aimTrainer';
import Target from './Target';
import GameResults from './GameResults';
import '../../../styles/GameArea.css';
interface GameAreaProps {
    isPlaying: boolean;
    gameOver: boolean;
    targets: TargetType[];
    stats: GameStats;
    startGame: () => void;
    handleTargetClick: (targetId: number, event: React.MouseEvent) => void;
    handleGameAreaClick: () => void;
    // Zamiast React.RefObject<HTMLDivElement>
    gameAreaRef: React.MutableRefObject<HTMLDivElement | null>;
}


const GameArea: React.FC<GameAreaProps> = ({
                                               isPlaying,
                                               gameOver,
                                               targets,
                                               stats,
                                               startGame,
                                               handleTargetClick,
                                               handleGameAreaClick,
                                               gameAreaRef
                                           }) => {
    return (
        <div
            ref={gameAreaRef}
            className="game-area"
            onClick={handleGameAreaClick}
        >
            {!isPlaying && !gameOver && (
                <button className="play-button" onClick={startGame}>
                    Graj
                </button>
            )}

            {isPlaying && targets.map(target => (
                <Target
                    key={target.id}
                    target={target}
                    onClick={handleTargetClick}
                />
            ))}

            {gameOver && <GameResults stats={stats} onPlayAgain={startGame} />}
        </div>
    );
};

export default GameArea;