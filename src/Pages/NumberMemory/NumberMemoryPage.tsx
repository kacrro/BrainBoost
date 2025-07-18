import '../../App.css';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import NumberMemoryGame from "./components/NumberMemoryGame";
import GameDescription from "./components/GameDescription";
import { useState } from "react";

const NumberMemoryPage = () => {
    const [startGame, setStartGame] = useState(false);

    const handleStart = () => {
        setStartGame(true);
        const gameSection = document.getElementById("Game");
        if (gameSection) {
            gameSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    const resetGame = () => {
        setStartGame(false); // Reset the startGame state to show GameDescription
    };

    return (
        <div className="App">
            <Navbar />

            <section id="Game">
                {startGame && <NumberMemoryGame resetGame={resetGame} />}
            </section>

            <section id="Description">
                <GameDescription onStart={handleStart} />
            </section>

            <Footer />
        </div>
    );
};

export default NumberMemoryPage;