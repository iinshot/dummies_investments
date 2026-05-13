// src/services/api.js
const API_BASE_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
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
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include'
    });
    return response.ok;
  }
};

// Прогресс статей
export const progressAPI = {
  getAllProgress: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/get_total_progress/`, {
        method: 'GET',
        headers: getHeaders(),
      });
      if (response.ok) return await response.json();
      return null;
    } catch (error) {
      console.error('Ошибка запроса:', error);
      return null;
    }
  },

  getArticleProgress: async (articleId) => {
    const response = await fetch(`${API_BASE_URL}/users/get_progress/${articleId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (response.ok) return response.json();
    return { id_article: articleId, is_read: false, last_checkpoint: 0 };
  },

  setArticleProgress: async (articleId, lastCheckpoint, isRead = false) => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    
    const response = await fetch(`${API_BASE_URL}/users/set_progress/${articleId}?last_checkpoint=${lastCheckpoint}&is_read=${isRead}`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return response.ok;
  },

  syncLocalProgress: async (localProgress) => {
    const promises = [];
    for (const [articleId, progress] of Object.entries(localProgress)) {
      const isRead = progress >= 100;
      promises.push(progressAPI.setArticleProgress(parseInt(articleId), progress, isRead));
    }
    await Promise.all(promises);
  }
};

// Викторины
export const quizAPI = {
  getQuizById: async (quizId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`, { headers: getHeaders() });
      if (response.ok) return await response.json();
      return null;
    } catch (error) { return null; }
  },

  getQuestionsByQuizId: async (quizId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}/questions`, { headers: getHeaders() });
      if (response.ok) return await response.json();
      return [];
    } catch (error) { return []; }
  },

  getAnswersByQuestionId: async (questionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/answers/?id_question=${questionId}`, { headers: getHeaders() });
      if (response.ok) return await response.json();
      return [];
    } catch (error) { return []; }
  }
};

// Вопросы
export const questionsAPI = {
  getQuestionsByArticleId: async (articleId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/?id_article=${articleId}`, { headers: getHeaders() });
      if (response.ok) return await response.json();
      return [];
    } catch (error) { return []; }
  },

  getAnswersByQuestionId: async (questionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/answers/?id_question=${questionId}`, { headers: getHeaders() });
      if (response.ok) return await response.json();
      return [];
    } catch (error) { return []; }
  },


getFullQuizForArticle: async (articleId) => {
  try {
    const qRes = await fetch(`${API_BASE_URL}/questions/?id_article=${articleId}`, { headers: getHeaders() });
    const questions = qRes.ok ? await qRes.json() : [];
    
    if (!questions.length) return null;
    
    const questionsWithAnswers = await Promise.all(
      questions.map(async (q) => {
        const aRes = await fetch(`${API_BASE_URL}/answers/?id_question=${q.id_question}`, { headers: getHeaders() });
        const answers = aRes.ok ? await aRes.json() : [];
        
        return {
          id: q.id_question,
          text: q.question_text,
          subtext: q.question_type === 'RADIO' ? '(выберите один вариант)' : '(выберите все верные)',
          options: answers.map(a => ({
            id: a.id_answer,
            text: a.answer_text,
            isCorrect: a.is_correct
          }))
        };
      })
    );
    
    return { totalQuestions: questionsWithAnswers.length, questions: questionsWithAnswers };
  } catch (error) {
    console.error('Ошибка:', error);
    return null;
  }
}
};

// Управление викторинами
export const quizzesAPI = {
  getAllQuizzes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/`, { headers: { 'Content-Type': 'application/json' } });
      if (response.ok) return await response.json();
      return [];
    } catch (error) { return []; }
  },

  startQuiz: async (quizId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/start_quiz/${quizId}`, {
        method: 'POST', headers: getHeaders()
      });
      if (response.ok) return await response.json();
      return null;
    } catch (error) { return null; }
  },

  answerQuestion: async (quizId, answerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/answer_question/${quizId}/${answerId}`, {
        method: 'POST', headers: getHeaders()
      });
      return response.ok;
    } catch (error) { return false; }
  },

  getNextQuestion: async (quizId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/get_next_question/${quizId}`, { headers: getHeaders() });
      if (response.ok) return await response.json();
      return null;
    } catch (error) { return null; }
  },

  endQuiz: async (quizId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/end_quiz/${quizId}`, {
        method: 'POST', headers: getHeaders()
      });
      if (response.ok) return await response.json();
      return null;
    } catch (error) { return null; }
  }
};

// Синхронизация
export const syncService = {
  syncOnRegister: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    const quizRating = JSON.parse(localStorage.getItem('quizRating') || '{}');
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id_user;
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT', headers: getHeaders(),
        body: JSON.stringify({ points: quizRating.totalPoints || 0, quiz_rating: quizRating })
      });
      return response.ok;
    } catch (error) { return false; }
  },

  loadOnLogin: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, { headers: getHeaders() });
      if (response.ok) {
        const userData = await response.json();
        if (userData.quiz_rating) {
          localStorage.setItem('quizRating', JSON.stringify(userData.quiz_rating));
        }
        return userData;
      }
      return null;
    } catch (error) { return null; }
  }
};

// Калькулятор
export const calculatorAPI = {
  calculate: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    
    try {
      const response = await fetch(`${API_BASE_URL}/calculator/?${queryString}`, {
        method: 'GET',
        // БЕЗ getHeaders() — калькулятор доступен всем
      });
      
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Ошибка расчета:', error);
      return null;
    }
  }
};