import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import GameDescription from "./components/GameDescription";
import AimTrainerGame from "./components/AimTrainerGame/AimTrainerGame";
import '../../App.css';

export const AimTrainerPage: React.FC = () => {
  return (
    <div className="App">
      <Navbar/>
      <section id="Game">
        <AimTrainerGame/>
      </section>
      <section id="Description">
        <GameDescription/>
      </section>
      
      <Footer/>
    </div>
  );
};