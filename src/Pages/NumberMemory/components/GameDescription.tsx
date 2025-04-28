import React from 'react';
import '../styles/GameDescription.css';

const GameDescription: React.FC<{ onStart: () => void }> = ({ onStart }) => (
    <section className="game-description">
        <h2>🧠 Number Memory — How It Works</h2>

        <ul className="steps">
            <li><strong>Memorize</strong> — A random number will appear for 3 seconds.</li>
            <li><strong>Recall</strong> — Type the number you saw after it disappears.</li>
            <li><strong>Level Up</strong> — Correct answers increase the number length. Wrong answers cost a life.</li>
            <li><strong>Lives</strong> — You have 3 lives. Lose all = Game Over.</li>
        </ul>

        <div className="start-button-wrapper">
            <button className="start-button" onClick={onStart}>
                Start Game
            </button>
        </div>

        <p className="tip">💡 Tip: Memorize small chunks of the number!</p>
    </section>
);

export default GameDescription;