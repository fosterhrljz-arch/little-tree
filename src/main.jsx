import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { SchoolProvider } from './store';
import '@fontsource-variable/dm-sans';
import '@fontsource-variable/lora';
import './styles.css';
import './v2.css';
createRoot(document.getElementById('root')).render(<React.StrictMode><SchoolProvider><App/></SchoolProvider></React.StrictMode>);
