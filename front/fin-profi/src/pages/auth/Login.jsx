import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IconUserFilled,
  IconLockFilled,
  IconMailFilled,
  IconEye,
  IconEyeOff,
  IconArrowLeft
} from '@tabler/icons-react';
import './Login.css';
import Logo from "../../components/Logo";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
const API_BASE_URL = '/api';

  // Функция для сохранения токенов
  const saveTokens = (accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  };

  // Функция для очистки ошибки через 3 секунды
  const clearError = () => {
    setTimeout(() => setError(''), 3000);
  };

  // Обработчик входа
const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: login, password: password }),
      credentials: 'include'
    });

    const data = await response.json();

    if (response.ok) {
      saveTokens(data.access_token, data.refresh_token);
      
      // 🔥 Ставим флаг "только что вошли"
      sessionStorage.setItem('justLoggedIn', 'true');
      
      window.dispatchEvent(new CustomEvent('authChange', { detail: { isAuthenticated: true } }));
      navigate('/');
    } else {
      setError(data.detail || 'Ошибка входа. Проверьте email и пароль');
      clearError();
    }
  } catch (err) {
    setError('Не удалось подключиться к серверу. Попробуйте позже.');
    clearError();
  } finally {
    setIsLoading(false);
  }
};


  // Обработчик регистрации
const handleRegister = async (e) => {
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
      // QuizPage увидит его и отправит локальные данные на сервер
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin(e);
    } else {
      handleRegister(e);
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

  const switchToRegister = () => {
    setIsLogin(false);
    setError('');
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setError('');
  };

  return (
    <div className="login-fullscreen">
      <div className={`login-container ${!isLogin ? 'register-mode' : ''}`}>
        {/* Кнопка назад */}
        <button className="login-back-button" onClick={handleGoBack}>
          <IconArrowLeft size={24} strokeWidth={2} color="#1a1a1a" />
        </button>
        
        {/* Логотип */}
        <div className="login-logo-wrapper">
          <Logo />
        </div>
        
        <div className="login-divider-line-thin"></div>
        
        <div className="auth-header">
          <h2 className={`auth-title ${isLogin ? 'active' : ''}`}>Вход в систему</h2>
          <h2 className={`auth-title ${!isLogin ? 'active' : ''}`}>Регистрация</h2>
        </div>
        
        <p className={`welcome-message ${isLogin ? 'visible' : ''}`}>
          Добро пожаловать обратно! Введите свои данные.
        </p>
        
        <p className={`register-subtitle ${!isLogin ? 'visible' : ''}`}>
          Создайте аккаунт, чтобы сохранить прогресс
        </p>

        {/* Отображение ошибки */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Форма входа */}
          <div className={`form-login ${isLogin ? 'active' : ''}`}>
            <div className="input-group">
              <label>ЛОГИН ИЛИ EMAIL</label>
              <div className="input-with-icon">
                <IconUserFilled size={20} color="#999999" />
                <input 
                  type="text" 
                  placeholder="Введите логин или email"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required={isLogin}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          
          {/* Форма регистрации */}
          <div className={`form-register ${!isLogin ? 'active' : ''}`}>
            <div className="input-group">
              <label>ИМЯ ПОЛЬЗОВАТЕЛЯ</label>
              <div className="input-with-icon">
                <IconUserFilled size={20} color="#999999" />
                <input 
                  type="text" 
                  placeholder="Введите имя пользователя"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={!isLogin}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="input-group">
              <label>EMAIL</label>
              <div className="input-with-icon">
                <IconMailFilled size={20} color="#999999" />
                <input 
                  type="email" 
                  placeholder="Введите email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={!isLogin}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          
          {/* Поле пароля */}
          <div className="input-group">
            <label>ПАРОЛЬ</label>
            <div className="input-with-icon">
              <IconLockFilled size={20} color="#999999" />
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
                {showPassword ? <IconEyeOff size={20} color="#999999" /> : <IconEye size={20} color="#999999" />}
              </button>
            </div>
          </div>
          
          {/* Подтверждение пароля */}
          <div className={`confirm-password-group ${!isLogin ? 'visible' : ''}`}>
            <div className="input-group">
              <label>ПОДТВЕРЖДЕНИЕ ПАРОЛЯ</label>
              <div className="input-with-icon">
                <IconLockFilled size={20} color="#999999" />
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Подтвердите пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={!isLogin}
                  disabled={isLoading}
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={toggleConfirmPasswordVisibility}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <IconEyeOff size={20} color="#999999" /> : <IconEye size={20} color="#999999" />}
                </button>
              </div>
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
              isLogin ? 'ВОЙТИ' : 'ЗАРЕГИСТРИРОВАТЬСЯ'
            )}
          </button>
        </form>
        
        <div className="login-divider">
          <div className="login-divider-line"></div>
          <span className="login-divider-text">или</span>
          <div className="login-divider-line"></div>
        </div>
        
        <div className="register-link">
          {isLogin ? (
            <>Нет аккаунта? <button type="button" className="link-button" onClick={switchToRegister}>Зарегистрироваться</button></>
          ) : (
            <>Уже есть аккаунт? <button type="button" className="link-button" onClick={switchToLogin}>Войти</button></>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;