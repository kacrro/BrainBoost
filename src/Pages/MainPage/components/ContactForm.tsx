import React, { useState } from 'react';
import '../styles/ContactForm.css';

const ContactForm: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Prosta walidacja
        if (name.trim().length < 2) {
            setFormStatus('error');
            return;
        }

        // Podstawowa walidacja email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setFormStatus('error');
            return;
        }

        // Symulacja wysyłania formularza
        console.log('Form submitted:', { name, email, message });

        // Resetowanie formularza
        setName('');
        setEmail('');
        setMessage('');
        setFormStatus('success');

        // Resetowanie statusu po 3 sekundach
        setTimeout(() => {
            setFormStatus('idle');
        }, 3000);
    };

    return (
        <section className="contact-section">
            <div className="contact-form-container">
                <h1>Contact Us !</h1>
                <p className="contact-subtitle">
                    Have questions? We’re happy to help! Fill out the form, and we’ll get in touch with you.
                </p>

                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                        <label htmlFor="name">Imię</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Write your name"
                            required
                            minLength={2}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email adress"
                            required
                            pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Wiadomość</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Please describe the reason for your contact."
                            rows={4}
                            required
                            minLength={10}
                        />
                    </div>

                    {formStatus === 'success' && (
                        <div className="form-status success">
                            Your message has been sent! We will contact you shortly.
                        </div>
                    )}

                    {formStatus === 'error' && (
                        <div className="form-status error">
                            Please correct the information in the form.
                        </div>
                    )}

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={formStatus === 'success'}
                    >
                        {formStatus === 'success' ? 'Send' : 'Send message'}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ContactForm;