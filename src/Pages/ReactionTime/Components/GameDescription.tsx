import React from 'react';
import '../styles/GameDescription.css';

const GameDescription: React.FC<{ onStart: () => void; isStarted: boolean }> = ({ onStart, isStarted }) => (
    <section className="game-description">
        <h2>⚡ Reaction Time — How It Works</h2>

        <ul className="steps">
            <li><strong>Get Ready</strong> — Click Start and get ready for the test!</li>
            <li><strong>Wait for the Green</strong> — After the countdown, the screen will turn red. Wait patiently for green!</li>
            <li><strong>Click as Fast as You Can</strong> — When the screen turns green, click as fast as you can!</li>
            <li><strong>Check Your Result</strong> — You will see your reaction time in milliseconds and compare it with previous attempts.</li>
        </ul>

        {!isStarted && (
            <div className="start-button-wrapper">
                <button
                    className="btn btn-moving-gradient btn-moving-gradient--blue"
                    onClick={onStart}
                >
                    Start
                </button>
            </div>
        )}

        <div className="performance-guide">
            <h3>🎯 Score Guide:</h3>
            <div className="guide-items">
                <div className="guide-item excellent">{'< 200ms'} - Excellent score! 🚀</div>
                <div className="guide-item very-good">200-300ms - Very good score! 👍</div>
                <div className="guide-item good">300-400ms - Good score! 😊</div>
                <div className="guide-item average">400-500ms - Average score 🙂</div>
                <div className="guide-item below-average">{'> 500ms'} - Room for improvement! 💪</div>
            </div>
        </div>

        <p className="tip">💡 Tip: Don't click too early! Clicking on a red screen restarts the test.</p>
    </section>
);

export default GameDescription;