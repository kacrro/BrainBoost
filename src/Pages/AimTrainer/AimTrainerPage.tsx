import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import GameDescription from "./components/GameDescription";
import {GameContainer} from "./components/GameContainer";
import '../../App.css';

export const AimTrainerPage: React.FC = () => {
    return (
        <div className="App">
            {/* Komponent nawigacji */}
            <Navbar/>

            {/* Sekcja z grą - tutaj znajduje się główny kontener gry */}
            <section id="Game">
                <GameContainer/>
            </section>

            {/* Sekcja z opisem gry */}
            <section id="Description">
                <GameDescription/>
            </section>

            {/* Stopka strony */}
            <Footer/>
        </div>
    );
};