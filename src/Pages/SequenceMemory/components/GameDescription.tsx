import React from 'react';
import '../../../styles/GameDescription.css'

const GameDescription: React.FC = () => (
    <section className="game-description">
        <h2>🧠 Sequence Memory — How It Works</h2>
        <ul className="steps">
            <li>
                <strong>Click to start</strong> — The game starts with a highlighted square. Click it to begin the game.
            </li>
            <li>
                <strong>Repeat the sequence</strong> — After each completed sequence another square gets added, making it longer and harder to remember. Try to keep up!
            </li>
            <li>
                <strong>Be precise</strong> — The moment you click the wrong square the game ends, giving you a score based on the number of squares you managed to remember.
            </li>
        </ul>
        <p className="tip">💡 Tip: Look for patterns and repeat the sequence out loud or in your head!</p>
    </section>
);

export default GameDescription;
