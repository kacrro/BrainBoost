import React from 'react';
import { GameStats } from '../types/aimTrainer';
import './AimTrainerGame/styles/GameResults.css';

interface GameResultsProps {
    stats: GameStats;
    onPlayAgain: () => void;
}

const GameResults: React.FC<GameResultsProps> = ({ stats, onPlayAgain }) => {
    return (
        <div className="game-results">
            <h2>Wyniki</h2>
            <div className="stats-container">
                <p>Średni czas reakcji: {stats.avgReactionTime} ms</p>
                <p>Trafione cele: {stats.score}</p>
                <p>Czas gry: {stats.gameTime} s</p>
                <p>Skuteczność: {stats.accuracy}%</p>
            </div>
            <div className="button-container">
                <button className="play-again-button" onClick={onPlayAgain}>
                    Zagraj ponownie
                </button>
            </div>
        </div>
    );
};

export default GameResults;