import {TargetSize} from '../types/aimTrainer';

export const GAME_TIME = 10000; // 10 sekund dla trybu Time
export const TARGET_COUNT_SPEED = 10; // 10 celów dla trybu Speed
export const TARGET_COUNT_HARDCORE = 20; // 20 celów dla trybu Hardcore
export const TARGET_LIFETIME_HARDCORE = 800; // 0.8s dla trybu Hardcore

export const getTargetSizeInPixels = (size: TargetSize): number => {
    switch (size) {
        case 'mały':
            return 20;
        case 'średni':
            return 40;
        case 'duży':
            return 60;
        default:
            return 40;
    }
};

export const calculateAverageReactionTime = (reactionTimes: number[]): number => {
    return reactionTimes.length > 0
        ? Math.round(reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length)
        : 0;
};

export const calculateAccuracy = (score: number, misses: number): number => {
    return (score + misses) > 0
        ? Math.round((score / (score + misses)) * 100)
        : 0;
};

export const calculateGameTime = (startTime: number, endTime: number): number => {
    return Math.round((endTime - startTime) / 10) / 100;
};