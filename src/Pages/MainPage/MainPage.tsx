import React from 'react';
import Navbar from '../../components/Navbar';
import GamesSection from './components/GamesSection';
import CreatorsSection from './components/CreatorsSection';
import ContactForm from './components/ContactForm';
import Footer from '../../components/Footer';

import '../../App.css';

export const MainPage: React.FC = () => {
    return (
        <div className="App">
            <link rel="icon" href="%PUBLIC_URL%/brain-boost-logo.png?v=3"/>
            <link rel="shortcut icon" href="%PUBLIC_URL%/brain-boost-logo.png?v=3"/>
            <link rel="apple-touch-icon" href="%PUBLIC_URL%/brain-boost-logo.png?v=3"/>
            <Navbar />

            {/* Sekcja gier */}
            <section id="games">
                <GamesSection />
            </section>

            {/* Sekcja twórców */}
            <section id="creators">
                <CreatorsSection />
            </section>

            {/* Sekcja kontaktowa (ankieta) */}
            <section id="contact">
                <ContactForm />
            </section>

            {/* Stopka */}
            <Footer />
        </div>
    );
};