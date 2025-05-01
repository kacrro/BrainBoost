import React from 'react';
import '../styles/CreatorsSection.css';

interface CreatorData {
    name: string;
    role?: string;
}

const creators: CreatorData[] = [
    { name: 'Kacper W.', role: 'Aim Trainer ' },
    { name: 'Alicja S.', role: 'Verbal memory ' },
    { name: 'Adam M.', role: 'Number memory ' },
    { name: 'Marcin G.', role: 'Sequence memory ' },
    { name: 'Alicja J.', role: 'Reflex Game' }
];

const CreatorsSection: React.FC = () => {
    return (
        <section className="creators-section container">
            <h1>Our Team</h1>
            <div className="creators-grid">
                {creators.map((creator, index) => (
                    <div key={index} className="creator-card">
                        <div className="creator-avatar">
                            {creator.name.charAt(0)}
                        </div>
                        <div className="creator-info">
                            <h3 className="creator-name">{creator.name}</h3>
                            <p className="creator-role">{creator.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CreatorsSection;