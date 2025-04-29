// src/pages/components/ReflexContainer.tsx
import React, { useState, useEffect, useRef } from 'react';
import '../styles/Reflex.css';

type Phase = 'start' | 'countdown' | 'ready' | 'now' | 'finished';

const getRandomDelay = () => 2000 + Math.random() * 3000; // 2–5s

const ReflexContainer: React.FC = () => {
    const [phase, setPhase] = useState<Phase>('start');
    const [count, setCount] = useState(3);
    const [message, setMessage] = useState('');
    const [reactionTime, setReactionTime] = useState<number | null>(null);
    const startTimeRef = useRef<number>(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    // countdown effect
    useEffect(() => {
        if (phase === 'countdown') {
            if (count > 0) {
                timeoutRef.current = setTimeout(() => setCount(c => c - 1), 1000);
            } else {
                setPhase('ready');
                setCount(3);
            }
        }
        return () => timeoutRef.current && clearTimeout(timeoutRef.current);
    }, [phase, count]);

    // after ready, wait random then go to now
    useEffect(() => {
        if (phase === 'ready') {
            setMessage('Get ready...');
            timeoutRef.current = setTimeout(() => {
                startTimeRef.current = Date.now();
                setPhase('now');
                setMessage('Click now!');
            }, getRandomDelay());
        }
        return () => timeoutRef.current && clearTimeout(timeoutRef.current);
    }, [phase]);

    const handleClick = () => {
        if (phase === 'start') {
            setPhase('countdown');
        } else if (phase === 'ready') {
            // clicked too early
            clearTimeout(timeoutRef.current);
            setReactionTime(null);
            setPhase('finished');
            setMessage('Too soon! Try again.');
        } else if (phase === 'now') {
            const rt = Date.now() - startTimeRef.current;
            setReactionTime(rt);
            setPhase('finished');
        } else if (phase === 'finished') {
            setPhase('start');
            setReactionTime(null);
            setMessage('');
        }
    };

    return (
        <div
        className="game-area"
            onClick={handleClick}
            style={{
                cursor: phase === 'now' ? 'crosshair' : 'pointer',
                backgroundColor: phase === 'now' ? '#c0392b' : '#27ae60'
                    }}
          >
            {phase === 'start' && (
                <div className="start-window">
                    <h1 className="game-title">Reflex Test</h1>
                    <p>Sprawdź swój czas reakcji!</p>
                    <button className="start-button-reflex">Start</button>
                </div>
            )}
            {phase === 'countdown' && (
                <div className="start-window">
                    <div className="countdown-number">{count}</div>
                </div>
            )}
            {(phase === 'ready' || phase === 'now') && (
                <div className="ready-message">
                    {message}
                </div>
            )}
            {phase === 'finished' && (
                <div className="start-window">
                    <h2>Wynik</h2>
                    {reactionTime !== null
                        ? <p className="results">Twój czas reakcji: {reactionTime} ms</p>
                        : <p className="results">Kliknąłeś za wcześnie!</p>
                    }
                    <button className="start-button-reflex">Jeszcze raz</button>
                </div>
            )}
        </div>
    );
};

export default ReflexContainer;