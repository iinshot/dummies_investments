// src/services/api.js
const API_BASE_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('access_token');
  
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }
  
  let response = await fetch(url, options);
  
  if (response.status === 401 && token) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        options.headers['Authorization'] = `Bearer ${token}`;
        return fetch(url, options);
      });
    }
    
    isRefreshing = true;
    
    try {
      const refreshRes = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        localStorage.setItem('access_token', data.access_token);
        options.headers['Authorization'] = `Bearer ${data.access_token}`;
        response = await fetch(url, options);
        processQueue(null, data.access_token);
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('id');
        processQueue(new Error('Refresh failed'), null);
      }
    } catch (e) {
      processQueue(e, null);
    } finally {
      isRefreshing = false;
    }
  }
  
  return response;
};

// Авторизация
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });
    return response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
      credentials: 'include'
    });
    return response.json();
  }
};

// Прогресс статей
export const progressAPI = {
  getAllProgress: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/users/get_total_progress/`);
    if (response.ok) return await response.json();
    return null;
  },

  getArticleProgress: async (articleId) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/users/get_progress/${articleId}`);
    if (response.ok) return response.json();
    return { id_article: articleId, is_read: false, last_checkpoint: 0 };
  },

  setArticleProgress: async (articleId, lastCheckpoint, isRead = false) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/users/set_progress/${articleId}?last_checkpoint=${lastCheckpoint}&is_read=${isRead}`, {
      method: 'POST'
    });
    return response.ok;
  },

  syncLocalProgress: async (localProgress) => {
    for (const [articleId, progress] of Object.entries(localProgress)) {
      await progressAPI.setArticleProgress(parseInt(articleId), progress, progress >= 100);
    }
  }
};

// Викторины
export const quizAPI = {
  getQuizById: async (quizId) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/quizzes/${quizId}`);
    return response.ok ? await response.json() : null;
  }
};

// Вопросы
export const questionsAPI = {
  getQuestionsByArticleId: async (articleId) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/questions/?id_article=${articleId}`);
    return response.ok ? await response.json() : [];
  }
};

// Управление викторинами
export const quizzesAPI = {
  getAllQuizzes: async () => {
    const response = await fetch(`${API_BASE_URL}/quizzes/`);
    return response.ok ? await response.json() : [];
  },

  startQuiz: async (quizId) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/quizzes/start_quiz/${quizId}`, { method: 'POST' });
    return response.ok;
  },

  endQuiz: async (quizId) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/quizzes/end_quiz/${quizId}`, { method: 'POST' });
    return response.ok;
  }
};

// Синхронизация
export const syncService = {
  syncOnRegister: async () => {
    const quizRating = JSON.parse(localStorage.getItem('quizRating') || '{}');
    const payload = JSON.parse(atob(localStorage.getItem('access_token').split('.')[1]));
    const response = await fetchWithAuth(`${API_BASE_URL}/users/${payload.id_user}`, {
      method: 'PUT',
      body: JSON.stringify({ points: quizRating.totalPoints || 0 })
    });
    return response.ok;
  },

  loadOnLogin: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/users/me`);
    if (response.ok) {
      const userData = await response.json();
      if (userData.quiz_rating) {
        const clean = { ...userData.quiz_rating };
        delete clean.total_points;
        localStorage.setItem('quizRating', JSON.stringify(clean));
      }
      return userData;
    }
    return null;
  }
};

// Калькулятор
export const calculatorAPI = {
  calculate: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/calculator/?${queryString}`);
    return response.ok ? await response.json() : null;
  }
};