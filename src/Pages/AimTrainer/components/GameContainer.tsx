import React, { useEffect, useState, useRef } from "react";
import "../styles/AimTrainer.css";
import {Target} from "./Target";

type Phase = 'start' | 'countdown' | 'playing' | 'finished';

interface HitResult {
    x: number;
    y: number;
    timeToHit: number;
}

export const GameContainer: React.FC = () => {
    const [phase, setPhase] = useState<Phase>('start');
    const [count, setCount] = useState<number>(3);
    const [targetPosition, setTargetPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [targetSize, setTargetSize] = useState<number>(50); // Rozmiar celu w pikselach
    const [hits, setHits] = useState<HitResult[]>([]);
    const [gameStartTime, setGameStartTime] = useState<number>(0);
    const [lastTargetTime, setLastTargetTime] = useState<number>(0);
    const [showTarget, setShowTarget] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [timeLeft, setTimeLeft] = useState<number>(10); // sekund na grę

    const gameAreaRef = useRef<HTMLDivElement>(null);

    // Funkcja do generowania losowej pozycji celu
    const generateRandomPosition = () => {
        if (gameAreaRef.current) {
            const gameArea = gameAreaRef.current;
            const maxX = gameArea.clientWidth - targetSize;
            const maxY = gameArea.clientHeight - targetSize;

            // Zapewnienie marginesu od krawędzi
            const x = Math.max(10, Math.floor(Math.random() * maxX));
            const y = Math.max(10, Math.floor(Math.random() * maxY));

            return { x, y };
        }
        return { x: 0, y: 0 };
    };

    // Obsługa odliczania
    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;

        if (phase === 'countdown') {
            if (count > 0) {
                timer = setTimeout(() => {
                    setCount(count - 1);
                }, 1000);
            } else {
                setPhase('playing');
                setCount(3);
                setGameStartTime(Date.now());
                setTimeLeft(10);
                setScore(0);
                setHits([]);
                setShowTarget(false);    // ← czyścimy poprzedni cel
            }
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [phase, count]);

    // Obsługa czasu gry
    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;

        if (phase === 'playing') {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setPhase('finished');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [phase]);

    // Pojawianie się nowego celu
    useEffect(() => {
        if (phase === 'playing' && !showTarget) {
            const newPosition = generateRandomPosition();
            setTargetPosition(newPosition);
            setShowTarget(true);
            setLastTargetTime(Date.now());
        }
    }, [phase, showTarget]);

    // Obsługa kliknięcia w cel
    const handleTargetClick = () => {
        if (phase === 'playing') {
            const hitTime = Date.now();
            const timeToHit = hitTime - lastTargetTime;

            // Dodaj nowy cel do listy trafień
            const newHit: HitResult = {
                x: targetPosition.x,
                y: targetPosition.y,
                timeToHit
            };

            setHits((prevHits) => [...prevHits, newHit]);
            setScore((prevScore) => prevScore + 1);
            setShowTarget(false);
        }
    };

    return (
        <div className="game-container">
            <div
                className="game-area"
                style={{ width: "80%", height: "600px" }}
                ref={gameAreaRef}
            >
                {phase === 'start' && (
                    <div className="start-window">
                        <h1 className="game-title">Aim Trainer</h1>
                        <p style={{ fontSize: "1rem" }}>Sprawdź swoje możliwości motoryczne!</p>
                        <button
                            className="start-button"
                            style={{ top: "75%" }}
                            onClick={() => setPhase('countdown')}
                        >
                            Start
                        </button>
                    </div>
                )}

                {phase === 'countdown' && (
                    <div className="start-window">
                        <div className="countdown-number">{count}</div>
                    </div>
                )}

                {phase === 'playing' && (
                    <div className="game-play-area">
                        <div className="game-info">
                            <div className="score">Punkty: {score}</div>
                            <div className="time-left">Czas: {timeLeft}s</div>
                        </div>

                        {showTarget && (
                            <Target
                                positionX={targetPosition.x}
                                positionY={targetPosition.y}
                                size={targetSize}
                                onClick={handleTargetClick}
                            />
                        )}
                    </div>
                )}

                {phase === 'finished' && (
                    <div className="start-window">
                        <h2>Koniec gry!</h2>
                        <div className="results">
                            <p>Twój wynik: {score} punktów</p>
                            <p>Średni czas reakcji: {hits.length > 0 ? Math.round(hits.reduce((acc, hit) => acc + hit.timeToHit, 0) / hits.length) : 0} ms</p>
                        </div>
                        <button
                            className="start-button"
                            style={{ top: "75%" }}
                            onClick={() => setPhase('start')}
                        >
                            Zagraj ponownie
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};