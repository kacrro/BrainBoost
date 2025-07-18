import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'; // Możesz importować style globalne
import './index.css'
const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
