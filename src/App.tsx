import React from 'react';
import Navbar from './components/MainPage/Navbar';
import GamesSection from './components/MainPage/GamesSection';
import CreatorsSection from './components/MainPage/CreatorsSection';
import ContactForm from './components/MainPage/ContactForm';
import Footer from './components/MainPage/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import { Main_Page } from './Pages/MainPage/Main_Page';
import { AimTrainer_Page } from './Pages/AimTrainer/AimTrainer_Page';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<Main_Page/>}/>
            <Route path="/AimTrainer" element={<AimTrainer_Page/>} />


            </Routes>
        </Router>
    );
};

export default App;
