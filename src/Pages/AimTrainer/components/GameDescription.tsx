import React from 'react';
import '../../../styles/GameDescription.css'

const GameDescription: React.FC = () => (
    <section className="game-description">
        <h2>🎯 Aim Trainer — How It Works</h2>
        <ul className="steps">
            <li>Press Start to begin a new game session</li>
            <li>After the 3-second countdown, targets will appear randomly on screen</li>
            <li>Click on each target as quickly as you can</li>
            <li>Each hit earns you 1 point - try to get the highest score!</li>
            <li>You have 30 seconds to hit as many targets as possible</li>
            <li>After the game ends, you'll see your score and average reaction time</li>
        </ul>
        <p className="tip">💡 Tip: Focus on the center of the screen and react quickly when targets appear at the periphery. Your goal is to maintain both speed and accuracy!</p>
    </section>
);

export default GameDescription;