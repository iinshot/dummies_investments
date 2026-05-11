// src/services/api.js
const API_BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Получение прогресса по всем статьям пользователя
export const getUserTotalProgress = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/get_total_progress/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch progress');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching total progress:', error);
    return null;
  }
};

// Получение прогресса по конкретной статье
export const getArticleProgress = async (articleId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/get_progress/${articleId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch article progress');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching article ${articleId} progress:`, error);
    return null;
  }
};

// Сохранение прогресса по статье
export const setArticleProgress = async (articleId, last_checkpoint, is_read) => {
  try {
    const body = {};
    if (last_checkpoint !== undefined) body.last_checkpoint = last_checkpoint;
    if (is_read !== undefined) body.is_read = is_read;
    
    const response = await fetch(`${API_BASE_URL}/users/set_progress/${articleId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    
    if (!response.ok) throw new Error('Failed to save progress');
    return await response.json();
  } catch (error) {
    console.error(`Error saving article ${articleId} progress:`, error);
    return null;
  }
};

// Синхронизация локального прогресса с сервером
export const syncLocalProgressToServer = async (localProgress) => {
  const results = [];
  for (const [articleId, progressData] of Object.entries(localProgress)) {
    const is_read = progressData >= 100;
    const result = await setArticleProgress(parseInt(articleId), progressData, is_read);
    results.push({ articleId, success: !!result });
  }
  return results;
};