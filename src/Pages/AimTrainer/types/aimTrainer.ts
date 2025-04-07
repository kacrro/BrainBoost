// src/types/aimTrainer.ts
export type Target = {
    id: number;
    x: number;
    y: number;
    size: string;
    timestamp: number;
};

export type GameMode = 'Time' | 'Speed' | 'Hardcore';
export type TargetSize = 'mały' | 'średni' | 'duży';

export type GameStats = {
    avgReactionTime: number;
    score: number;
    gameTime: number;
    accuracy: number;
};