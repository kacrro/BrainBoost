import React from 'react';
import Navbar from '../../components/MainPage/Navbar';

import Footer from '../../components/MainPage/Footer';

import '../../App.css';
import GameDescription from "../../components/AimTrainer/GameDescription";
import AimTrainerGame from "../../components/AimTrainer/AimTrainerGame";

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