import React from 'react';
import '../../../styles/GameDescription.css'

const GameDescription: React.FC = () => (
    <section className="game-description">
        <h2>🎯 Aim Trainer — How It Works</h2>
        <ul className="steps">
            <li>
                <strong>Select a mode</strong> — choose between &nbsp;Normal, &nbsp;Precision, &nbsp;Speed, or Hardcore.
            </li>
            <li>
                <strong>Normal Mode</strong> — Targets are larger. Complete the round by hitting 20 targets. Your average reaction time is tracked.
            </li>
            <li>
                <strong>Precision Mode</strong> — Targets are smaller, challenging your accuracy. Complete the round by hitting 20 targets and see your average reaction time.
            </li>
            <li>
                <strong>Speed Mode</strong> — Targets appear briefly in standard size. The round lasts 20 seconds, and a fixed target duration is shown.
            </li>
            <li>
                <strong>Hardcore Mode</strong> — Targets are as small as in Precision mode and appear very briefly. The round lasts 20 seconds, with a fixed target appearance time.
            </li>
            <li>
                <strong>Aim accurately</strong> — Every hit increases your score, while misses lower your accuracy.
            </li>
            <li>
                <strong>Monitor your stats</strong> — At the end of each round, review your score, accuracy, total clicks, missed clicks, and reaction time or target duration.
            </li>
        </ul>
        <p className="tip">💡 Tip: Keep your focus and build a rhythm to improve your reaction time!</p>
    </section>
);

export default GameDescription;
