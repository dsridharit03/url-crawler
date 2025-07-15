import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './assets/styles.css'; // Fallback CSS import

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);