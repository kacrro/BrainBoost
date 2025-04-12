import React from 'react';
import Navbar from '../MainPage/components/Navbar';

import Footer from '../MainPage/components/Footer';

import '../../App.css';
import GameDescription from "./components/GameDescription";
import AimTrainerGame from "./components/AimTrainerGame/AimTrainerGame";

export const AimTrainer_Page: React.FC = () => {
    return (
        <div className="App">
            <Navbar />
            <section id="Game">
                <AimTrainerGame/>
            </section>
            <section id="Description">
                <GameDescription />
            </section>

            <Footer />
        </div>
    );
};