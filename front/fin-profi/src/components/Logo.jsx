// src/components/Logo.js
import React from 'react';
import logoSvg from '../assets/logo.svg'; // ← из components в assets
import './Logo.css';

const Logo = () => {
  return (
    <div className="logo-container">
      <div className="logo-group">
        <img src={logoSvg} alt="ФИН-Профи" className="logo-svg" />
      </div>
    </div>
  );
};

export default Logo;