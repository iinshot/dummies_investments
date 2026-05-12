// src/services/api.js
const API_BASE_URL = '/api';

// Общие заголовки
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
  // Получить прогресс по всем статьям
// В services/api.js внутри getAllProgress:
getAllProgress: async () => {
  const token = localStorage.getItem('access_token');
  console.log('🔑 getAllProgress - Токен:', token ? 'Есть' : 'Нет');
  
  if (!token) return null;
  
  try {
    console.log('📡 Отправляем запрос к /users/get_total_progress/');
    const response = await fetch(`${API_BASE_URL}/users/get_total_progress/`, {
      method: 'GET',
      headers: getHeaders(),
    });
    console.log('📡 Статус ответа:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('📦 Полученные данные:', data);
      return data;
    }
    console.error('❌ Ошибка ответа:', response.status);
    return null;
  } catch (error) {
    console.error('❌ Ошибка запроса:', error);
    return null;
  }
},

  // Получить прогресс конкретной статьи
  getArticleProgress: async (articleId) => {
    const response = await fetch(`${API_BASE_URL}/users/get_progress/${articleId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (response.ok) {
      return response.json();
    }
    return { id_article: articleId, is_read: false, last_checkpoint: 0 };
  },

  // Установить прогресс статьи
  setArticleProgress: async (articleId, lastCheckpoint, isRead = false) => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    
    const response = await fetch(`${API_BASE_URL}/users/set_progress/${articleId}?last_checkpoint=${lastCheckpoint}&is_read=${isRead}`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return response.ok;
  },

  // Синхронизировать локальный прогресс с сервером
  syncLocalProgress: async (localProgress) => {
    const promises = [];
    for (const [articleId, progress] of Object.entries(localProgress)) {
      const isRead = progress >= 100;
      promises.push(
        progressAPI.setArticleProgress(parseInt(articleId), progress, isRead)
      );
    }
    await Promise.all(promises);
  }
};

// В services/api.js добавьте или обновите:

export const quizAPI = {
  // Получить викторину по ID
  getQuizById: async (quizId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`, {  // ← /quizzes/
        headers: getHeaders(),
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Ошибка загрузки викторины:', error);
      return null;
    }
  },

  // Получить все вопросы для викторины
  getQuestionsByQuizId: async (quizId) => {
    try {
      // ВАЖНО: используем /quizzes/ (две z), а не /quizes/
      const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}/questions`, {
        headers: getHeaders(),
      });
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('Ошибка загрузки вопросов:', error);
      return [];
    }
  },

  // Получить все ответы для вопроса
  getAnswersByQuestionId: async (questionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/answers/?id_question=${questionId}`, {
        headers: getHeaders(),
      });
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('Ошибка загрузки ответов:', error);
      return [];
    }
  },

  // Получить полную викторину с вопросами и ответами
  getFullQuiz: async (quizId) => {
    try {
      const questions = await quizAPI.getQuestionsByQuizId(quizId);
      
      if (!questions.length) return null;
      
      const questionsWithAnswers = await Promise.all(
        questions.map(async (question) => {
          const answers = await quizAPI.getAnswersByQuestionId(question.id_question);
          return {
            id: question.id_question,
            text: question.question_text,
            subtext: question.question_type === 'RADIO' ? '(выберите один вариант)' : '(выберите все верные)',
            options: answers.map(answer => ({
              id: answer.id_answer,
              text: answer.answer_text,
              isCorrect: answer.is_correct
            }))
          };
        })
      );
      
      return {
        totalQuestions: questionsWithAnswers.length,
        questions: questionsWithAnswers
      };
    } catch (error) {
      console.error('Ошибка загрузки полной викторины:', error);
      return null;
    }
  }
};

// В services/api.js, исправьте questionsAPI:

export const questionsAPI = {
  // Получить все вопросы для статьи
  getQuestionsByArticleId: async (articleId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/?id_article=${articleId}`, {
        headers: getHeaders(),
      });
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('Ошибка загрузки вопросов:', error);
      return [];
    }
  },

  // Получить все ответы для конкретного вопроса
  getAnswersByQuestionId: async (questionId) => {
    try {
      // ВАЖНО: фильтруем ответы по id_question
      const response = await fetch(`${API_BASE_URL}/answers/?id_question=${questionId}`, {
        headers: getHeaders(),
      });
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error(`Ошибка загрузки ответов для вопроса ${questionId}:`, error);
      return [];
    }
  },

  // Получить полную викторину для статьи
  getFullQuizForArticle: async (articleId) => {
    try {
      // 1. Получаем вопросы для статьи
      const questions = await questionsAPI.getQuestionsByArticleId(articleId);
      
      console.log(`🔍 Найдено вопросов для статьи ${articleId}:`, questions.length);
      
      if (!questions.length) return null;
      
      // 2. Для КАЖДОГО вопроса получаем ТОЛЬКО его ответы
      const questionsWithAnswers = await Promise.all(
        questions.map(async (question) => {
          // Получаем ответы ТОЛЬКО для этого конкретного вопроса
          const answers = await questionsAPI.getAnswersByQuestionId(question.id_question);
          
          console.log(`📝 Вопрос ${question.id_question}: "${question.question_text}" -> ${answers.length} ответов`);
          
          return {
            id: question.id_question,
            text: question.question_text,
            subtext: question.question_type === 'RADIO' ? '(выберите один вариант)' : '(выберите все верные)',
            options: answers.map(answer => ({
              id: answer.id_answer,
              text: answer.answer_text,
              isCorrect: answer.is_correct
            }))
          };
        })
      );
      
      console.log('✅ Итоговая викторина:', questionsWithAnswers);
      
      return {
        totalQuestions: questionsWithAnswers.length,
        questions: questionsWithAnswers
      };
    } catch (error) {
      console.error('Ошибка загрузки полной викторины:', error);
      return null;
    }
  }
};


// В services/api.js, найдите quizzesAPI и замените все /quizes/ на /quizzes/

export const quizzesAPI = {
  // Получить все викторины
  getAllQuizzes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('Ошибка загрузки викторин:', error);
      return [];
    }
  },

  // Получить викторину по ID
  getQuizById: async (quizId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`, {  // ← ИСПРАВЛЕНО
        headers: getHeaders(),
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Ошибка загрузки викторины:', error);
      return null;
    }
  },

  // Начать викторину
  startQuiz: async (quizId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/start_quiz/${quizId}`, {  // ← ИСПРАВЛЕНО
        method: 'POST',
        headers: getHeaders(),
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Ошибка начала викторины:', error);
      return null;
    }
  },

  // Ответить на вопрос
  answerQuestion: async (quizId, answerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/answer_question/${quizId}/${answerId}`, {  // ← ИСПРАВЛЕНО
        method: 'POST',
        headers: getHeaders(),
      });
      return response.ok;
    } catch (error) {
      console.error('Ошибка отправки ответа:', error);
      return false;
    }
  },

  // Получить следующий вопрос
  getNextQuestion: async (quizId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/get_next_question/${quizId}`, {  // ← ИСПРАВЛЕНО
        headers: getHeaders(),
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Ошибка получения следующего вопроса:', error);
      return null;
    }
  },

  // Завершить викторину
  endQuiz: async (quizId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/end_quiz/${quizId}`, {  // ← ИСПРАВЛЕНО
        method: 'POST',
        headers: getHeaders(),
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Ошибка завершения викторины:', error);
      return null;
    }
  }
};
// services/api.js — ЗАМЕНИТЕ ВСЁ ПОСЛЕ articleQuizAPI на это:

// ============================================================
// СЕРВИС СИНХРОНИЗАЦИИ (оставляем только syncService)
// ============================================================

export const syncService = {
  /**
   * Отправить очки на сервер при регистрации
   */
  syncOnRegister: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    const quizRating = JSON.parse(localStorage.getItem('quizRating') || '{}');

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id_user;

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          points: quizRating.totalPoints || 0
        })
      });

      console.log('✅ Очки отправлены:', quizRating.totalPoints);
      return response.ok;
    } catch (error) {
      console.error('❌ syncOnRegister:', error);
      return false;
    }
  },

  /**
   * Загрузить очки с сервера при логине
   */
  loadOnLogin: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: getHeaders()
      });

      if (response.ok) {
        const userData = await response.json();
        
        const quizRating = {
          totalPoints: userData.points || 0,
          completedQuizzes: 0,
          totalQuizzes: 13,
          quizResults: {},
          quizProgress: {},
          inProgressQuiz: null
        };

        localStorage.setItem('quizRating', JSON.stringify(quizRating));
        console.log('✅ Данные загружены:', quizRating.totalPoints, 'очков');
        return quizRating;
      }
      return null;
    } catch (error) {
      console.error('❌ loadOnLogin:', error);
      return null;
    }
  }
};