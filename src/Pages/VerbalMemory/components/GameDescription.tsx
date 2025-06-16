import React from 'react';
import '../styles/GameDescription.css';

const GameDescription: React.FC<{ onStart: () => void; isStarted: boolean }> = ({ onStart, isStarted }) => (
  <section className="game-description">
    <h2>🧠 Verbal Memory — How It Works</h2>

    <ul className="steps">
      <li><strong>New or Seen?</strong> — You'll see a word. Decide if it's new or already seen before!</li>
      <li><strong>Stay focused</strong> — Words will repeat sometimes, be sharp and quick!</li>
      <li><strong>Lives</strong> — You have 3 lives. Every mistake costs one heart. Lose all = Game Over.</li>
    </ul>

    {!isStarted && (
      <div className="start-button-wrapper">
        <button
          className="btn btn-moving-gradient btn-moving-gradient--purple"
          onClick={onStart}
        >
          Start
        </button>
      </div>
    )}

    <p className="tip">💡 Tip: Try repeating words out loud or in your head!</p>
  </section>
);

export default GameDescription;
