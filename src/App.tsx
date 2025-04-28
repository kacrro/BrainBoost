import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { MainPage } from './Pages/MainPage/MainPage';
import { AimTrainerPage } from './Pages/AimTrainer/AimTrainerPage';
import SequenceMemoryPage from "./Pages/SequenceMemory/SequenceMemoryPage";
import VerbalMemoryPage from "./Pages/VerbalMemory/VerbalMemoryPage";
import NumberMemoryPage from "./Pages/NumberMemory/NumberMemoryPage";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="/game/aim-trainer" element={<AimTrainerPage/>} />
            <Route path="/game/sequence-memory" element={<SequenceMemoryPage />} />
            <Route path="/game/verbal-memory" element={<VerbalMemoryPage />} />
            <Route path="/game/number-memory" element={<NumberMemoryPage />} />
            </Routes>
        </Router>
    );
};

export default App;
