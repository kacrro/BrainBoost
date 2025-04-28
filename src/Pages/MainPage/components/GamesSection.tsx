import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/GamesSection.css';

interface GameData {
    title: string;
    description: string;
    imageUrl: string;
    route: string; // dodajemy ścieżkę do strony gry
}

const games: GameData[] = [
    {
        title: 'Reflex Game',
        description: 'Test your reaction speed by clicking the screen immediately after it changes. A focus and reflex test.',
        imageUrl: '/images/reflex-game.jpg',
        route: '/game/reflex'
    },
    {
        title: 'Number Memory',
        description: 'Test your short-term memory by memorizing increasingly longer sequences of numbers.',
        imageUrl: '/images/number-memory.jpg',
        route: '/game/number-memory'
    },
    {
        title: 'Verbal Memory',
        description: 'Remember as many words as possible from an ever‑growing list. Practice your verbal memory.',
        imageUrl: '/images/verbal-memory.jpg',
        route: '/game/verbal-memory'
    },
    {
        title: 'Sequence Memory',
        description: 'Follow the sequence of highlighted shapes to test and improve your sequential memory.',
        imageUrl: '/images/sequence-memory.jpg',
        route: '/game/sequence-memory'
    },
    {
        title: 'Aim Trainer',
        description: 'Train accuracy and precision in an interactive exercise. Hone your aiming skills.',
        imageUrl: '/images/aim-trainer.jpg',
        route: '/game/aim-trainer'
    }
];

const GamesSection: React.FC = () => {
    return (
        <section className="games-section">
            {games.map((game, index) => (
                <div
                    key={game.title}
                    className={`game-container ${index % 2 === 0 ? 'reverse' : ''}`}
                >
                    <div className="game-image-container">
                        <img
                            src={game.imageUrl}
                            alt={game.title}
                            className="game-image"
                            loading="lazy"
                        />
                    </div>
                    <div className="game-content-container">
                        <div className="game-content">
                            <h2>{game.title}</h2>
                            <p>{game.description}</p>
                            <Link to={game.route} className="game-play-btn">
                                Graj teraz
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
};

export default GamesSection;
