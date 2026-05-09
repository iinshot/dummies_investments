import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="login-fullscreen">
      <div className="login-container register-container">
        {/* Кнопка назад */}
        <button className="login-back-button" onClick={handleGoBack}>
          <span className="back-arrow">←</span>
        </button>
        
        <h1 className="login-logo">ФИН-ПРОФИ</h1>
        <div className="login-divider-line-thin"></div>
        <h2 className="login-title">Регистрация</h2>
        <p className="register-subtitle">Создайте аккаунт, чтобы сохранить прогресс</p>
        
        <form onSubmit={handleSubmit}>
          {/* Имя пользователя */}
          <div className="input-group">
            <label>ИМЯ ПОЛЬЗОВАТЕЛЯ</label>
            <div className="input-with-icon">
              <span className="input-icon user-icon"></span>
              <input 
                type="text" 
                placeholder="Введите имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* Email */}
          <div className="input-group">
            <label>EMAIL</label>
            <div className="input-with-icon">
              <span className="input-icon mail-icon"></span>
              <input 
                type="email" 
                placeholder="Введите email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* Пароль */}
          <div className="input-group">
            <label>ПАРОЛЬ</label>
            <div className="input-with-icon">
              <span className="input-icon lock-icon"></span>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                <span className={`eye-icon ${showPassword ? 'eye-open' : 'eye-closed'}`}></span>
              </button>
            </div>
          </div>
          
          {/* Подтверждение пароля */}
          <div className="input-group">
            <label>ПОДТВЕРЖДЕНИЕ ПАРОЛЯ</label>
            <div className="input-with-icon">
              <span className="input-icon lock-icon"></span>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Подтвердите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={toggleConfirmPasswordVisibility}
              >
                <span className={`eye-icon ${showConfirmPassword ? 'eye-open' : 'eye-closed'}`}></span>
              </button>
            </div>
          </div>
          
          <button type="submit" className="login-button">
            ЗАРЕГИСТРИРОВАТЬСЯ
          </button>
        </form>
        
        <div className="login-divider">
          <div className="login-divider-line"></div>
          <span className="login-divider-text">или</span>
          <div className="login-divider-line"></div>
        </div>
        
        <div className="register-link">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;