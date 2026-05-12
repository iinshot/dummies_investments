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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

const API_BASE_URL = '/api';

  const saveTokens = (accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  };

  const clearError = () => {
    setTimeout(() => setError(''), 3000);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (password !== confirmPassword) {
    setError('Пароли не совпадают');
    clearError();
    return;
  }

  if (password.length < 6) {
    setError('Пароль должен содержать минимум 6 символов');
    clearError();
    return;
  }

  setIsLoading(true);
  setError('');

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: username,
        email: email,
        password: password,
        phone: null,
        surname: null,
        patronymic: null,
        about: null
      }),
      credentials: 'include'
    });

    const data = await response.json();

    if (response.ok) {
      saveTokens(data.access_token, data.refresh_token);
      console.log('✅ Регистрация выполнена успешно');
      
      // 🔥 Ставим флаг "только что зарегистрировались"
      sessionStorage.setItem('justRegistered', 'true');
      
      window.dispatchEvent(new CustomEvent('authChange', { detail: { isAuthenticated: true } }));
      navigate('/');
    } else {
      setError(data.detail || 'Ошибка регистрации. Попробуйте другой email');
      clearError();
    }
  } catch (err) {
    console.error('Ошибка при регистрации:', err);
    setError('Не удалось подключиться к серверу. Попробуйте позже.');
    clearError();
  } finally {
    setIsLoading(false);
  }
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
        
        {/* Отображение ошибки */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
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
                disabled={isLoading}
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={toggleConfirmPasswordVisibility}
                disabled={isLoading}
              >
                <span className={`eye-icon ${showConfirmPassword ? 'eye-open' : 'eye-closed'}`}></span>
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              'ЗАРЕГИСТРИРОВАТЬСЯ'
            )}
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