import '../../App.css';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SequenceMemoryGame from "./components/SequenceMemoryGame";
import GameDescription from "./components/GameDescription";
import React from "react";

const SequenceMemoryPage = () => {
  return (
    <div className="App">
      <Navbar/>
      
      <section id="Game">
        <SequenceMemoryGame />
      </section>
      
      <section id="Description">
        <GameDescription/>
      </section>
      
      <Footer/>
    </div>
  );
};

export default SequenceMemoryPage;
