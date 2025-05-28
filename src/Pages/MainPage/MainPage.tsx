import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import GamesSection from './components/GamesSection';
import CreatorsSection from './components/CreatorsSection';
import ContactForm from './components/ContactForm';
import Footer from '../../components/Footer';
import '../../App.css';

export const MainPage: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        const sectionId = location.state?.scrollTo;
        if (sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    return (
        <div className="App">
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