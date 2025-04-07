// src/components/AimTrainer/AimTrainerGame.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Target, GameMode, TargetSize, GameStats } from '../../Pages/AimTrainer/types/aimTrainer';
import {
    GAME_TIME,
    TARGET_COUNT_SPEED,
    TARGET_COUNT_HARDCORE,
    TARGET_LIFETIME_HARDCORE,
    getTargetSizeInPixels,
    calculateAverageReactionTime,
    calculateAccuracy,
    calculateGameTime
} from '../../Pages/AimTrainer/utils/aimTrainerUtils';
import GameOptions from './GameOptions';
import GameArea from './GameArea';
import GameStatus from './GameStatus';
import '../../styles/AimTrainer/AimTrainer_Game/AimTrainerGame.css';

const AimTrainerGame: React.FC = () => {
    // Stan gry
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [targets, setTargets] = useState<Target[]>([]);
    const [score, setScore] = useState<number>(0);
    const [misses, setMisses] = useState<number>(0);
    const [reactionTimes, setReactionTimes] = useState<number[]>([]);
    const [gameStartTime, setGameStartTime] = useState<number>(0);
    const [gameEndTime, setGameEndTime] = useState<number>(0);

    // Ustawienia gry
    const [gameMode, setGameMode] = useState<GameMode>('Time');
    const [targetSize, setTargetSize] = useState<TargetSize>('średni');

    // Referencja do pola gry
    const gameAreaRef = useRef<HTMLDivElement>(null);

    // Timeouty i interwały
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Rozpoczęcie gry
    const startGame = () => {
        setIsPlaying(true);
        setGameOver(false);
        setTargets([]);
        setScore(0);
        setMisses(0);
        setReactionTimes([]);
        const startTime = Date.now();
        setGameStartTime(startTime);

        if (gameMode === 'Time') {
            // Rozpocznij odliczanie czasu
            timeoutRef.current = setTimeout(() => endGame(), GAME_TIME);
            // Dodawaj cele co pewien czas
            intervalRef.current = setInterval(() => addTarget(), 1000);
            // Dodaj pierwszy cel
            addTarget();
        } else if (gameMode === 'Speed') {
            // Dodaj pierwszy cel
            addTarget();
        } else if (gameMode === 'Hardcore') {
            // Dodaj pierwszy cel
            addTarget();

            // Uruchom interwał dla cyklu życia celu w trybie Hardcore
            intervalRef.current = setInterval(() => {
                setTargets(currentTargets => {
                    const now = Date.now();
                    // Usuń cele, które przekroczyły czas życia
                    const updatedTargets = currentTargets.filter(target =>
                        now - target.timestamp < TARGET_LIFETIME_HARDCORE
                    );

                    // Jeśli usunęliśmy jakiś cel, zwiększ licznik chybień
                    const removedCount = currentTargets.length - updatedTargets.length;
                    if (removedCount > 0) {
                        setMisses(prev => prev + removedCount);

                        // Jeśli nie ma już celów, dodaj nowy
                        if (updatedTargets.length === 0 && score + misses < TARGET_COUNT_HARDCORE) {
                            setTimeout(() => addTarget(), 300);
                        }

                        // Sprawdź czy gra się skończyła
                        if (score + misses + removedCount >= TARGET_COUNT_HARDCORE) {
                            endGame();
                        }
                    }

                    return updatedTargets;
                });
            }, 100); // Sprawdzaj co 100ms
        }
    };

    // Zakończenie gry
    const endGame = () => {
        setIsPlaying(false);
        setGameOver(true);
        setGameEndTime(Date.now());

        // Wyczyść wszystkie timeouty i interwały
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    // Dodaj nowy cel
    const addTarget = () => {
        if (!gameAreaRef.current) return;

        const gameArea = gameAreaRef.current;
        const gameRect = gameArea.getBoundingClientRect();

        // Określ rozmiar celu w pikselach
        const targetSizePixels = getTargetSizeInPixels(targetSize);

        // Losowa pozycja
        const x = Math.random() * (gameRect.width - targetSizePixels);
        const y = Math.random() * (gameRect.height - targetSizePixels);

        // Dodaj cel do tablicy
        setTargets(currentTargets => [
            ...currentTargets,
            {
                id: Date.now(),
                x,
                y,
                size: targetSize,
                timestamp: Date.now()
            }
        ]);
    };

    // Kliknięcie w cel
    const handleTargetClick = (targetId: number, event: React.MouseEvent) => {
        event.stopPropagation();

        // Znajdź kliknięty cel
        const target = targets.find(t => t.id === targetId);
        if (!target) return;

        // Oblicz czas reakcji
        const reactionTime = Date.now() - target.timestamp;
        setReactionTimes(prev => [...prev, reactionTime]);

        // Zwiększ wynik
        setScore(prev => prev + 1);

        // Usuń kliknięty cel
        setTargets(currentTargets =>
            currentTargets.filter(t => t.id !== targetId)
        );

        // Obsługa logiki dla różnych trybów
        if (gameMode === 'Speed') {
            if (score + 1 >= TARGET_COUNT_SPEED) {
                endGame();
            } else {
                addTarget();
            }
        } else if (gameMode === 'Hardcore') {
            if (score + 1 + misses >= TARGET_COUNT_HARDCORE) {
                endGame();
            } else {
                addTarget();
            }
        }
    };

    // Kliknięcie poza celem
    const handleGameAreaClick = () => {
        if (!isPlaying) return;

        setMisses(prev => prev + 1);
    };

    // Wyczyść interwały przy odmontowaniu komponentu
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // Oblicz statystyki
    const stats: GameStats = {
        avgReactionTime: calculateAverageReactionTime(reactionTimes),
        score: score,
        gameTime: calculateGameTime(gameStartTime, gameEndTime),
        accuracy: calculateAccuracy(score, misses)
    };

    return (
        <div className="aim-trainer-container">
            <h1 className="aim-trainer-title">Aim Trainer</h1>

            <GameOptions
                gameMode={gameMode}
                targetSize={targetSize}
                setGameMode={setGameMode}
                setTargetSize={setTargetSize}
            />

            <GameArea
                isPlaying={isPlaying}
                gameOver={gameOver}
                targets={targets}
                stats={stats}
                startGame={startGame}
                handleTargetClick={handleTargetClick}
                handleGameAreaClick={handleGameAreaClick}
                gameAreaRef={gameAreaRef}
            />

            <GameStatus
                isPlaying={isPlaying}
                score={score}
                gameMode={gameMode}
                gameStartTime={gameStartTime}
            />
        </div>
    );
};

export default AimTrainerGame;