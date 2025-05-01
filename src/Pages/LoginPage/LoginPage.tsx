import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../../App.css';
import './styles/LoginPage.css';

export const LoginPage: React.FC = () => {
    // Login form state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // Registration form state
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
    const [registerError, setRegisterError] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);

    // Handle login submission
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!loginEmail || !loginPassword) {
            setLoginError('Wszystkie pola są wymagane');
            return;
        }

        // Here you would add actual authentication logic
        console.log('Login attempt with:', loginEmail);

        // Clear form after submission
        setLoginEmail('');
        setLoginPassword('');
        setLoginError('');
    };

    // Handle registration submission
    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
            setRegisterError('Wszystkie pola są wymagane');
            return;
        }

        if (registerPassword !== registerConfirmPassword) {
            setRegisterError('Hasła muszą być zgodne');
            return;
        }

        if (!termsAccepted) {
            setRegisterError('Musisz zaakceptować Warunki korzystania i Politykę prywatności');
            return;
        }

        // Here you would add actual registration logic
        console.log('Registration attempt with:', registerEmail);

        // Clear form after submission
        setRegisterName('');
        setRegisterEmail('');
        setRegisterPassword('');
        setRegisterConfirmPassword('');
        setRegisterError('');
        setTermsAccepted(false);
    };

    return (
        <div className="App">
            <Navbar />
            <section id="auth-container">
                <div className="auth-panel">
                    <div className="login-side">
                        <div className="auth-content">
                            <h2 className="auth-title">Login</h2>
                            <p className="auth-subtitle">Log in, to continue</p>

                            <form className="auth-form" onSubmit={handleLogin}>
                                {loginError && <div className="auth-error">{loginError}</div>}

                                <div className="form-group-login">
                                    <label htmlFor="login-email">Email</label>
                                    <input
                                        type="email"
                                        id="login-email"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div className="form-group-login">
                                    <label htmlFor="login-password">Password</label>
                                    <input
                                        type="password"
                                        id="login-password"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="forgot-password">
                                    <a href="#">Forgot your password?</a>
                                </div>

                                <button type="submit" className="auth-button">
                                    Log in
                                </button>
                            </form>

                        </div>
                    </div>
                    <div className="register-side">
                        <div className="auth-content">
                            <h2 className="auth-title">Register</h2>
                            <p className="auth-subtitle">Join us and check yourself out!</p>

                            <form className="auth-form" onSubmit={handleRegister}>
                                {registerError && <div className="auth-error">{registerError}</div>}

                                <div className="form-group-register" >
                                    <label htmlFor="register-name" >Name</label>
                                    <input
                                        type="text"
                                        id="register-name"
                                        value={registerName}
                                        onChange={(e) => setRegisterName(e.target.value)}
                                        placeholder="Your name"
                                    />
                                </div>

                                <div className="form-group-register">
                                    <label htmlFor="register-email" className="form-title-text">Email</label>
                                    <input
                                        type="email"
                                        id="register-email"
                                        value={registerEmail}
                                        onChange={(e) => setRegisterEmail(e.target.value)}
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div className="form-group-register">
                                    <label htmlFor="register-password">Password</label>
                                    <input
                                        type="password"
                                        id="register-password"
                                        value={registerPassword}
                                        onChange={(e) => setRegisterPassword(e.target.value)}
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="form-group-register">
                                    <label htmlFor="register-confirm-password">Confirm your password</label>
                                    <input
                                        type="password"
                                        id="register-confirm-password"
                                        value={registerConfirmPassword}
                                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="terms">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                    />
                                    <label htmlFor="terms">
                                        Accept <a href="#">Terms of use</a> & <a href="#">Private Policy</a>
                                    </label>
                                </div>

                                <button type="submit" className="auth-button">
                                    Create account
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};