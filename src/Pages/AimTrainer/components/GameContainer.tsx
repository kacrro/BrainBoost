import React, {useEffect} from "react";
import "../styles/AimTrainer.css";
import { useState } from "react";
type Phase = 'start' | 'countdown' | 'playing' | ' finished';
interface HitResult {
    x: number;
    y: number;
}
export const GameContainer: React.FC = () => {
    const [Phase, setPhase] = useState<Phase>('start');
    const [Count, setCount] = useState<number>(3);


    useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (Phase === 'countdown') {
        if (Count > 0) {
            timer = setTimeout(() => {
                setCount(Count - 1);
            }, 1000);
        } else  {
            setPhase('playing');
            setCount(3);
        }

    }

    return () => {
        if (timer) {
            clearTimeout(timer);
        }
    }}, [Phase, Count]);


    return (
        <div className="game-container">

            <div className="game-area" style={ { width: "80%", height: "600px" }}>

                {Phase === 'start' && (

                        <div className="start-window" >
                            <h1 className="game-title">Aim Trainer</h1>
                            <a style = {{fontSize: "1rem"}}>Sprawdź swoje możliwości motoryczne !</a>
                            <button className="start-button" style={{top: "75%"}} onClick={() => setPhase('countdown')}>Start</button>
                        </div>
                )}

                {Phase === 'countdown' && (

                    <div className="start-window" >
                        <div className="countdown-number">{Count}</div>
                    </div>
                )}

                {Phase === 'playing' && (
                    <div className="game-play-area">

                        <div>Gra w toku!</div>
                    </div>
                )}

            </div>
        </div>
    );
}