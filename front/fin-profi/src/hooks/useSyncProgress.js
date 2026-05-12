// hooks/useSyncProgress.js
import { useCallback } from 'react';
import { syncAPI } from '../services/api';

export const useSyncProgress = () => {

  // Отправка локальных данных на бекенд (при регистрации)
  const syncOnRegister = useCallback(async () => {
    const quizRatingStr = localStorage.getItem('quizRating');
    const articleProgressStr = localStorage.getItem('articleProgress');
    
    if (quizRatingStr) {
      const quizRating = JSON.parse(quizRatingStr);
      await syncAPI.syncQuizResults(quizRating);
    }

    if (articleProgressStr) {
      const articleProgress = JSON.parse(articleProgressStr);
      const { progressAPI } = await import('../services/api');
      await progressAPI.syncLocalProgress(articleProgress);
    }
  }, []);

  // Загрузка серверных данных и перезапись localStorage (при логине)
  const loadOnLogin = useCallback(async () => {
    const serverProgress = await syncAPI.getUserProgress();
    
    if (serverProgress) {
      // Полная замена данных викторин
      if (serverProgress.quiz_rating) {
        const quizRating = {
          totalPoints: serverProgress.quiz_rating.total_points || 0,
          completedQuizzes: serverProgress.quiz_rating.completed_quizzes || 0,
          totalQuizzes: 13,
          quizResults: serverProgress.quiz_rating.quiz_results || {},
          quizProgress: serverProgress.quiz_rating.quiz_progress || {},
          inProgressQuiz: serverProgress.quiz_rating.in_progress_quiz || null
        };
        localStorage.setItem('quizRating', JSON.stringify(quizRating));
      }

      // Полная замена данных статей
      if (serverProgress.article_progress) {
        localStorage.setItem('articleProgress', JSON.stringify(serverProgress.article_progress));
      }

      return true;
    }
    return false;
  }, []);

  return { syncOnRegister, loadOnLogin };
};