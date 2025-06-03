import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../utils/supabase';
import PopupScreen from './PopupScreen';
import GameDescription from './GameDescription';
import '../styles/Reflex.css';

type Phase = 'description' | 'start' | 'countdown' | 'ready' | 'now' | 'finished';

const getRandomDelay = () => 2000 + Math.random() * 3000; // 2–5s

const ReflexContainer: React.FC = () => {
    const { userEmail } = useAuth();
    const [phase, setPhase] = useState<Phase>('description');
    const [count, setCount] = useState(3);
    const [message, setMessage] = useState('');
    const [reactionTime, setReactionTime] = useState<number | null>(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const [allAttempts, setAllAttempts] = useState<number[]>([]);

    const startTimeRef = useRef<number>(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const hasSavedScoreRef = useRef(false);
    const savingRef = useRef(false);

    const saveScore = useCallback(async (score: number) => {
        if (!userEmail || savingRef.current || hasSavedScoreRef.current) return;

        savingRef.current = true;
        const { error } = await supabase.from('GameResult').insert({
            game_type: 'ReactionTime',
            user_email: userEmail,
            score,
            created_at: new Date().toISOString(),
        });

        if (!error) {
            hasSavedScoreRef.current = true;
        }

        savingRef.current = false;
    }, [userEmail]);

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

    const handleStartGame = () => {
        setPhase('start');
    };

    const handleClick = async () => {
        if (phase === 'start') {
            setPhase('countdown');
            hasSavedScoreRef.current = false;
        } else if (phase === 'ready') {
            // clicked too early
            clearTimeout(timeoutRef.current);
            setReactionTime(null);
            setPhase('finished');
            setMessage('Too soon! Try again.');
        } else if (phase === 'now') {
            const rt = Date.now() - startTimeRef.current;
            setReactionTime(rt);
            setAllAttempts(prev => [...prev, rt]);
            setPhase('finished');

            // Save score to database
            if (userEmail && !hasSavedScoreRef.current) {
                try {
                    await saveScore(rt);
                } catch (err) {
                    console.error('Error saving score:', err);
                }
            }
        } else if (phase === 'finished') {
            if (reactionTime !== null) {
                // Show popup with results
                setPopupVisible(true);
            } else {
                // If it was "too soon", just restart
                setPhase('start');
                setMessage('');
            }
        }
    };

    const handlePlayAgain = () => {
        setPhase('start');
        setReactionTime(null);
        setMessage('');
        setPopupVisible(false);
    };

    const handleClosePopup = () => {
        setPopupVisible(false);
        setPhase('start');
        setReactionTime(null);
        setMessage('');
    };

    // Jeśli jesteśmy w fazie opisu, pokaż GameDescription
    if (phase === 'description') {
        return (
            <GameDescription
                onStart={handleStartGame}
                isStarted={false}
            />
        );
    }

    return (
        <>
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
                        <button className="btn btn-moving-gradient btn-moving-gradient--blue">Start</button>
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
                            ? (
                                <>
                                    <p className="results">Twój czas reakcji: {reactionTime} ms</p>
                                    <button className="btn btn-moving-gradient btn-moving-gradient--blue">Zobacz wyniki</button>
                                </>
                            )
                            : (
                                <>
                                    <p className="results">Kliknąłeś za wcześnie!</p>
                                    <button className="btn btn-moving-gradient btn-moving-gradient--blue">Jeszcze raz</button>
                                </>
                            )
                        }
                    </div>
                )}
            </div>

            <PopupScreen
                reactionTime={reactionTime}
                popupVisible={popupVisible}
                onClose={handleClosePopup}
                onPlayAgain={handlePlayAgain}
                allAttempts={allAttempts}
            />
        </>
    );
};

export default ReflexContainer;