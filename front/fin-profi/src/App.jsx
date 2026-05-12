import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/RegisterPage";
import CalculatorPage from './pages/CalculatorPage';
import CircularArticleProgress from './components/CircularArticleProgress';
import ProfilePage from './pages/Profile';
import QuizPage from './pages/QuizPage';
import ArticlePage from './pages/ArticlePage';
import CircularProgress from './components/CircularProgress';
import DynamicDottedLine from './components/DynamicDottedLine';
import Logo from './components/Logo';
import { Calc, Home, Login, Profile, Quiz } from '././assets/icons';
import { progressAPI } from './services/api';


// Компонент главной страницы 
const MainPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [linePath, setLinePath] = useState('');
  const [isContinueVisible, setIsContinueVisible] = useState(true);
  const navigate = useNavigate();

  // ========= МОКОВЫЕ ДАННЫЕ ПРОГРЕССА ПОЛЬЗОВАТЕЛЯ =========
  const [userProgress, setUserProgress] = useState({
    userId: 123,
    completedArticles: [],
    currentArticle: {
      id: 1,
      progress: 0
    }
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  // Делаем функцию доступной глобально для тестирования через консоль
  if (typeof window !== 'undefined') {
    window.updateProgress = (completedIds) => {
      setUserProgress(prev => ({
        ...prev,
        completedArticles: completedIds
      }));
    };
  }

  // Данные статей для каждого модуля с ID
  const articles1Data = [
    { id: 1, number: '1', title: 'Что такое инвестиции?', completed: userProgress.completedArticles.includes(1) },
    { id: 2, number: '2', title: 'Виды активов', completed: userProgress.completedArticles.includes(2) }
  ];

  const articles2Data = [
    { id: 3, number: '3', title: 'Акции', completed: userProgress.completedArticles.includes(3) },
    { id: 4, number: '4', title: 'Облигации', completed: userProgress.completedArticles.includes(4) },
    { id: 5, number: '5', title: 'ETF и фонды', completed: userProgress.completedArticles.includes(5) }
  ];

  const articles3Data = [
    { id: 6, number: '6', title: 'Инвестиционный портфель', completed: userProgress.completedArticles.includes(6) },
    { id: 7, number: '7', title: 'Горизонт инвестирования', completed: userProgress.completedArticles.includes(7) }
  ];

  // Вспомогательная функция для получения названия модуля
const getModuleTitle = (articleId) => {
  if (articleId >= 1 && articleId <= 2) {
    return 'Модуль 1 - Основы инвестиций';
  } else if (articleId >= 3 && articleId <= 5) {
    return 'Модуль 2 - Инвестиционные инструменты';
  } else if (articleId >= 6 && articleId <= 7) {
    return 'Модуль 3 - Принципы инвестирования';
  }
  return 'Модуль 1 - Основы инвестиций';
};

  // Функции для расчета прогресса
  const getModuleStatus = (moduleArticles, completedArticles, currentArticle) => {
    const moduleArticleIds = moduleArticles.map(article => article.id);
    const completedInModule = moduleArticleIds.filter(id => completedArticles.includes(id)).length;
    
    const hasInProgressArticle = currentArticle && 
                                 moduleArticleIds.includes(currentArticle.id) && 
                                 currentArticle.progress > 0;
    
    if (completedInModule === moduleArticleIds.length) return 'Пройден';
    if (completedInModule > 0 || hasInProgressArticle) return 'В процессе';
    return 'Не начат';
  };

  const getReadCount = (moduleArticles, completedArticles) => {
    const moduleArticleIds = moduleArticles.map(article => article.id);
    return moduleArticleIds.filter(id => completedArticles.includes(id)).length;
  };

  const getModuleProgress = (moduleArticles, completedArticles) => {
    const moduleArticleIds = moduleArticles.map(article => article.id);
    const completedCount = moduleArticleIds.filter(id => completedArticles.includes(id)).length;
    return Math.round((completedCount / moduleArticleIds.length) * 100);
  };

  const getArticleProgress = (articleId) => {
    if (userProgress.currentArticle && userProgress.currentArticle.id === articleId) {
      return userProgress.currentArticle.progress;
    }
    if (userProgress.completedArticles.includes(articleId)) {
      return 100;
    }
    return 0;
  };

// Функция для получения текущей статьи (НЕ завершенной)
const getCurrentArticleData = () => {
  const { currentArticle, completedArticles } = userProgress;
  
  // 1. Если есть текущая статья и она не завершена - показываем её
  if (currentArticle && currentArticle.id && !completedArticles.includes(currentArticle.id)) {
    const allArticles = [...articles1Data, ...articles2Data, ...articles3Data];
    const article = allArticles.find(a => a.id === currentArticle.id);
    
    if (article) {
      return {
        title: article.title,
        module: getModuleTitle(currentArticle.id),
        progress: currentArticle.progress,
        id: currentArticle.id
      };
    }
  }
  
  // 2. Ищем первую незавершенную статью
  for (let i = 1; i <= 7; i++) {
    if (!completedArticles.includes(i)) {
      const allArticles = [...articles1Data, ...articles2Data, ...articles3Data];
      const article = allArticles.find(a => a.id === i);
      if (article) {
        // Нашли первую незавершенную статью
        return {
          title: article.title,
          module: getModuleTitle(i),
          progress: 0,
          id: i
        };
      }
    }
  }
  
  // 3. Все статьи пройдены
  return null;
};

// Функция для перехода к следующей статье
const handleContinueClick = () => {
  const currentData = getCurrentArticleData();
  if (currentData && currentData.id) {
    navigate(`/article/${currentData.id}`);
  }
};

// Функция загрузки прогресса с сервера
const loadProgressFromServer = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  
  try {
    const data = await progressAPI.getAllProgress();
    return data;
  } catch (error) {
    console.error('Ошибка загрузки прогресса с сервера:', error);
    return null;
  }
};


  const getArticleProgressForLine = (articleId) => {
    if (!articleId) return 0;
    if (userProgress.completedArticles.includes(articleId)) return 100;
    if (userProgress.currentArticle && userProgress.currentArticle.id === articleId) {
      return userProgress.currentArticle.progress;
    }
    return 0;
  };

  const getArticleStatus = (articleId, completedArticles, currentArticle) => {
    if (completedArticles.includes(articleId)) return 'completed';
    if (currentArticle && currentArticle.id === articleId && currentArticle.progress > 0 && currentArticle.progress < 100) {
      return 'in-progress';
    }
    return 'not-started';
  };

  // Динамические данные модулей
  const moduleData1 = {
    id: 1,
    number: 1,
    title: 'Основы инвестиций',
    description: 'Изучите базовые принципы управления деньгами, бюджетирование и первую финансовую подушку безопасности.',
    status: getModuleStatus(articles1Data, userProgress.completedArticles, userProgress.currentArticle),
    readCount: getReadCount(articles1Data, userProgress.completedArticles),
    totalCount: articles1Data.length,
    progress: getModuleProgress(articles1Data, userProgress.completedArticles)
  };

  const moduleData2 = {
    id: 2,
    number: 2,
    title: 'Инвестиционные инструменты',
    description: 'Как заставить деньги работать: депозиты, облигации, накопления и стратегии.',
    status: getModuleStatus(articles2Data, userProgress.completedArticles, userProgress.currentArticle),
    readCount: getReadCount(articles2Data, userProgress.completedArticles),
    totalCount: articles2Data.length,
    progress: getModuleProgress(articles2Data, userProgress.completedArticles)
  };

  const moduleData3 = {
    id: 3,
    number: 3,
    title: 'Принципы инвестирования',
    description: 'Разбираемся в кредитах, налоговых вычетах и умных займах без переплат.',
    status: getModuleStatus(articles3Data, userProgress.completedArticles, userProgress.currentArticle),
    readCount: getReadCount(articles3Data, userProgress.completedArticles),
    totalCount: articles3Data.length,
    progress: getModuleProgress(articles3Data, userProgress.completedArticles)
  };

  const articles1 = articles1Data;
  const articles2 = articles2Data.map(article => ({
    ...article,
    position: article.id === 3 ? 'left' : (article.id === 4 ? 'right' : 'left')
  }));
  const articles3 = articles3Data;

  // Данные для правой панели
  const modules = [
    {
      id: 1,
      title: 'Модуль 1 - Основы инвестиций',
      articles: articles1.map(a => ({ id: a.id, title: a.title, completed: a.completed }))
    },
    {
      id: 2,
      title: 'Модуль 2 - Инвестиционные инструменты',
      articles: articles2.map(a => ({ id: a.id, title: a.title, completed: a.completed }))
    },
    {
      id: 3,
      title: 'Модуль 3 - Принципы инвестирования',
      articles: articles3.map(a => ({ id: a.id, title: a.title, completed: a.completed }))
    }
  ];

  // Функция проверки, можно ли открыть статью
  const canAccessArticle = (articleId) => {
    if (articleId === 1) return true;
    for (let i = 1; i < articleId; i++) {
      if (!userProgress.completedArticles.includes(i)) {
        return false;
      }
    }
    return true;
  };

const handleArticleClick = (articleId) => {
  if (canAccessArticle(articleId)) {
    navigate(`/article/${articleId}`);
  }
  };

  // Refs
  const firstCircleRef = useRef(null);
  const secondCircleRef = useRef(null);
  const containerRef = useRef(null);
  
  const secondFirstCircleRef = useRef(null);
  const secondSecondCircleRef = useRef(null);
  const secondThirdCircleRef = useRef(null);
  const secondContainerRef = useRef(null);
  const [secondLinePath1, setSecondLinePath1] = useState('');
  const [secondLinePath2, setSecondLinePath2] = useState('');
  
  const thirdFirstCircleRef = useRef(null);
  const thirdSecondCircleRef = useRef(null);
  const thirdContainerRef = useRef(null);
  const [thirdLinePath, setThirdLinePath] = useState('');


  const articleRefs = {
    1: useRef(null),
    2: useRef(null),
    3: useRef(null),
    4: useRef(null),
    5: useRef(null),
    6: useRef(null),
    7: useRef(null)
  };
  
  // ========= ФУНКЦИЯ ПРОКРУТКИ К СТАТЬЕ =========
  const scrollToArticle = (articleId) => {
    const articleRef = articleRefs[articleId];
    if (articleRef && articleRef.current) {
      articleRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };


  const updateLinePath = () => {
    if (firstCircleRef.current && secondCircleRef.current && containerRef.current) {
      const firstRect = firstCircleRef.current.getBoundingClientRect();
      const secondRect = secondCircleRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      
      const startX = firstRect.left + firstRect.width / 2 - containerRect.left;
      const startY = firstRect.top + firstRect.height / 2 - containerRect.top;
      const endX = secondRect.left + secondRect.width / 2 - containerRect.left;
      const endY = secondRect.top + secondRect.height / 2 - containerRect.top;
      
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      const point1X = startX + (midX - startX) * 0.5 + 60;
      const point1Y = startY + (midY - startY) * 0.5 - 40;
      setLinePath(`M ${startX} ${startY} Q ${point1X} ${point1Y} ${midX} ${midY} T ${endX} ${endY}`);
    }
  };

  const updateSecondLinePaths = () => {
    if (secondFirstCircleRef.current && secondSecondCircleRef.current && secondContainerRef.current) {
      const firstRect = secondFirstCircleRef.current.getBoundingClientRect();
      const secondRect = secondSecondCircleRef.current.getBoundingClientRect();
      const containerRect = secondContainerRef.current.getBoundingClientRect();
      
      const startX = firstRect.left + firstRect.width / 2 - containerRect.left;
      const startY = firstRect.top + firstRect.height / 2 - containerRect.top;
      const endX = secondRect.left + secondRect.width / 2 - containerRect.left;
      const endY = secondRect.top + secondRect.height / 2 - containerRect.top;
      
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      const point1X = startX + (midX - startX) * 0.5 + 80;
      const point1Y = startY + (midY - startY) * 0.5 - 30;
      setSecondLinePath1(`M ${startX} ${startY} Q ${point1X} ${point1Y} ${midX} ${midY} T ${endX} ${endY}`);
    }
    
    if (secondSecondCircleRef.current && secondThirdCircleRef.current && secondContainerRef.current) {
      const secondRect = secondSecondCircleRef.current.getBoundingClientRect();
      const thirdRect = secondThirdCircleRef.current.getBoundingClientRect();
      const containerRect = secondContainerRef.current.getBoundingClientRect();
      
      const startX = secondRect.left + secondRect.width / 2 - containerRect.left;
      const standardStartY = secondRect.top + secondRect.height / 2 - containerRect.top;
      const endX = thirdRect.left + thirdRect.width / 2 - containerRect.left;
      const endY = thirdRect.top + thirdRect.height / 2 - containerRect.top;
      
      const offsetY = 25;
      const startY = standardStartY + offsetY;
      
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      const point1X = startX + (midX - startX) * 0.5 - 80;
      const point1Y = startY + (midY - startY) * 0.5 - 30;
      setSecondLinePath2(`M ${startX} ${startY} Q ${point1X} ${point1Y} ${midX} ${midY} T ${endX} ${endY}`);
    }
  };

  const updateThirdLinePath = () => {
    if (thirdFirstCircleRef.current && thirdSecondCircleRef.current && thirdContainerRef.current) {
      const firstRect = thirdFirstCircleRef.current.getBoundingClientRect();
      const secondRect = thirdSecondCircleRef.current.getBoundingClientRect();
      const containerRect = thirdContainerRef.current.getBoundingClientRect();
      
      const startX = firstRect.left + firstRect.width / 2 - containerRect.left;
      const startY = firstRect.top + firstRect.height / 2 - containerRect.top;
      const endX = secondRect.left + secondRect.width / 2 - containerRect.left;
      const endY = secondRect.top + secondRect.height / 2 - containerRect.top;
      
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      const point1X = startX + (midX - startX) * 0.5 + 60;
      const point1Y = startY + (midY - startY) * 0.5 - 40;
      setThirdLinePath(`M ${startX} ${startY} Q ${point1X} ${point1Y} ${midX} ${midY} T ${endX} ${endY}`);
    }
  };

  // Загрузка прогресса из localStorage
// Загрузка прогресса из localStorage и синхронизация с сервером
useEffect(() => {
  const loadProgress = async () => {
    const token = localStorage.getItem('access_token');
    console.log('🔍 Токен авторизации:', token ? 'Есть' : 'Нет');
    
    // 1. Сначала загружаем локальные данные
    const savedProgress = localStorage.getItem('articleProgress');
    let localProgressData = savedProgress ? JSON.parse(savedProgress) : {};
    console.log('📁 Локальные данные:', localProgressData);
    
    let completedArticles = [];
    let currentArticleId = null;
    let currentProgress = 0;
    
    // Парсим локальные данные
    for (let i = 1; i <= 7; i++) {
      const progress = localProgressData[i];
      if (progress >= 100) {
        completedArticles.push(i);
      } else if (progress > 0 && progress < 100) {
        currentArticleId = i;
        currentProgress = progress;
      }
    }
    
    // Если пользователь авторизован - загружаем данные с сервера
    if (token) {
      try {
        console.log('🔄 Загружаем прогресс с сервера...');
        const serverData = await progressAPI.getAllProgress();
        console.log('📦 Данные с сервера:', serverData);
        
        // Парсим серверные данные
        const serverProgress = {};
        if (serverData && serverData.articles && serverData.articles[0]) {
          serverData.articles[0].forEach(article => {
            if (article.is_read) {
              serverProgress[article.id_article] = 100;
            } else if (article.last_checkpoint > 0) {
              serverProgress[article.id_article] = article.last_checkpoint;
            }
          });
        }
        console.log('📊 Распарсенный серверный прогресс:', serverProgress);
        
        // СЕРВЕРНЫЕ ДАННЫЕ ИМЕЮТ ПРИОРИТЕТ (перекрывают локальные)
        const mergedProgress = { ...localProgressData, ...serverProgress };
        console.log('🔄 Объединенный прогресс (сервер приоритетнее):', mergedProgress);
        
        // Сохраняем объединенные данные в localStorage
        localStorage.setItem('articleProgress', JSON.stringify(mergedProgress));
        
        // Пересчитываем прогресс на основе объединенных данных
        completedArticles = [];
        currentArticleId = null;
        currentProgress = 0;
        
        for (let i = 1; i <= 7; i++) {
          const progress = mergedProgress[i];
          if (progress >= 100) {
            completedArticles.push(i);
          } else if (progress > 0 && progress < 100) {
            // Берем первую незавершенную статью как текущую
            if (currentArticleId === null) {
              currentArticleId = i;
              currentProgress = progress;
            }
          }
        }
        
        // Если нет текущей статьи (все пройдены), ищем первую непройденную
        if (currentArticleId === null) {
          for (let i = 1; i <= 7; i++) {
            if (!completedArticles.includes(i)) {
              currentArticleId = i;
              currentProgress = 0;
              break;
            }
          }
        }
        
      } catch (error) {
        console.error('❌ Ошибка загрузки прогресса с сервера:', error);
        // В случае ошибки используем только локальные данные
      }
    } else {
      // Если пользователь не авторизован, ищем первую незавершенную статью
      if (currentArticleId === null) {
        for (let i = 1; i <= 7; i++) {
          if (!completedArticles.includes(i)) {
            currentArticleId = i;
            currentProgress = 0;
            break;
          }
        }
      }
    }
    
    // Устанавливаем состояние
    setUserProgress({
      userId: 123,
      completedArticles: completedArticles,
      currentArticle: {
        id: currentArticleId || 1,
        progress: currentProgress || 0
      }
    });
    
    console.log('✅ Итоговый прогресс:', {
      completedArticles,
      currentArticle: currentArticleId,
      currentProgress
    });
  };
  
  loadProgress();
  
  // Слушаем фокус окна для обновления при возврате
  const handleFocus = () => {
    loadProgress();
  };
  
  window.addEventListener('focus', handleFocus);
  return () => {
    window.removeEventListener('focus', handleFocus);
  };
}, []);

// Загружаем прогресс при монтировании и при смене авторизации
useEffect(() => {
  const initProgress = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      await syncProgressWithServer();
    } else {
      const savedProgress = localStorage.getItem('articleProgress');
      if (savedProgress) {
        const progressData = JSON.parse(savedProgress);
        const completedArticles = [];
        let lastArticleId = null;
        let lastProgress = 0;
        
        for (let i = 1; i <= 7; i++) {
          const progress = progressData[i];
          if (progress >= 100) {
            completedArticles.push(i);
          } else if (progress > 0 && progress < 100) {
            lastArticleId = i;
            lastProgress = progress;
          }
        }
        
        setUserProgress({
          userId: 123,
          completedArticles: completedArticles,
          currentArticle: {
            id: lastArticleId || 1,
            progress: lastProgress || 0
          }
        });
      }
    }
  };
  
  initProgress();
}, []);

// Обработчик обновления прогресса
useEffect(() => {
  const handleProgressUpdate = async (event) => {
    const { articleId, progress } = event.detail;
    
    // Сохраняем в localStorage
    const savedProgress = localStorage.getItem('articleProgress') || '{}';
    const progressData = JSON.parse(savedProgress);
    progressData[articleId] = progress;
    localStorage.setItem('articleProgress', JSON.stringify(progressData));
    
    // Отправляем на сервер, если пользователь авторизован
    await saveProgressToServer(articleId, progress);
    
    // Обновляем состояние
    if (progress >= 100) {
      setUserProgress(prev => {
        if (prev.completedArticles.includes(articleId)) return prev;
        
        const newCompleted = [...prev.completedArticles, articleId];
        let nextArticleId = null;
        
        for (let i = articleId + 1; i <= 7; i++) {
          if (!newCompleted.includes(i)) {
            nextArticleId = i;
            break;
          }
        }
        
        return {
          ...prev,
          completedArticles: newCompleted,
          currentArticle: nextArticleId ? { id: nextArticleId, progress: 0 } : { id: null, progress: 0 }
        };
      });
    } else {
      setUserProgress(prev => {
        if (prev.currentArticle.id === articleId) {
          return {
            ...prev,
            currentArticle: { id: articleId, progress: progress }
          };
        }
        return prev;
      });
    }
  };
  
  window.addEventListener('articleProgressUpdate', handleProgressUpdate);
  return () => window.removeEventListener('articleProgressUpdate', handleProgressUpdate);
}, []);

 useEffect(() => {
    const handleResetProgress = () => {
      console.log('🔄 Сброс прогресса при выходе');
      setUserProgress({
        userId: 123,
        completedArticles: [],
        currentArticle: {
          id: 1,
          progress: 0
        }
      });
    };
    
    window.addEventListener('resetProgress', handleResetProgress);
    return () => window.removeEventListener('resetProgress', handleResetProgress);
  }, []);

  useEffect(() => {
    updateLinePath();
    updateSecondLinePaths();
    updateThirdLinePath();
    window.addEventListener('resize', () => {
      updateLinePath();
      updateSecondLinePaths();
      updateThirdLinePath();
    });
    setTimeout(() => {
      updateLinePath();
      updateSecondLinePaths();
      updateThirdLinePath();
    }, 100);
    
    return () => window.removeEventListener('resize', () => {
      updateLinePath();
      updateSecondLinePaths();
      updateThirdLinePath();
    });
  }, [userProgress]);
useEffect(() => {
    const handleProgressSync = (event) => {
      const syncedProgress = event.detail;
      console.log('🔄 Получены синхронизированные данные:', syncedProgress);
      
      // Обновляем состояние на основе синхронизированных данных
      const completedArticles = [];
      let currentArticleId = null;
      let currentProgress = 0;
      
      for (let i = 1; i <= 7; i++) {
        const progress = syncedProgress[i];
        if (progress >= 100) {
          completedArticles.push(i);
        } else if (progress > 0 && progress < 100) {
          if (currentArticleId === null) {
            currentArticleId = i;
            currentProgress = progress;
          }
        }
      }
      
      // Если нет текущей статьи, находим первую непройденную
      if (currentArticleId === null) {
        for (let i = 1; i <= 7; i++) {
          if (!completedArticles.includes(i)) {
            currentArticleId = i;
            currentProgress = 0;
            break;
          }
        }
      }
      
      setUserProgress({
        userId: 123,
        completedArticles: completedArticles,
        currentArticle: {
          id: currentArticleId || 1,
          progress: currentProgress || 0
        }
      });
    };
    
    window.addEventListener('progressSyncCompleted', handleProgressSync);
    return () => window.removeEventListener('progressSyncCompleted', handleProgressSync);
  }, []);

  const handleCloseContinue = () => {
    setIsContinueVisible(false);
  };

  const getStatusBadgeClass = (moduleStatus) => {
    switch(moduleStatus) {
      case 'Пройден': return 'status-badge completed';
      case 'В процессе': return 'status-badge progress';
      default: return 'status-badge not-started';
    }
  };

  const filteredModules = modules.map(module => ({
    ...module,
    articles: module.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(module => module.articles.length > 0);

  const ProgressIndicator = ({ readCount, totalCount, progress, moduleStatus }) => (
    <div className="progress-indicator">
      <div className="progress-text">{readCount} из {totalCount} прочитано</div>
      <div className="progress-bar-wrapper">
        <div className="progress-bar-line">
          <div 
            className={`progress-bar-fill-yellow ${moduleStatus === 'Не начат' ? 'inactive' : ''}`} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

const ModuleCardWithThree = ({ moduleData, articles, containerRefPass, circleRefs, progress1, progress2, articleRefs }) => (
  <div className="module-card" id={`module-${moduleData.number}`}>
    <div className="module-header-wrapper">
      <div className="module-info">
        <div className="module-header-row">
          <div className="module-meta">
            <span className="module-number">МОДУЛЬ {moduleData.number}</span>
            <div className={getStatusBadgeClass(moduleData.status)}>
              <span className="status-text">{moduleData.status}</span>
            </div>
          </div>
        </div>
        <h2 className="module-title">{moduleData.title}</h2>
        <p className="module-description">{moduleData.description}</p>
      </div>
      <ProgressIndicator 
        readCount={moduleData.readCount} 
        totalCount={moduleData.totalCount} 
        progress={moduleData.progress}
        moduleStatus={moduleData.status}
      />
    </div>
    <div className="module-divider"></div>

    <div className="articles-path-three" ref={containerRefPass}>
      <svg className="curved-connector-three" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <DynamicDottedLine
          startRef={circleRefs.first}
          endRef={circleRefs.second}
          progress={progress1 || 0}
          containerRef={containerRefPass}
          strokeColor="#F0F036"
          strokeWidth={4}
          reverse={false}
        />
        <DynamicDottedLine
          startRef={circleRefs.second}
          endRef={circleRefs.third}
          progress={progress2 || 0}
          containerRef={containerRefPass}
          strokeColor="#F0F036"
          strokeWidth={4}
          reverse={true}
        />
      </svg>
      
      {/* ПЕРВЫЙ КРУЖОК */}
      <div 
        className="article-node-three article-node-left"
        ref={articleRefs?.[articles[0]?.id]}
        onClick={() => handleArticleClick(articles[0].id)}
        style={{ cursor: 'pointer' }}
      >
        <div className="article-circle-wrapper">
          <div className="hover-bg"></div>
          <CircularArticleProgress 
            ref={circleRefs.first}
            progress={getArticleProgress(articles[0].id)}
            size={120}
            strokeWidth={5}
            number={articles[0].number}
          />
          <div className="article-label">{articles[0].title}</div>
          <div 
            className="play-overlay"
            onClick={(e) => {
              e.stopPropagation();
              handleArticleClick(articles[0].id);
            }}
          >
            <div className="play-small-triangle"></div>
          </div>
        </div>
      </div>

      {/* ВТОРОЙ КРУЖОК */}
      <div 
        className="article-node-three article-node-right"
        ref={articleRefs?.[articles[1]?.id]}
        onClick={() => handleArticleClick(articles[1].id)}
        style={{ cursor: 'pointer' }}
      >
        <div className="article-circle-wrapper">
          <div className="hover-bg"></div>
          <CircularArticleProgress 
            ref={circleRefs.second}
            progress={getArticleProgress(articles[1].id)}
            size={120}
            strokeWidth={5}
            number={articles[1].number}
          />
          <div className="article-label">{articles[1].title}</div>
          <div 
            className="play-overlay"
            onClick={(e) => {
              e.stopPropagation();
              handleArticleClick(articles[1].id);
            }}
          >
            <div className="play-small-triangle"></div>
          </div>
        </div>
      </div>

      {/* ТРЕТИЙ КРУЖОК */}
      <div 
        className="article-node-three article-node-left-bottom"
        ref={articleRefs?.[articles[2]?.id]}
        onClick={() => handleArticleClick(articles[2].id)}
        style={{ cursor: 'pointer' }}
      >
        <div className="article-circle-wrapper">
          <div className="hover-bg"></div>
          <CircularArticleProgress 
            ref={circleRefs.third}
            progress={getArticleProgress(articles[2].id)}
            size={120}
            strokeWidth={5}
            number={articles[2].number}
          />
          <div className="article-label">{articles[2].title}</div>
          <div 
            className="play-overlay"
            onClick={(e) => {
              e.stopPropagation();
              handleArticleClick(articles[2].id);
            }}
          >
            <div className="play-small-triangle"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ModuleCardWithTwo = ({ moduleData, articles, containerRefPass, circleRefs, linePathProp, progress1, progress2, articleRefs }) => (
  <div className="module-card" id={`module-${moduleData.number}`}>
    <div className="module-header-wrapper">
      <div className="module-info">
        <div className="module-header-row">
          <div className="module-meta">
            <span className="module-number">МОДУЛЬ {moduleData.number}</span>
            <div className={getStatusBadgeClass(moduleData.status)}>
              <span className="status-text">{moduleData.status}</span>
            </div>
          </div>
        </div>
        <h2 className="module-title">{moduleData.title}</h2>
        <p className="module-description">{moduleData.description}</p>
      </div>
      <ProgressIndicator 
        readCount={moduleData.readCount} 
        totalCount={moduleData.totalCount} 
        progress={moduleData.progress}
        moduleStatus={moduleData.status}
      />
    </div>
    <div className="module-divider"></div>

    <div className="articles-path" ref={containerRefPass}>
      {circleRefs.first && circleRefs.second && (
        <svg className="curved-connector" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <DynamicDottedLine
            startRef={circleRefs.first}
            endRef={circleRefs.second}
            progress={progress2 || 0}
            containerRef={containerRefPass}
            strokeColor="#F0F036"
            strokeWidth={4}
          />
        </svg>
      )}
      
      {/* ПЕРВЫЙ КРУЖОК */}
      <div 
        className="article-node article-node-first"
        ref={articleRefs?.[articles[0]?.id]}
        onClick={() => handleArticleClick(articles[0].id)}
        style={{ cursor: 'pointer' }}
      >
        <div className="article-circle-wrapper">
          <div className="hover-bg"></div>
          {articles[0].completed ? (
            <div 
              className="article-circle completed" 
              ref={circleRefs?.first}
            >
              <span className="article-number-circle">{articles[0].number}</span>
            </div>
          ) : (
            <CircularArticleProgress 
              ref={circleRefs?.first}
              progress={getArticleProgress(articles[0].id)}
              size={120}
              strokeWidth={5}
              number={articles[0].number}
            />
          )}
          <div className="article-label">{articles[0].title}</div>
          <div 
            className="play-overlay"
            onClick={(e) => {
              e.stopPropagation();
              handleArticleClick(articles[0].id);
            }}
          >
            <div className="play-small-triangle"></div>
          </div>
        </div>
      </div>

      {/* ВТОРОЙ КРУЖОК */}
      <div 
        className="article-node article-node-second"
        ref={articleRefs?.[articles[1]?.id]}
        onClick={() => handleArticleClick(articles[1].id)}
        style={{ cursor: 'pointer' }}
      >
        <div className="article-circle-wrapper">
          <div className="hover-bg"></div>
          {articles[1].completed ? (
            <div 
              className="article-circle completed" 
              ref={circleRefs?.second}
            >
              <span className="article-number-circle">{articles[1].number}</span>
            </div>
          ) : (
            <CircularArticleProgress 
              ref={circleRefs?.second}
              progress={getArticleProgress(articles[1].id)}
              size={120}
              strokeWidth={5}
              number={articles[1].number}
            />
          )}
          <div className="article-label">{articles[1].title}</div>
          <div 
            className="play-overlay"
            onClick={(e) => {
              e.stopPropagation();
              handleArticleClick(articles[1].id);
            }}
          >
            <div className="play-small-triangle"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

  const currentArticleData = getCurrentArticleData();

  return (
    <>
      <div className="main-content-wrapper">
<ModuleCardWithTwo 
  moduleData={moduleData1} 
  articles={articles1} 
  containerRefPass={containerRef}
  circleRefs={{ first: firstCircleRef, second: secondCircleRef }}
  linePathProp={linePath}
  progress1={0}
  progress2={getArticleProgressForLine(articles1[1]?.id)}
  articleRefs={articleRefs}
/>

<ModuleCardWithThree 
  moduleData={moduleData2} 
  articles={articles2}
  containerRefPass={secondContainerRef}
  circleRefs={{ first: secondFirstCircleRef, second: secondSecondCircleRef, third: secondThirdCircleRef }}
  linePaths={{ path1: secondLinePath1, path2: secondLinePath2 }}
  progress1={getArticleProgressForLine(articles2[1]?.id)}
  progress2={getArticleProgressForLine(articles2[2]?.id)}
  articleRefs={articleRefs}
/>

<ModuleCardWithTwo 
  moduleData={moduleData3} 
  articles={articles3} 
  containerRefPass={thirdContainerRef}
  circleRefs={{ first: thirdFirstCircleRef, second: thirdSecondCircleRef }}
  linePathProp={thirdLinePath}
  progress1={0}
  progress2={getArticleProgressForLine(articles3[1]?.id)}
  articleRefs={articleRefs}
/>
      </div>

      <div className="right-column">
        <div className="search-block">
          <input 
            type="text" 
            className="search-input"
            placeholder="Поиск статей..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

<aside className={`right-sidebar ${!isContinueVisible ? 'expanded' : ''}`}>
  <div className="articles-section">
    <div className="articles-header">
      <h3 className="articles-title">Список статей</h3>
    </div>
    <div className="modules-list">
      {filteredModules.map(module => (
        <div key={module.id} className="module-group">
          <div className="module-header">
            <span className="module-dot"></span>
            <span className="module-title">{module.title}</span>
          </div>
          <div className="module-articles">
            {module.articles.map(article => {
              const articleStatus = getArticleStatus(article.id, userProgress.completedArticles, userProgress.currentArticle);
              return (
                <div 
                  key={article.id} 
                  className="article-item"
                  onClick={() => scrollToArticle(article.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="article-left">
                    <div className="article-number">{article.id}</div>
                    <div className="article-info">
                      <div className="article-title-text">{article.title}</div>
                    </div>
                  </div>
                  <div className="article-check-container">
                    {articleStatus === 'completed' ? (
                      <div className="article-check completed">
                        <span className="check-icon">✓</span>
                      </div>
                    ) : articleStatus === 'in-progress' ? (
                      <CircularProgress progress={userProgress.currentArticle.progress} size={20} />
                    ) : (
                      <div className="article-check"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  </div>
</aside>

        {currentArticleData && currentArticleData.progress < 100 && (
<div className={`continue-block ${!isContinueVisible ? 'hidden' : ''}`}>
      <div className="continue-close" onClick={handleCloseContinue}>
        <div className="close-icon"></div>
      </div>
      <div className="continue-content">
        <div className="continue-play">
          <div className="play-button">
            <div className="play-triangle"></div>
          </div>
          <span className="continue-label">Продолжить</span>
        </div>
        <div className="continue-article">
          <div className="continue-article-title">{currentArticleData.title}</div>
          <div className="continue-article-module">{currentArticleData.module}</div>
        </div>
        <div className="progress-section">
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${currentArticleData.progress}%` }}></div>
          </div>
          <div className="progress-stats">
            <span className="progress-completed">завершено</span>
            <span className="progress-percent">{currentArticleData.progress}%</span>
          </div>
        </div>
        <button 
          className="continue-button" 
          onClick={() => handleContinueClick()}
        >
          Продолжить <span className="arrow">→</span>
        </button>
      </div>
    </div>
        )}
      </div>
    </>
  );
};

// Анимация страниц
const pageAnimation = {
  initial: { y: "50%", opacity: 0, scale: 0.95 },
  animate: { y: 0, opacity: 1, scale: 1 },
  exit: { y: "-50%", opacity: 0, scale: 0.95, transition: { duration: 0.33, delay: 0.1 } },
  transition: { type: "spring", duration: 0.66, delay: 0.1 }
};

// Основной компонент App с роутингом
const App = () => {
  const [activePage, setActivePage] = useState('Главная');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false); // ← ДОБАВЬТЕ ЭТУ СТРОКУ

  const navigate = useNavigate();
  const location = useLocation();

  const syncProgressWithServer = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('ℹ️ Пользователь не авторизован, синхронизация не требуется');
      return;
    }
    
    setIsSyncing(true);
    
    try {
      // 1. Получаем локальный прогресс
      const savedProgress = localStorage.getItem('articleProgress');
      const localProgress = savedProgress ? JSON.parse(savedProgress) : {};
      console.log('📁 Локальный прогресс:', localProgress);
      
      // 2. Получаем серверный прогресс
      const serverData = await progressAPI.getAllProgress();
      console.log('📦 Серверный прогресс (raw):', serverData);
      
      // 3. Парсим серверный прогресс
      const serverProgress = {};
      let hasServerData = false;
      
      if (serverData && serverData.articles && serverData.articles[0]) {
        hasServerData = serverData.articles[0].length > 0;
        serverData.articles[0].forEach(article => {
          if (article.is_read) {
            serverProgress[article.id_article] = 100;
          } else if (article.last_checkpoint > 0) {
            serverProgress[article.id_article] = article.last_checkpoint;
          }
        });
      }
      console.log('📊 Распарсенный серверный прогресс:', serverProgress);
      console.log('🔍 Есть ли данные на сервере:', hasServerData);
      
      let finalProgress = {};
      
      if (hasServerData && Object.keys(serverProgress).length > 0) {
        console.log('🔄 На сервере есть данные, используем их (приоритет сервера)');
        finalProgress = serverProgress;
        localStorage.setItem('articleProgress', JSON.stringify(finalProgress));
        
      } else if (Object.keys(localProgress).length > 0) {
        console.log('🔄 Сервер пуст, отправляем локальный прогресс на сервер...');
        
        for (const [articleId, progress] of Object.entries(localProgress)) {
          const isRead = progress >= 100;
          await progressAPI.setArticleProgress(parseInt(articleId), progress, isRead);
          console.log(`✅ Статья ${articleId} отправлена на сервер: ${progress}%`);
        }
        finalProgress = localProgress;
        
      } else {
        console.log('ℹ️ Нет данных ни на сервере, ни локально, создаем дефолтный прогресс');
        finalProgress = {};
        for (let i = 1; i <= 7; i++) {
          finalProgress[i] = 0;
        }
        localStorage.setItem('articleProgress', JSON.stringify(finalProgress));
      }
      
      // Отправляем событие обновления прогресса
      const event = new CustomEvent('progressSyncCompleted', { detail: finalProgress });
      window.dispatchEvent(event);
      
      console.log('✅ Синхронизация прогресса завершена');
      
    } catch (error) {
      console.error('❌ Ошибка синхронизации:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Проверяем наличие токена при загрузке
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, [location.pathname]);

  // Синхронизация с сервером при загрузке приложения
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      console.log('🔄 Пользователь уже авторизован, синхронизируем прогресс');
      syncProgressWithServer();
    }
  }, []);

  // Слушатель события авторизации
useEffect(() => {
  const handleAuthChange = (event) => {
    setIsAuthenticated(event.detail.isAuthenticated);
    
    if (event.detail.isAuthenticated) {
      console.log('🔐 Пользователь авторизовался, синхронизируем прогресс');
      syncProgressWithServer();
    } else {
      // При выходе очищаем локальный прогресс
      console.log('🚪 Пользователь вышел, очищаем localStorage');
      localStorage.removeItem('articleProgress');
      // Также можно сбросить состояние userProgress в MainPage через событие
      window.dispatchEvent(new CustomEvent('resetProgress'));
    }
  };
  
  window.addEventListener('authChange', handleAuthChange);
  return () => window.removeEventListener('authChange', handleAuthChange);
}, []);

  // Обновление активной страницы
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setActivePage('Главная');
    } else if (path === '/calculator') {
      setActivePage('Калькулятор');
    } else if (path === '/quiz') {
      setActivePage('Викторина');
    } else if (path === '/profile') {
      setActivePage('Профиль');
    } else if (path === '/login' || path === '/register') {
      setActivePage('');
    }
  }, [location.pathname]);

  const handleNavClick = (pageName) => {
    setActivePage(pageName);
    if (pageName === 'Войти' && !isAuthenticated) {
      navigate('/login');
    } else if (pageName === 'Профиль') {
      navigate('/profile');
    } else if (pageName === 'Калькулятор') {
      navigate('/calculator');
    } else if (pageName === 'Викторина') {
      navigate('/quiz');
    } else if (pageName === 'Главная') {
      navigate('/');
    }
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="app-layout">
      <AnimatePresence mode="wait">
        {!isAuthPage && (
          <motion.aside 
            key="sidebar"
            className="sidebar"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5, delay: 0.1 }}
          >
            <div className="project-name">
              <Logo />
            </div>
<div className="nav-menu">
  <button 
    className={`nav-btn ${activePage === 'Главная' ? 'nav-btn-active' : ''}`} 
    onClick={() => handleNavClick('Главная')}
  >
    <Home width={20} height={20} className="nav-icon" />
    <span>Главная</span>
  </button>
  <button 
    className={`nav-btn ${activePage === 'Калькулятор' ? 'nav-btn-active' : ''}`} 
    onClick={() => handleNavClick('Калькулятор')}
  >
    <Calc width={20} height={20} className="nav-icon" />
    <span>Калькулятор</span>
  </button>
  <button 
    className={`nav-btn ${activePage === 'Викторина' ? 'nav-btn-active' : ''}`} 
    onClick={() => handleNavClick('Викторина')}
  >
    <Quiz width={20} height={20} className="nav-icon" />
    <span>Викторина</span>
  </button>
</div>

<div className="nav-footer">
  {isAuthenticated ? (
    <button 
      className={`nav-btn nav-btn-profile ${activePage === 'Профиль' ? 'nav-btn-active' : ''}`}
      onClick={() => handleNavClick('Профиль')}
    >
      <Profile width={20} height={20} className="nav-icon" />
      <span>Профиль</span>
    </button>
  ) : (
    <button 
      className="nav-btn nav-btn-login"
      onClick={() => handleNavClick('Войти')}
    >
      <Login width={20} height={20} className="nav-icon" />
      <span>Войти</span>
    </button>
  )}
</div>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.div
              className="page-content"
              initial={pageAnimation.initial}
              animate={pageAnimation.animate}
              exit={pageAnimation.exit}
              transition={pageAnimation.transition}
              style={{ flex: 1, display: 'flex', width: '100%' }}
            >
              <MainPage />
            </motion.div>
          } />
          <Route path="/login" element={
            <motion.div
              className="page-content"
              initial={pageAnimation.initial}
              animate={pageAnimation.animate}
              exit={pageAnimation.exit}
              transition={pageAnimation.transition}
              style={{ flex: 1, display: 'flex', width: '100%' }}
            >
              <LoginPage />
            </motion.div>
          } />
          <Route path="/register" element={
            <motion.div
              className="page-content"
              initial={pageAnimation.initial}
              animate={pageAnimation.animate}
              exit={pageAnimation.exit}
              transition={pageAnimation.transition}
              style={{ flex: 1, display: 'flex', width: '100%' }}
            >
              <RegisterPage />
            </motion.div>
          } />
          <Route path="/profile" element={
  <motion.div
    className="page-content"
    initial={pageAnimation.initial}
    animate={pageAnimation.animate}
    exit={pageAnimation.exit}
    transition={pageAnimation.transition}
    style={{ flex: 1, display: 'flex', width: '100%' }}
  >
    <ProfilePage />
  </motion.div>
} />
          <Route path="/calculator" element={
            <motion.div
              className="page-content"
              initial={pageAnimation.initial}
              animate={pageAnimation.animate}
              exit={pageAnimation.exit}
              transition={pageAnimation.transition}
              style={{ flex: 1, display: 'flex', width: '100%' }}
            >
              <CalculatorPage />
            </motion.div>
          } />
          <Route path="/quiz" element={
            <motion.div
              className="page-content"
              initial={pageAnimation.initial}
              animate={pageAnimation.animate}
              exit={pageAnimation.exit}
              transition={pageAnimation.transition}
              style={{ flex: 1, display: 'flex', width: '100%' }}
            >
              <QuizPage />
            </motion.div>
          } />
          <Route path="/article/:id" element={
            <motion.div
              className="page-content"
              initial={pageAnimation.initial}
              animate={pageAnimation.animate}
              exit={pageAnimation.exit}
              transition={pageAnimation.transition}
              style={{ flex: 1, display: 'flex', width: '100%' }}
            >
              <ArticlePage />
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

// Обертка с Router
const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;