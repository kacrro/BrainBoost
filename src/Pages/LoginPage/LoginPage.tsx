import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../../App.css';
import './styles/LoginPage.css';
import { supabase } from '../../utils/supabase';
import { useAuth } from '../../contexts/AuthContext';


export const LoginPage: React.FC = () => {
    // User email authentication
    const { setUserEmail, setUserName } = useAuth();
    
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
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loginEmail || !loginPassword) {
            setLoginError('All fields are required');
            return;
        }
        setLoginError('');
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: loginEmail,
            password: loginPassword,
        });
        
        if (error) {
            setLoginError('Invalid email or password');
            setLoginPassword('');
            return;
        }

        // Fetch user profile (username) from User table
        const { data: userData, error: userError } = await supabase
          .from('User')
          .select('username')
          .eq('email', loginEmail)
          .single();
        
        if (userError) {
            setLoginError('Could not fetch user profile');
            return;
        }

        // Save the email and username in context
        setUserEmail(loginEmail);
        setUserName(userData?.username || null);
        
        console.log('Login successful:', data);

        // Redirect to the main page after successful login
        window.location.href = '/';
    };
    
    
    // Handle registration submission
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
            setRegisterError('All fields are required');
            return;
        }

        if (registerPassword !== registerConfirmPassword) {
            setRegisterError('Passwords do not match');
            return;
        }

        if (!termsAccepted) {
            setRegisterError('You must accept the terms and conditions');
            return;
        }
        
        // Register user with Supabase Auth
        const { error: signUpError } = await supabase.auth.signUp({
            email: registerEmail,
            password: registerPassword,
        });
        
        if (signUpError) {
            if (signUpError.message.includes('already registered')) {
                setRegisterError('Email already exists');
            } else {
                setRegisterError(signUpError.message || 'Registration failed');
                console.error(signUpError);
            }
            return;
        }

        // Insert user profile into User table
        const { error: userInsertError } = await supabase
          .from('User')
          .insert({ email: registerEmail, username: registerName });
        
        if (userInsertError) {
            setRegisterError('Email already exists');
            return;
        }
        
        // Save the email in context
        setUserEmail(registerEmail);
        setUserName(registerName);
        
        window.location.href = '/';
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