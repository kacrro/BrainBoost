import React, { useEffect, useState } from 'react';
import { GameMode } from '../types/aimTrainer';
import { GAME_TIME } from '../utils/aimTrainerUtils';
import './AimTrainerGame/styles/GameStatus.css';

interface GameStatusProps {
    isPlaying: boolean;
    score: number;
    gameMode: GameMode;
    gameStartTime: number;
}

const GameStatus: React.FC<GameStatusProps> = ({
                                                   isPlaying,
                                                   score,
                                                   gameMode,
                                                   gameStartTime
                                               }) => {
    const [timeLeft, setTimeLeft] = useState<number>(GAME_TIME / 1000);

    useEffect(() => {
        if (!isPlaying || gameMode !== 'Time') return;

        const interval = setInterval(() => {
            const elapsed = Date.now() - gameStartTime;
            const remaining = Math.max(0, Math.round((GAME_TIME - elapsed) / 1000));
            setTimeLeft(remaining);
        }, 100);

        return () => clearInterval(interval);
    }, [isPlaying, gameMode, gameStartTime]);

    if (!isPlaying) return null;

    return (
        <div className="game-status">
            <p>Wynik: {score}</p>
            {gameMode === 'Time' && <p>Pozostały czas: {timeLeft} s</p>}
        </div>
    );
};

export default GameStatus;