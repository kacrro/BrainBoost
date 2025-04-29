import React from "react";
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { GameArea } from "./Components/GameArea";
export const ReactionTimePage: React.FC = () => {
    return (
      <div className="App">
        <Navbar/>
        <GameArea/>
        <Footer/>
      </div>
    );
  };