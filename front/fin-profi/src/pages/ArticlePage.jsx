import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IconArrowLeft, IconCheck } from '@tabler/icons-react';
import CircularProgress from '../components/CircularProgress';
import QuizIcon from '../assets/icons/quiz.svg';
import { setArticleProgress } from '../services/api';
import CheckIcon from '../assets/icons/check.svg';
import {  Рисунок1,Рисунок2,Рисунок3,Рисунок4,Рисунок10,Рисунок11,
    Рисунок12,Рисунок13,Рисунок14,Рисунок15,Рисунок16,Рисунок17,Рисунок18,Рисунок19,Рисунок20,Рисунок21,Рисунок22,Рисунок23,Рисунок24,Рисунок25,Рисунок26,Рисунок30,Рисунок31 } from '../assets/articleimage';


import ArrowRightIcon from '../assets/icons/arrow_right.svg';  
import './ArticleTypography.css';
import './ArticlePage.css';
import ArrowLeftIcon from '../assets/icons/arrow_left.svg'; 
const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);
  const maxProgressRef = useRef(0);
  const sectionRefs = useRef([]);
  const containerRef = useRef(null);
  
  // Состояние для прогресса статей из localStorage
  const [articlesProgress, setArticlesProgress] = useState({});



  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [animateDirection, setAnimateDirection] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [resultsAnimation, setResultsAnimation] = useState(false);
// Добавьте эту функцию после всех useState
const isCurrentArticleCompleted = () => {
  const articleId = parseInt(id);
  const progress = articlesProgress[articleId] || 0;
  return progress >= 100;
};


// ============ ДАННЫЕ ТЕСТОВ ДЛЯ КАЖДОЙ СТАТЬИ ============
const quizzesData = {
  1: { 
    totalQuestions: 4,
    questions: [
      {
        id: 1,
        text: 'Что из перечисленного является компонентом финансовой грамотности?',
        subtext: '(выберите все верные)',
        options: [
          { id: '1-1', text: 'Умение вести учет доходов и расходов', isCorrect: true },
          { id: '1-2', text: 'Понимание принципов кредитования', isCorrect: true },
          { id: '1-3', text: 'Умение быстро тратить деньги', isCorrect: false },
          { id: '1-4', text: 'Способность планировать финансовые цели', isCorrect: true },
        ]
      },
      {
        id: 2,
        text: 'Какой процент россиян имеют высокий уровень финансовой грамотности?',
        subtext: '(выберите один вариант)',
        options: [
          { id: '2-1', text: 'Около 50%', isCorrect: false },
          { id: '2-2', text: 'Около 38%', isCorrect: true },
          { id: '2-3', text: 'Около 70%', isCorrect: false },
          { id: '2-4', text: 'Около 25%', isCorrect: false },
        ]
      },
      {
        id: 3,
        text: 'Что такое финансовая подушка безопасности?',
        subtext: '(выберите один вариант)',
        options: [
          { id: '3-1', text: 'Сумма на кредитной карте', isCorrect: false },
          { id: '3-2', text: 'Накопления на 3-6 месяцев расходов', isCorrect: true },
          { id: '3-3', text: 'Инвестиции в акции', isCorrect: false },
          { id: '3-4', text: 'Страховка автомобиля', isCorrect: false },
        ]
      },
      {
        id: 4,
        text: 'Какие факторы влияют на финансовую грамотность?',
        subtext: '(выберите все верные)',
        options: [
          { id: '4-1', text: 'Семейное воспитание', isCorrect: true },
          { id: '4-2', text: 'Образование', isCorrect: true },
          { id: '4-3', text: 'Место рождения', isCorrect: false },
          { id: '4-4', text: 'Личный опыт', isCorrect: true },
        ]
      }
    ]
  },
  2: { // Статья 2: "Основы бюджетирования"
    totalQuestions: 4,
    questions: [
      {
        id: 1,
        text: 'Что такое бюджет?',
        subtext: '(выберите один вариант)',
        options: [
          { id: '1-1', text: 'План доходов и расходов', isCorrect: true },
          { id: '1-2', text: 'Список желаемых покупок', isCorrect: false },
          { id: '1-3', text: 'Накопления на счете', isCorrect: false },
          { id: '1-4', text: 'Кредитная история', isCorrect: false },
        ]
      },
      {
        id: 2,
        text: 'Согласно правилу 50/30/20, сколько процентов дохода рекомендуется откладывать на сбережения?',
        subtext: '(выберите один вариант)',
        options: [
          { id: '2-1', text: '10%', isCorrect: false },
          { id: '2-2', text: '20%', isCorrect: true },
          { id: '2-3', text: '30%', isCorrect: false },
          { id: '2-4', text: '50%', isCorrect: false },
        ]
      },
      {
        id: 3,
        text: 'Какие инструменты помогают вести семейный бюджет?',
        subtext: '(выберите все верные)',
        options: [
          { id: '3-1', text: 'Мобильные приложения', isCorrect: true },
          { id: '3-2', text: 'Таблицы Excel', isCorrect: true },
          { id: '3-3', text: 'Кредитная карта', isCorrect: false },
          { id: '3-4', text: 'Блокнот и ручка', isCorrect: true },
        ]
      },
      {
        id: 4,
        text: 'Категория "Желания" по правилу 50/30/20 включает:',
        subtext: '(выберите один вариант)',
        options: [
          { id: '4-1', text: 'Коммунальные услуги', isCorrect: false },
          { id: '4-2', text: 'Продукты питания', isCorrect: false },
          { id: '4-3', text: 'Путешествия и развлечения', isCorrect: true },
          { id: '4-4', text: 'Налоги', isCorrect: false },
        ]
      }
    ]
  },
  3: { // Статья 3: "Почему важно инвестировать?"
    totalQuestions: 4,
    questions: [
      {
        id: 1,
        text: 'Что такое сложный процент?',
        subtext: '(выберите один вариант)',
        options: [
          { id: '1-1', text: 'Процент на первоначальную сумму', isCorrect: false },
          { id: '1-2', text: 'Процент на проценты', isCorrect: true },
          { id: '1-3', text: 'Банковская комиссия', isCorrect: false },
          { id: '1-4', text: 'Налог на доход', isCorrect: false },
        ]
      },
      {
        id: 2,
        text: 'Почему важно начинать инвестировать рано?',
        subtext: '(выберите все верные)',
        options: [
          { id: '2-1', text: 'Больше времени для роста капитала', isCorrect: true },
          { id: '2-2', text: 'Эффект сложного процента работает дольше', isCorrect: true },
          { id: '2-3', text: 'Меньше налогов', isCorrect: false },
          { id: '2-4', text: 'Можно инвестировать меньшие суммы', isCorrect: true },
        ]
      },
      {
        id: 3,
        text: 'Какой доход historically приносит фондовый рынок?',
        subtext: '(выберите один вариант)',
        options: [
          { id: '3-1', text: '2-4% годовых', isCorrect: false },
          { id: '3-2', text: '8-12% годовых', isCorrect: true },
          { id: '3-3', text: '15-20% годовых', isCorrect: false },
          { id: '3-4', text: '1-3% годовых', isCorrect: false },
        ]
      },
      {
        id: 4,
        text: 'Что нужно сделать перед началом инвестирования?',
        subtext: '(выберите один вариант)',
        options: [
          { id: '4-1', text: 'Взять кредит', isCorrect: false },
          { id: '4-2', text: 'Создать финансовую подушку', isCorrect: true },
          { id: '4-3', text: 'Купить дорогую вещь', isCorrect: false },
          { id: '4-4', text: 'Уволиться с работы', isCorrect: false },
        ]
      }
    ]
  },
  4: { // Статья 4: "Виды инвестиций"
    totalQuestions: 4,
    questions: [
      {
        id: 1,
        text: 'Что из перечисленного относится к классическим инвестициям?',
        subtext: '(выберите все верные)',
        options: [
          { id: '1-1', text: 'Акции', isCorrect: true },
          { id: '1-2', text: 'Облигации', isCorrect: true },
          { id: '1-3', text: 'Криптовалюты', isCorrect: false },
          { id: '1-4', text: 'Банковский вклад', isCorrect: true },
        ]
      },
      {
        id: 2,
        text: 'Что такое ETF?',
        subtext: '(выберите один вариант)',
        options: [
          { id: '2-1', text: 'Отдельная акция', isCorrect: false },
          { id: '2-2', text: 'Готовый портфель ценных бумаг', isCorrect: true },
          { id: '2-3', text: 'Государственная облигация', isCorrect: false },
          { id: '2-4', text: 'Страховой полис', isCorrect: false },
        ]
      },
      {
        id: 3,
        text: 'Какой тип инвестиций считается самым низкорисковым?',
        subtext: '(выберите один вариант)',
        options: [
          { id: '3-1', text: 'Акции', isCorrect: false },
          { id: '3-2', text: 'Криптовалюты', isCorrect: false },
          { id: '3-3', text: 'Банковские вклады', isCorrect: true },
          { id: '3-4', text: 'Краудлендинг', isCorrect: false },
        ]
      },
      {
        id: 4,
        text: 'Что такое диверсификация?',
        subtext: '(выберите один вариант)',
        options: [
          { id: '4-1', text: 'Вложение всех средств в один актив', isCorrect: false },
          { id: '4-2', text: 'Распределение инвестиций между разными активами', isCorrect: true },
          { id: '4-3', text: 'Покупка только акций', isCorrect: false },
          { id: '4-4', text: 'Использование кредитного плеча', isCorrect: false },
        ]
      }
    ]
  },
  5: { // Статья 5: "Как выбрать брокера"
    totalQuestions: 4,
    questions: [
      {
        id: 1,
        text: 'Что нужно проверить у брокера в первую очередь?',
        subtext: '(выберите один вариант)',
        options: [
          { id: '1-1', text: 'Наличие лицензии ЦБ', isCorrect: true },
          { id: '1-2', text: 'Красивый сайт', isCorrect: false },
          { id: '1-3', text: 'Рекламу в интернете', isCorrect: false },
          { id: '1-4', text: 'Бесплатные подарки', isCorrect: false },
        ]
      },
      {
        id: 2,
        text: 'Что такое ИИС?',
        subtext: '(выберите один вариант)',
        options: [
          { id: '2-1', text: 'Индивидуальный инвестиционный счет', isCorrect: true },
          { id: '2-2', text: 'Иностранный инвестиционный счет', isCorrect: false },
          { id: '2-3', text: 'Инвестиционный индекс', isCorrect: false },
          { id: '2-4', text: 'Интернет-инвестиции', isCorrect: false },
        ]
      },
      {
        id: 3,
        text: 'На какие параметры обращать внимание при выборе брокера?',
        subtext: '(выберите все верные)',
        options: [
          { id: '3-1', text: 'Размер комиссий', isCorrect: true },
          { id: '3-2', text: 'Надежность компании', isCorrect: true },
          { id: '3-3', text: 'Цвет логотипа', isCorrect: false },
          { id: '3-4', text: 'Удобство платформы', isCorrect: true },
        ]
      },
      {
        id: 4,
        text: 'Почему важна диверсификация?',
        subtext: '(выберите один вариант)',
        options: [
          { id: '4-1', text: 'Увеличивает доходность', isCorrect: false },
          { id: '4-2', text: 'Снижает риски', isCorrect: true },
          { id: '4-3', text: 'Упрощает учет', isCorrect: false },
          { id: '4-4', text: 'Не влияет на портфель', isCorrect: false },
        ]
      }
    ]
  },
  6: { // Статья 6: "Виды кредитов"
    totalQuestions: 4,
    questions: [
      {
        id: 1,
        text: 'Что такое ипотека?',
        subtext: '(выберите один вариант)',
        options: [
          { id: '1-1', text: 'Кредит на покупку жилья под залог', isCorrect: true },
          { id: '1-2', text: 'Кредит на автомобиль', isCorrect: false },
          { id: '1-3', text: 'Кредитная карта', isCorrect: false },
          { id: '1-4', text: 'Микрозайм', isCorrect: false },
        ]
      },
      {
        id: 2,
        text: 'Какой платеж уменьшается со временем?',
        subtext: '(выберите один вариант)',
        options: [
          { id: '2-1', text: 'Аннуитетный', isCorrect: false },
          { id: '2-2', text: 'Дифференцированный', isCorrect: true },
          { id: '2-3', text: 'Фиксированный', isCorrect: false },
          { id: '2-4', text: 'Льготный', isCorrect: false },
        ]
      },
      {
        id: 3,
        text: 'Какие бывают виды кредитов?',
        subtext: '(выберите все верные)',
        options: [
          { id: '3-1', text: 'Потребительский', isCorrect: true },
          { id: '3-2', text: 'Ипотечный', isCorrect: true },
          { id: '3-3', text: 'Автокредит', isCorrect: true },
          { id: '3-4', text: 'Инвестиционный', isCorrect: false },
        ]
      },
      {
        id: 4,
        text: 'Что такое полная стоимость кредита (ПСК)?',
        subtext: '(выберите один вариант)',
        options: [
          { id: '4-1', text: 'Только процентная ставка', isCorrect: false },
          { id: '4-2', text: 'Все затраты на обслуживание кредита', isCorrect: true },
          { id: '4-3', text: 'Сумма основного долга', isCorrect: false },
          { id: '4-4', text: 'Комиссия за открытие счета', isCorrect: false },
        ]
      }
    ]
  },
  7: { // Статья 7: "Налоговые вычеты"
    totalQuestions: 4,
    questions: [
      {
        id: 1,
        text: 'Что такое налоговый вычет?',
        subtext: '(выберите один вариант)',
        options: [
          { id: '1-1', text: 'Дополнительный налог', isCorrect: false },
          { id: '1-2', text: 'Возврат части уплаченного налога', isCorrect: true },
          { id: '1-3', text: 'Штраф за неуплату', isCorrect: false },
          { id: '1-4', text: 'Налоговая льгота для бизнеса', isCorrect: false },
        ]
      },
      {
        id: 2,
        text: 'Какой максимальный возврат по имущественному вычету?',
        subtext: '(выберите один вариант)',
        options: [
          { id: '2-1', text: '260 000 ₽', isCorrect: true },
          { id: '2-2', text: '100 000 ₽', isCorrect: false },
          { id: '2-3', text: '500 000 ₽', isCorrect: false },
          { id: '2-4', text: '1 000 000 ₽', isCorrect: false },
        ]
      },
      {
        id: 3,
        text: 'На какие цели можно получить социальный вычет?',
        subtext: '(выберите все верные)',
        options: [
          { id: '3-1', text: 'Лечение', isCorrect: true },
          { id: '3-2', text: 'Обучение', isCorrect: true },
          { id: '3-3', text: 'Покупка автомобиля', isCorrect: false },
          { id: '3-4', text: 'Благотворительность', isCorrect: true },
        ]
      },
      {
        id: 4,
        text: 'Что такое инвестиционный вычет?',
        subtext: '(выберите один вариант)',
        options: [
          { id: '4-1', text: 'Вычет на доход от инвестиций', isCorrect: true },
          { id: '4-2', text: 'Вычет на покупку акций', isCorrect: false },
          { id: '4-3', text: 'Вычет на брокерские услуги', isCorrect: false },
          { id: '4-4', text: 'Вычет на аренду жилья', isCorrect: false },
        ]
      }
    ]
  }
};

// Получаем тест для текущей статьи
const currentQuiz = quizzesData[parseInt(id)] || quizzesData[1];
const [totalQuestions, setTotalQuestions] = useState(currentQuiz.totalQuestions);
const [questions, setQuestions] = useState(currentQuiz.questions);
const [quizOptions, setQuizOptions] = useState([]);
const [savedAnswers, setSavedAnswers] = useState({});

// Эффект для сброса теста при смене статьи
useEffect(() => {
  const newQuiz = quizzesData[parseInt(id)] || quizzesData[1];
  setTotalQuestions(newQuiz.totalQuestions);
  setQuestions(newQuiz.questions);
  // Сброс состояний теста
  setCurrentQuestion(0);
  setQuizCompleted(false);
  setShowResults(false);
  setQuizScore(0);
  setResultsAnimation(false);
  setSavedAnswers({});
  // Инициализируем пустые опции для первого вопроса
  if (newQuiz.questions[0]) {
    setQuizOptions(newQuiz.questions[0].options.map(opt => ({ 
      id: opt.id, 
      text: opt.text, 
      checked: false 
    })));
  }
}, [id]);

  // ============ ФУНКЦИИ ДЛЯ ПРОГРЕССА СТАТЕЙ ============
  
  // Загружаем прогресс статей из localStorage
  const loadProgressFromStorage = () => {
    const savedProgress = localStorage.getItem('articleProgress');
    if (savedProgress) {
      const progressData = JSON.parse(savedProgress);
      setArticlesProgress(progressData);
      return progressData;
    }
    return {};
  };

  // Сохраняем прогресс в localStorage
const saveProgressToStorage = (articleId, progress) => {
  const savedProgress = localStorage.getItem('articleProgress');
  const progressData = savedProgress ? JSON.parse(savedProgress) : {};
  
  // Всегда сохраняем прогресс, но не уменьшаем
  const currentSaved = progressData[articleId] || 0;
  if (progress > currentSaved || progress === 100) {
    progressData[articleId] = Math.max(progress, currentSaved);
    localStorage.setItem('articleProgress', JSON.stringify(progressData));
    setArticlesProgress(progressData);
  }
};

  // Отправляем событие обновления прогресса
  const emitProgressUpdate = (articleId, progress) => {
    const event = new CustomEvent('articleProgressUpdate', { 
      detail: { articleId, progress } 
    });
    window.dispatchEvent(event);
  };

  // Получаем прогресс статьи
  const getArticleProgress = (articleId) => {
    const progress = articlesProgress[articleId] || 0;
    return progress;
  };

  // Обновляем прогресс статьи


const updateArticleProgress = (articleId, progress) => {
  // Получаем текущий сохраненный прогресс
  const currentProgress = articlesProgress[articleId] || 0;
  
  // Сохраняем прогресс только если он увеличился или достиг 100%
  if (progress > currentProgress || progress === 100) {
    saveProgressToStorage(articleId, progress);
    emitProgressUpdate(articleId, progress);
  } else {
  }
};
  // Загружаем прогресс при монтировании
  useEffect(() => {
    loadProgressFromStorage();
  }, []);

  // Слушаем события обновления прогресса из других вкладок/компонентов
  useEffect(() => {
    const handleProgressUpdate = (event) => {
      const { articleId, progress } = event.detail;
      setArticlesProgress(prev => ({
        ...prev,
        [articleId]: progress
      }));
    };
    
    window.addEventListener('articleProgressUpdate', handleProgressUpdate);
    return () => window.removeEventListener('articleProgressUpdate', handleProgressUpdate);
  }, []);

  // ============ ФУНКЦИИ ДЛЯ ПРОГРЕССА ЧТЕНИЯ ТЕКУЩЕЙ СТАТЬИ ============
  
  // Функция расчета прогресса чтения
  const calculateReadingProgress = () => {
    if (!containerRef.current) return 0;
    
    const scrollTop = containerRef.current.scrollTop;
    const scrollHeight = containerRef.current.scrollHeight;
    const clientHeight = containerRef.current.clientHeight;
    const maxScroll = scrollHeight - clientHeight;
    
    if (maxScroll <= 0) return 0;
    
    const progress = Math.round((scrollTop / maxScroll) * 100);
    return Math.min(100, Math.max(0, progress));
  };

  // Обработчик скролла для сохранения прогресса
// Обработчик скролла для сохранения прогресса и определения активной секции
useEffect(() => {
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const progress = calculateReadingProgress();
    setReadingProgress(progress);
    
    if (progress > maxProgressRef.current) {
      maxProgressRef.current = progress;
      updateArticleProgress(parseInt(id), progress);
    }
    
    // Определение активной секции для CONTENTS
    const scrollTop = containerRef.current.scrollTop;
    const viewportHeight = containerRef.current.clientHeight;
    const offset = scrollTop + viewportHeight / 3;
    
    let currentActive = -1;
    
    // Проверяем все секции (только основные заголовки статьи, без блока "Проверь себя")
    for (let i = 0; i < sectionRefs.current.length; i++) {
      const section = sectionRefs.current[i];
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (offset >= sectionTop && offset < sectionBottom) {
          currentActive = i;
          break;
        }
      }
    }
    
    // Если нашли активную секцию - обновляем
    if (currentActive !== -1 && currentActive !== activeSection) {
      setActiveSection(currentActive);
    }
    // Если не нашли (пользователь пролистал дальше последней секции) - оставляем последнюю активную
    // или если scrollTop на самом низу - оставляем последнюю
    else if (currentActive === -1 && scrollTop + viewportHeight >= containerRef.current.scrollHeight - 50) {
      // В самом низу страницы - оставляем последнюю секцию активной
      if (sectionRefs.current.length > 0 && activeSection !== sectionRefs.current.length - 1) {
        setActiveSection(sectionRefs.current.length - 1);
      }
    }
    // Если пользователь прокрутил вверх, но не дошел до предыдущей секции - ничего не меняем
  };
  
  const container = containerRef.current;
  if (container) {
    container.addEventListener('scroll', handleScroll);
    handleScroll();
  }
  
  return () => {
    if (container) {
      container.removeEventListener('scroll', handleScroll);
    }
  };
}, [id, activeSection]);

  // Восстановление сохраненного прогресса при загрузке страницы
  useEffect(() => {
    const savedProgress = localStorage.getItem('articleProgress');
    if (savedProgress) {
      const progressData = JSON.parse(savedProgress);
      const savedArticleProgress = progressData[parseInt(id)];
      if (savedArticleProgress && savedArticleProgress > 0 && containerRef.current) {
        maxProgressRef.current = savedArticleProgress;
        const scrollHeight = containerRef.current.scrollHeight;
        const clientHeight = containerRef.current.clientHeight;
        const maxScroll = scrollHeight - clientHeight;
        const targetScroll = (savedArticleProgress / 100) * maxScroll;
        containerRef.current.scrollTop = targetScroll;
        setReadingProgress(savedArticleProgress);
      }
    }
  }, [id]);

  // Сохраняем прогресс при уходе со страницы
  useEffect(() => {
    return () => {
      updateArticleProgress(parseInt(id), maxProgressRef.current);
    };
  }, [id]);

  // ============ ОСТАЛЬНЫЕ ФУНКЦИИ ============
  
  const handleBack = () => {
    updateArticleProgress(parseInt(id), maxProgressRef.current);
    navigate('/');
  };


  const currentQ = questions[currentQuestion];

  // Проверка ответов при завершении
const toggleQuizOption = (optionId) => {
  const currentQType = questions[currentQuestion];
  const isSingleChoice = currentQType?.subtext === '(выберите один вариант)';
  
  let newOptions;
  if (isSingleChoice) {
    newOptions = quizOptions.map(option => ({
      ...option,
      checked: option.id === optionId
    }));
  } else {
    newOptions = quizOptions.map(option =>
      option.id === optionId ? { ...option, checked: !option.checked } : option
    );
  }
  
  setQuizOptions(newOptions);
  setSavedAnswers(prev => ({
    ...prev,
    [currentQuestion]: newOptions
  }));
};

const checkAnswers = () => {
  let correctCount = 0;
  
  for (let qIdx = 0; qIdx < questions.length; qIdx++) {
    const question = questions[qIdx];
    const userAnswers = savedAnswers[qIdx] || [];
    const correctOptions = question.options.filter(opt => opt.isCorrect);
    const isSingleChoice = question.subtext === '(выберите один вариант)';
    
    if (isSingleChoice) {
      const selectedOption = userAnswers.find(opt => opt.checked);
      if (selectedOption && selectedOption.isCorrect) {
        correctCount++;
      }
    } else {
      let allCorrectSelected = true;
      let noWrongSelected = true;
      
      for (const option of question.options) {
        const userAnswer = userAnswers.find(ua => ua.id === option.id);
        const isChecked = userAnswer?.checked || false;
        
        if (option.isCorrect && !isChecked) allCorrectSelected = false;
        if (!option.isCorrect && isChecked) noWrongSelected = false;
      }
      
      if (allCorrectSelected && noWrongSelected) correctCount++;
    }
  }
  
  const percentage = Math.round((correctCount / questions.length) * 100);
  
  setQuizStats({
    correct: correctCount,
    wrong: questions.length - correctCount,
    percentage: percentage
  });
  setQuizScore(correctCount);
  setQuizCompleted(true);
  setShowResults(true);
  setTimeout(() => setResultsAnimation(true), 100);
};

const handleNextQuestion = () => {
  if (isAnimating) return;
  
  setSavedAnswers(prev => ({
    ...prev,
    [currentQuestion]: quizOptions
  }));
  
  if (currentQuestion < totalQuestions - 1) {
    setAnimateDirection('next');
    setIsAnimating(true);
    
    setTimeout(() => {
      const nextIndex = currentQuestion + 1;
      setCurrentQuestion(nextIndex);
      
      const saved = savedAnswers[nextIndex];
      if (saved) {
        setQuizOptions(saved);
      } else {
        setQuizOptions(questions[nextIndex].options.map(opt => ({ 
          id: opt.id, 
          text: opt.text, 
          checked: false 
        })));
      }
      
      setAnimateDirection('');
      setIsAnimating(false);
    }, 300);
  } else {
    checkAnswers();
  }
};

const handlePrevQuestion = () => {
  if (isAnimating || currentQuestion === 0) return;
  
  setSavedAnswers(prev => ({
    ...prev,
    [currentQuestion]: quizOptions
  }));
  
  setAnimateDirection('prev');
  setIsAnimating(true);
  
  setTimeout(() => {
    const prevIndex = currentQuestion - 1;
    setCurrentQuestion(prevIndex);
    
    const saved = savedAnswers[prevIndex];
    if (saved) {
      setQuizOptions(saved);
    } else {
      setQuizOptions(questions[prevIndex].options.map(opt => ({ 
        id: opt.id, 
        text: opt.text, 
        checked: false 
      })));
    }
    
    setAnimateDirection('');
    setIsAnimating(false);
  }, 300);
};

const handleRetryQuiz = () => {
  setResultsAnimation(false);
  setSavedAnswers({}); // Очищаем сохраненные ответы
  setTimeout(() => {
    setCurrentQuestion(0);
    setQuizCompleted(false);
    setShowResults(false);
    setQuizOptions(questions[0].options);
  }, 300);
};

  // Статистика результатов
  const [quizStats, setQuizStats] = useState({
    correct: 0,
    wrong: 0,
    percentage: 0
  });

  const articleTitles = {
    1: 'Что такое финансовая грамотность?',
    2: 'Основы бюджетирования',
  };

  const articleTitle = articleTitles[id] || `Статья ${id}`;
  
  const articleContent = {
 1: {
    title: 'Что такое инвестиции и зачем они нужны',
    sections: [
      {
        title: 'Введение',
        content: 'Представьте ситуацию: вы получили премию — сто тысяч рублей. Перед вами стоит выбор. Можно купить новый смартфон, съездить в отпуск или отложить деньги на будущее. Если вы выбираете последнее, то следующим вопросом становится: как сохранить эти деньги и, возможно, приумножить? Именно здесь появляется понятие инвестиций.\n\nЕсли говорить простыми словами, инвестиции — это вложение денег сегодня с целью получить больше денег в будущем. Звучит заманчиво, но за этой простой формулировкой скрывается целый мир возможностей, рисков и нюансов, которые важно понимать, прежде чем делать первый шаг.'
      },
{
  title: 'Почему деньги теряют ценность',
  content: 'Давайте разберёмся, почему вообще возникает необходимость инвестировать. Возьмём для примера обычную семью Петровых. Пять лет назад они откладывали деньги на покупку квартиры. Каждый месяц они клали под подушку или на банковский счёт по пятнадцать тысяч рублей. За пять лет накопилось девятьсот тысяч рублей. Казалось бы, отличная сумма!\n\nНо когда они пришли в банк за ипотекой, то выяснили неприятную вещь: квартиры, которые пять лет назад стоили три миллиона, теперь стоят четыре с половиной. Их накопления обесценились относительно цен на недвижимость. То, что казалось достаточной суммой, теперь покрывает лишь часть необходимого.\n\nЭто произошло из-за инфляции — процесса, при котором цены на товары и услуги постепенно растут, а покупательная способность денег падает. Инфляция в России в среднем составляет 4–7% в год. Это значит, что если вы просто храните деньги дома или на обычном счёте, каждый год вы фактически теряете часть их ценности.',
image: {
    src: Рисунок1,
    alt: 'Инфляция',
    caption: ' '
  }},

      {
        title: 'Инвестиции против накоплений',
        content: 'Теперь давайте сравним два подхода к управлению деньгами. Представим двух людей с одинаковой зарплатой — по шестьдесят тысяч рублей в месяц. Оба откладывают по десять тысяч ежемесячно.\n\nПервый человек, назовём его Сергей, предпочитает надёжность. Он кладёт деньги на банковский счёт или просто откладывает их дома. Через год у него будет сто двадцать тысяч рублей. Через пять лет — шестьсот тысяч. Через десять лет — миллион двести тысяч. Всё просто и понятно.\n\nВторой человек, Анна, решила инвестировать свои накопления. Она не ищет сверхдоходов, но хочет хотя бы сохранить деньги от инфляции и немного приумножить. Допустим, её инвестиции приносят в среднем 10% годовых (это реалистичная цифра для сбалансированного портфеля).\n\nЧерез год у Анны будет не сто двадцать тысяч, а около ста двадцати шести тысяч — разница небольшая. Но через пять лет у неё накопится не шестьсот тысяч, а примерно семьсот сорок тысяч. А через десять лет — не миллион двести тысяч, а около двух миллионов.\n\nЭта разница возникает благодаря сложному проценту — когда доход от инвестиций сам начинает приносить доход. В первые годы эффект почти незаметен, но со временем он набирает силу, как снежный ком.',
      image: {
        src: Рисунок2,
        alt: 'Инфляция',
        caption: ' '}},
      {
        title: 'Что можно получить от инвестиций',
        content: 'Люди начинают инвестировать по разным причинам, и у каждого свои цели. Кто-то хочет создать финансовую подушку безопасности — запас денег на случай потери работы или непредвиденных расходов. Кто-то копит на конкретную цель: покупку жилья, автомобиля, образование детей или путешествие мечты.\n\nЕсть те, кто готовится к пенсии и понимает, что государственной пенсии может не хватить на привычный уровень жизни. Они начинают инвестировать заранее, чтобы к моменту выхода на пенсию создать дополнительный источник дохода.\n\nНекоторые рассматривают инвестиции как способ защиты от инфляции. Они понимают, что просто хранить деньги — значит постепенно их терять, и хотят хотя бы сохранить покупательную способность своих накоплений.\n\nЕсть и те, кому просто интересно разобраться, как работают финансовые рынки. Они видят в инвестициях не только способ заработка, но и возможность получить новые знания и навыки.'
      },
      {
        title: 'Чем инвестиции не являются',
        content: 'Очень важно понимать, чем инвестиции не являются. Это не способ быстро разбогатеть. Если вы слышите истории о людях, которые вложили сто тысяч и через месяц стали миллионерами, знайте: либо это исключительное везение, которое не повторяется, либо откровенное мошенничество.\n\nИнвестиции — это не азартная игра и не казино. Здесь нет места эмоциям и спонтанным решениям. Успешные инвесторы действуют хладнокровно, анализируют информацию и принимают взвешенные решения.\n\nИнвестиции также не гарантируют прибыль. В отличие от банковского вклада, где доходность фиксирована и застрахована, в инвестициях вы можете как заработать, так и потерять часть вложенных средств. Это нужно принять как данность.',
        image: {
        src: Рисунок3,
        alt: 'Инфляция',
        caption: ' '}},
      {
        title: 'С чего начинается путь инвестора',
        content: 'Путь в мир инвестиций начинается не с открытия брокерского счёта и не с покупки первых акций. Он начинается с понимания собственных финансов. Прежде чем инвестировать, нужно разобраться со своими доходами и расходами, погасить дорогие долги (например, кредитные карты с высокими процентами) и создать финансовую подушку безопасности.\n\nФинансовая подушка — это запас денег, который позволит вам прожить три-шесть месяцев без дохода. Эти деньги должны быть доступны в любой момент, поэтому их обычно хранят на банковском вкладе или накопительном счёте, а не инвестируют.\n\nТолько после того как вы создали такую подушку, можно задуматься об инвестициях. Потому что если вы вложите все деньги, а через месяц потеряете работу, вам придётся продавать активы, возможно, с убытком, чтобы купить еду и оплатить счета.'
      },
      {
        title: 'Реалистичные ожидания',
        content: 'Один из главных секретов успешного инвестирования — реалистичные ожидания. Если вы рассчитываете на 20–30% годовых, вы, скорее всего, разочаруетесь или попадёте в ловушку мошенников. Реальная доходность сбалансированного портфеля на долгосрочном горизонте составляет 8–12% годовых с учётом инфляции.\n\nЭто не значит, что каждый год вы будете получать именно столько. В один год портфель может вырасти на 25%, в другой — упасть на 15%. Но на горизонте десяти и более лет средняя доходность обычно выравнивается вокруг этих значений.\n\nВажно также понимать, что инвестиции требуют времени. Это не быстрый процесс. Те, кто пытается «обыграть рынок» и заработать за несколько месяцев, чаще всего проигрывают. Те, кто инвестирует регулярно и долго, обычно добиваются успеха.'
      },
      {
        title: 'Первый шаг',
        content: 'Если после всего прочитанного вы всё ещё чувствуете интерес к инвестициям, значит, вы готовы сделать первый шаг. Но не спешите. Начните с малого: откройте демо-счёт у брокера и попробуйте «инвестировать» виртуальные деньги. Почувствуйте, как реагируете на колебания рынка, на прибыль и убытки.\n\nЧитайте книги по инвестициям, смотрите обучающие видео, задавайте вопросы на форумах. Чем больше вы узнаете, тем увереннее будете себя чувствовать, когда придёт время инвестировать реальные деньги.\n\nИ помните: не существует «правильного» момента для начала инвестиций. Лучшее время было десять лет назад. Второе лучшее время — сейчас. Главное — начать, быть последовательным и не сдаваться при первых трудностях.',
        image: {
        src: Рисунок4,
        alt: 'Инфляция',
        caption: ' '}},
      {
        title: 'Заключение',
        content: 'Инвестиции — это не волшебная таблетка и не лотерейный билет. Это инструмент, который при грамотном использовании помогает достигать финансовых целей. Но как любой инструмент, он требует изучения и осторожного обращения.\n\nГлавное, что нужно запомнить: инвестиции работают на тех, кто готов учиться и действовать без спешки. Не обязательно сразу разбираться во всех тонкостях — достаточно начать с основ, задавать вопросы и внимательно анализировать свои действия. Со временем незнакомые термины станут понятными, а колебания цен перестанут вызывать лишние эмоции.\n\nНачните с малого: определите свои финансовые цели, создайте подушку безопасности, изучите базовые понятия. Не вкладывайте деньги, которые могут понадобиться в любой момент, и не верьте обещаниям быстрой прибыли. Финансовая грамотность формируется постепенно, и инвестиции могут стать её важной частью, если подходить к ним без иллюзий, но с чётким планом.\n\nПомните: каждый успешный инвестор когда-то был новичком. Разница лишь в том, что они не побоялись сделать первый шаг и продолжили двигаться вперёд, даже когда что-то не получалось. Ваш путь в мир инвестиций начинается сейчас — не с больших денег, а с понимания и желания учиться.'
      }
    ]
  },
    2: {
  title: 'Виды активов',
  sections: [
    {
      title: 'Введение',
      content: 'Когда человек впервые открывает брокерское приложение, он видит длинный список непонятных названий: акции, облигации, фонды, валюта, золото. Возникает вопрос: во что вообще можно вложить деньги и чем эти варианты отличаются друг от друга? Каждый из этих пунктов — это актив, то есть инструмент, в который можно вложить капитал с надеждой на доход.\n\nПонимание видов активов — это фундамент инвестирования. Нельзя строить дом, не зная, из каких материалов он состоит. Так и нельзя формировать инвестиционный портфель, не понимая, какие бывают активы, как они работают и какую роль играют. В этой статье мы разберём основные категории активов, их особенности, плюсы и минусы, а также поймём, почему опытные инвесторы используют разные инструменты, а не кладут все яйца в одну корзину.'
    },
    {
      title: 'Что такое актив',
      content: 'Начнём с простого определения. Актив — это всё, что имеет ценность и может принести доход в будущем. В контексте инвестиций активом называют финансовый инструмент, который вы покупаете, рассчитывая на рост его стоимости или регулярные выплаты.\n\nВажно отличать активы от пассивов. Актив кладёт деньги в ваш карман, пассив забирает их. Например, квартира, которую вы сдаёте в аренду и получаете ежемесячный доход, — это актив. Квартира, в которой вы живёте и платите за коммунальные услуги, ипотеку и ремонт, — это пассив. В инвестициях мы говорим именно о финансовых активах: ценных бумагах, валюте, драгоценных металлах и других инструментах.'
    },
    {
      title: 'Акции: доля в бизнесе',
      content: 'Акции — это, пожалуй, самый известный вид активов. Когда вы покупаете акцию, вы становитесь совладельцем компании. Да, возможно, ваша доля будет микроскопической, но юридически вы — акционер.\n\nАкции приносят доход двумя способами. Первый — это рост цены. Вы купили акцию за сто рублей, через год она стоит сто двадцать. Продав её, вы заработали двадцать рублей. Второй способ — дивиденды. Это часть прибыли компании, которую она распределяет между акционерами. Не все компании платят дивиденды, но многие делают это регулярно.\n\nУ акций есть важный плюс: на длинных отрезках времени они исторически показывают доходность выше инфляции. Компании растут, развиваются, увеличивают прибыль, и это отражается на цене акций. Но есть и минус: акции могут сильно колебаться в цене. Сегодня акция стоит сто рублей, завтра — девяносто, послезавтра — сто десять. Такая волатильность требует крепких нервов и долгосрочного взгляда.',
      image: {
    src: Рисунок10,
    alt: 'Инфляция',
    caption: ' '
  },
    },
    {
      title: 'Облигации: долг с процентами',
      content: 'Если акции — это доля в компании, то облигации — это долг. Покупая облигацию, вы даёте деньги в долг государству или компании на определённый срок. Взамен эмитент обязуется вернуть вам деньги в конце срока и периодически выплачивать проценты, которые называются купонами.\n\nОблигации считаются более консервативным инструментом, чем акции. Их доходность обычно ниже, но и риск меньше. Вы примерно знаете, сколько получите и когда. Если компания или государство не обанкротятся, вы вернёте свои деньги с процентами.\n\nОблигации делятся на несколько видов. Государственные облигации — самые надёжные, потому что за ними стоит государство. Корпоративные облигации выпускают компании, их доходность выше, но и риск больше. Есть также облигации с постоянным купоном, где процент известен заранее, и с плавающим купоном, где выплата привязана к ключевой ставке или инфляции.\n\nДля новичков облигации — хороший способ начать. Они дают стабильный доход, меньше нервируют колебаниями цены и помогают понять, как работает рынок.',
      image: {
    src: Рисунок11,
    alt: 'Инфляция',
    caption: ' '
  },
    },
    {
      title: 'Фонды: готовый набор активов',
      content: 'Инвестиционные фонды, или ETF, — это инструмент, который позволяет купить сразу много разных активов одной покупкой. Представьте, что вы хотите собрать портфель из акций десяти разных компаний. Это долго, дорого и сложно. Вместо этого вы покупаете пай фонда, который уже владеет этими акциями.\n\nФонды бывают разные. Одни повторяют состав индекса, например, индекса Московской биржи или американского S&P 500. Другие сосредоточены на определённой отрасли: технологии, энергетика, здравоохранение. Третьи инвестируют в облигации или смешанные активы.\n\nГлавное преимущество фондов — диверсификация. Покупая один инструмент, вы автоматически распределяете деньги между десятками или сотнями компаний. Это снижает риск: если одна компания просядет, другие могут это компенсировать. Кроме того, фонды удобны: не нужно анализировать каждую компанию отдельно, достаточно выбрать подходящий фонд.\n\nМинус фондов — комиссия за управление. Фонд берёт небольшой процент от стоимости активов за свою работу. Но для новичков это часто оправдано удобством и снижением риска.'
    },
    {
      title: 'Валюта: защита от ослабления рубля',
      content: 'Валюта — это тоже актив, хотя многие не считают её инвестицией в полном смысле. Покупка валюты не приносит дохода сама по себе: доллары не платят дивиденды, а евро не дают купонов. Но валюта защищает сбережения от ослабления национальной валюты.\n\nЕсли вы живёте в России и ваши расходы привязаны к рублю, часть сбережений имеет смысл держать в валюте. Это создаёт баланс: если рубль укрепится, вы ничего не потеряете, потому что основные расходы всё равно в рублях. Если рубль ослабнет, валютная часть портфеля это компенсирует.\n\nВажно понимать: валюта не инструмент для заработка, а инструмент для защиты. Курсы валют непредсказуемы, и пытаться угадать, когда доллар вырастет или упадёт, — это спекуляция, а не инвестирование.',
            image: {
    src: Рисунок12,
    alt: 'Инфляция',
    caption: ' '
  },
    },
    {
      title: 'Драгоценные металлы: защита в кризис',
      content: 'Золото, серебро, платина — эти металлы тысячелетиями использовались как деньги и хранилище ценности. Сегодня они тоже считаются защитными активами.\n\nЗолото — самый популярный металл среди инвесторов. Оно не приносит регулярного дохода, не растёт как акции компаний, но сохраняет ценность в долгосрочной перспективе. В периоды кризисов, войн, экономической нестабильности цена золота обычно растёт, потому что инвесторы ищут безопасные гавани.\n\nСеребро ведёт себя иначе. Оно более волатильно, то есть сильнее колеблется в цене. Кроме инвестиционного спроса, на серебро влияет промышленный спрос: его используют в электронике, медицине, производстве. Поэтому цена серебро зависит не только от настроений инвесторов, но и от состояния экономики.\n\nПокупать физические металлы — слитки или монеты — не всегда удобно. Нужно хранить, обеспечивать безопасность, при продаже могут возникнуть вопросы с налогами. Поэтому многие инвесторы предпочитают «бумажное золото»: обезличенные металлические счета в банках или фонды, которые инвестируют в металлы.',
            image: {
    src: Рисунок13,
    alt: 'Инфляция',
    caption: ' '
  },
    },
    {
      title: 'Цифровые активы: высокий риск и высокая доходность',
      content: 'Криптовалюты и другие цифровые активы — это относительно новый класс инструментов. Биткоин, эфириум и другие криптовалюты привлекают внимание высокой потенциальной доходностью. За короткое время можно заработать десятки или даже сотни процентов.\n\nНо за высокой доходностью стоит высокий риск. Криптовалюты крайне волатильны: цена может вырасти на пятьдесят процентов за неделю и упасть на сорок процентов за день. Регулирование этого рынка пока не устоялось, технологии сложны, а риск потери средств из-за ошибок или мошенничества реален.\n\nЦифровые активы подходят далеко не всем. Если вы новичок, не стоит вкладывать в криптовалюты больше, чем вы готовы потерять. Это скорее спекулятивная часть портфеля, чем основа для долгосрочных инвестиций.'
    },
    {
      title: 'Недвижимость: осязаемый актив',
      content: 'Недвижимость — квартиры, дома, коммерческие помещения — традиционно считается надёжным активом. Она осязаема, её можно увидеть и потрогать, она приносит арендный доход и потенциально растёт в цене.\n\nНо у недвижимости есть недостатки. Во-первых, нужен большой стартовый капитал. Купить акцию можно за сто рублей, квартиру — за миллионы. Во-вторых, недвижимость низколиквидна: продать её быстро и без потери цены сложно. В-третьих, есть дополнительные расходы: налоги, коммунальные платежи, ремонт, поиск арендаторов.\n\nСегодня появились альтернативы прямой покупке недвижимости. Например, фонды недвижимости, которые позволяют купить долю в большом объекте за небольшие деньги. Или краудлендинговые платформы, где можно инвестировать в строительство или покупку недвижимости совместно с другими инвесторами.'
    },
    {
      title: 'Как выбрать подходящие активы',
      content: 'Разнообразие активов может сбить с толку. Как понять, что подходит именно вам? Ответ зависит от нескольких факторов.\n\nПервый — ваши цели. Если вы копите на пенсию через двадцать лет, можно сделать ставку на акции и фонды. Если хотите сохранить деньги на покупку квартиры через три года, подойдут облигации и валюта. Если ищете защиту от кризиса, обратите внимание на золото.\n\nВторой фактор — отношение к риску. Если вас пугают колебания цены, выбирайте консервативные инструменты: облигации, вклады, часть валюты. Если готовы к временным просадкам ради более высокой доходности, добавьте акции и фонды.\n\nТретий фактор — горизонт инвестирования. Чем дольше вы готовы держать актив, тем больше риска можно себе позволить. Краткосрочные вложения требуют стабильности и предсказуемости.\n\nНе существует «лучшего» актива. Каждый выполняет свою функцию. Акции дают рост, облигации — стабильность, валюта — защиту от курсовых колебаний, золото — страховку от кризисов. Задача инвестора — не выбрать один «правильный» инструмент, а собрать сбалансированный набор, который будет работать на ваши цели.'
    },
    {
      title: 'Заключение',
      content: 'Активы — это инструменты, из которых строится ваше инвестиционное будущее. Акции, облигации, фонды, валюта, металлы, недвижимость, цифровые активы — у каждого свои особенности, плюсы и минусы. Понимание этих различий помогает не просто покупать первый попавшийся инструмент, а осознанно формировать портфель.\n\nГлавное, что нужно запомнить: не существует универсального актива, который всегда и при любых условиях приносит максимальный доход без риска. Успешные инвесторы не ищут волшебную таблетку, а используют разные инструменты в правильной пропорции. Они понимают, что каждый актив играет свою роль: одни обеспечивают рост, другие — стабильность, третьи — защиту.\n\nВ следующих статьях мы подробнее разберём каждый вид активов: как выбирать акции, на что смотреть при покупке облигаций, как работают фонды и какие комиссии скрываются за инвестициями. Эти знания помогут вам перейти от теории к практике и сделать первые осознанные шаги в мире инвестиций.'
    }
  ]
},
3: {
title: 'Акции',
  sections: [
    {
      title: 'Введение',
      content: 'Когда вы слышите слово «акции», перед глазами наверняка возникают образы с Уолл-стрит, брокеров в пиджаках и бегущих строк с цифрами. На самом деле всё проще и интереснее. Покупая акцию, вы становитесь совладельцем реального бизнеса. Не абстрактной структуры, а конкретной компании, которая производит товары, оказывает услуги, нанимает людей и зарабатывает деньги.\n\nАкции — это фундамент инвестиционного мира. Именно с них начинали первые инвесторы столетия назад, и именно они остаются основным инструментом для роста капитала сегодня. Но за кажущейся простотой скрывается множество нюансов: какие бывают акции, как компания делится прибылью, почему цены постоянно меняются и как отличить перспективную компанию от той, что скоро потеряет ценность. В этой статье разберёмся, как работают акции на практике и что нужно знать, прежде чем стать акционером.',
                  image: {
    src: Рисунок14,
    alt: 'Инфляция',
    caption: ' '
  },
    },
    {
      title: 'Что такое акция на самом деле',
      content: 'Представьте, что вы с друзьями решили открыть кофейню. Нужно пятьсот тысяч рублей. У вас есть только двести. Вы предлагаете друзьям вложить оставшиеся триста, а взамен отдаёте им доли в бизнесе. Скажем, каждый, кто вложил сто тысяч, получает двадцать процентов кофейни. Эти доли и есть аналог акций.\n\nВ мире большого бизнеса всё работает похоже, только масштабы другие. Компания выпускает миллионы или даже миллиарды акций, каждая из которых стоит относительно недорого. Покупая даже одну акцию Apple или «Газпрома», вы юридически становитесь их совладельцем. Да, ваша доля микроскопическая, но вы имеете право на часть прибыли и можете участвовать в управлении (хотя на практике для этого нужно владеть серьёзным пакетом).\n\nАкции отличаются от других инструментов тем, что они не имеют срока годности. Облигация погашается через определённое время, вклад забирается по истечении срока. Акции же существуют, пока существует компания. Вы можете держать их год, десять лет или передать по наследству.'
    },
    {
      title: 'Откуда берётся доход',
      content: 'Акции приносят деньги двумя путями. Первый — это рост цены. Вы купили акцию за сто рублей, через год она стоит сто двадцать. Продав, вы заработали двадцать рублей. Второй путь — дивиденды. Это часть прибыли, которую компания распределяет между акционерами.\n\nНе все компании платят дивиденды. Некоторые предпочитают reinvest прибыль обратно в развитие: строят новые заводы, запускают продукты, выходят на новые рынки. Такие компании называют growth-компаниями (компаниями роста). Инвесторы покупают их акции, рассчитывая, что бизнес вырастет в несколько раз, и цена акций последует за ним.\n\nДругие компании, обычно зрелые и стабильные, регулярно делятся прибылью. Их называют dividend-компаниями. Здесь инвесторы получают регулярный доход, даже если цена акций растёт медленно.\n\nКакой подход лучше? Зависит от ваших целей. Если вы молоды и копите на далёкое будущее, компании роста могут дать больший результат. Если вам нужен стабильный доход здесь и сейчас, дивидендные акции привлекательнее.'
    },
    {
      title: 'Почему цены постоянно меняются',
      content: 'Один из самых частых вопросов новичков: почему акция сегодня стоит сто рублей, а завтра — девяносто пять? Компания же не меняется каждый день?\n\nДействительно, бизнес меняется медленно. Но цена акции — это не только отражение текущего состояния компании. Это ещё и ожидания тысяч и миллионов инвесторов относительно будущего. И эти ожидания меняются постоянно под влиянием:\n• новостей о компании (отчёт о прибыли, запуск нового продукта, скандал с руководством);\n• ситуации в отрасли (появление нового конкурента, изменение законодательства, технологический прорыв);\n• экономики в целом (рост или падение ВВП, изменение ставок, инфляция);\n• мировых событий (политические кризисы, пандемии, конфликты);\n• настроений на рынке (страх или жадность инвесторов).\n\nИногда цена меняется из-за фундаментальных причин: компания действительно стала стоить больше или меньше. Иногда — из-за эмоций: все испугались и начали продавать, или все поверили в успех и скупают акции.\n\nВажно понимать: колебания цены — это норма. Даже лучшие компании мира переживают периоды, когда их акции падают на двадцать, тридцать, иногда пятьдесят процентов. Это не значит, что бизнес развалился. Часто это просто коррекция после роста или реакция на временные трудности.'
    },
    {
      title: 'Как оценивать компанию',
      content: 'Новички часто покупают акции, глядя только на цену: «Эта акция стоит сто рублей, а та — тысячу. Значит, первая дешевле и выгоднее». Это ошибка.\n\nЦена акции сама по себе ничего не говорит о том, дорогая компания или дешёвая. Важно смотреть на стоимость бизнеса в целом. Для этого используют разные показатели.\n\nP/E (цена/прибыль) — один из самых популярных. Он показывает, за сколько лет компания окупит свою стоимость при текущей прибыли. Если P/E равен 10, значит, инвесторы готовы заплатить за компанию сумму, равную её десятилетней прибыли. Низкий P/E может говорить о том, что компания недооценена. Высокий — что инвесторы верят в быстрый рост.\n\nP/B (цена/балансовая стоимость) — показывает отношение рыночной цены к стоимости активов компании. Если P/B меньше единицы, компания торгуется дешевле своих активов. Это может быть как возможностью, так и сигналом проблем.\n\nДивидендная доходность — процент от цены акции, который компания выплачивает в виде дивидендов. Если акция стоит сто рублей, а дивиденды составляют пять рублей, доходность — 5%.\n\nНо цифры — это только часть картины. Важно понимать бизнес-модель: как компания зарабатывает, кто её конкуренты, какие у неё преимущества, кто управляет. Цифры могут быть красивыми сегодня, но если бизнес устаревает или теряет рынок, завтра всё изменится.',
                  image: {
    src: Рисунок15,
    alt: 'Инфляция',
    caption: ' '
  },
    },
    {
      title: 'Какие бывают акции',
      content: 'Не все акции одинаковы. Кроме того, что они принадлежат разным компаниям, они ещё и различаются по типу.\n\nОбыкновенные акции дают право голоса на собрании акционеров и право на дивиденды (если компания их платит). Именно такие акции чаще всего имеют в виду, когда говорят просто «акции».\n\nПривилегированные акции (префы) обычно не дают права голоса, но зато по ним часто платят более высокие дивиденды, и эти выплаты приоритетны. Если у компании трудности, сначала платят держателям префов, потом — обыкновенных акций.\n\nВ России у некоторых компаний есть и те, и другие акции, и они торгуются по разным ценам. Иногда это создаёт возможности: если обыкновенная акция стоит значительно дешевле привилегированной при одинаковых правах (кроме голоса), это может быть интересно для покупки.\n\nТакже акции делятся по размеру компании:\n\nГолубые фишки — акции крупнейших, самых надёжных и ликвидных компаний. В России это «Газпром», Сбербанк, «Лукойл». В США — Apple, Microsoft, Amazon. Они менее волатильны, но и растут медленнее.\n\nАкции второго эшелона — компании поменьше, с меньшей капитализацией. Они могут расти быстрее, но и рискуют сильнее.\n\nАкции третьего эшелона — маленькие компаний с низкой ликвидностью. Покупать и продавать их сложно, риски высоки, но и потенциал роста может быть значительным.\n\nНовичкам лучше начинать с голубых фишек или крупных компаний второго эшелона. Они понятнее, стабильнее, и по ним больше информации.'
    },
    {
      title: 'Риски акционерных инвестиций',
      content: 'Акции — не безрисковый инструмент. Даже покупая акции отличной компании, вы сталкиваетесь с несколькими видами рисков.\n\nРыночный риск — когда падают все акции сразу из-за кризиса, паники или экономических проблем. Даже лучшая компания не уйдёт от такого падения, хотя может восстановиться быстрее других.\n\nИндивидуальный риск — проблемы конкретной компании: потеря рынка, скандал, уход ключевого руководителя, технологическое отставание. Компания может не только упасть в цене, но и обанкротиться, тогда акции превратятся в ноль.\n\nВалютный риск — если вы покупаете иностранные акции, а ваша национальная валюта укрепляется, вы теряете на разнице курсов, даже если сама акция выросла.\n\nИнфляционный риск — если доходность акций ниже инфляции, вы формально зарабатываете, но реально теряете покупательную способность.\n\nНо есть и хорошая новость: на длинных отрезках времени (десять лет и больше) акции исторически показывают доходность выше инфляции и других инструментов. Кризисы случаются, рынки падают, но потом восстанавливаются и идут дальше. Те, кто выдерживает просадки и не продаёт в панике, обычно остаются в плюсе.',
        image: {
      src: Рисунок16,
      alt: 'Инфляция',
      caption: ' '
    },
    },
    {
      title: 'С чего начать',
      content: 'Если вы решили купить свои первые акции, не торопитесь. Начните с простого:\n\nВыберите компанию, бизнес которой вам понятен. Не обязательно разбираться в тонкостях, но вы должны представлять, чем она занимается, кто её клиенты, почему люди покупают её продукты.\n\nПочитайте о компании. Не только хвалебные статьи, но и критические мнения, отчёты, новости. Поймите, какие у неё сильные стороны и какие риски.\n\nОпределитесь с целью. Вы покупаете на годы или хотите быстро заработать? Ждёте дивидендов или рассчитываете на рост цены? От этого зависит выбор компании.\n\nНачните с небольшой суммы. Не вкладывайте всё сразу. Купите немного, посмотрите, как реагируете на колебания цены, поймите свои эмоции.\n\nНе пытайтесь угадать идеальный момент для покупки. Никто не знает, будет ли завтра дешевле или дороже. Покупайте, когда нашли хорошую компанию по адекватной цене, а не когда «все говорят, что надо покупать».'
    },
    {
      title: 'Заключение',
      content: 'Акции — это не лотерейный билет и не способ быстро разбогатеть. Это доля в реальном бизнесе, которая может расти в цене и приносить часть прибыли. Успешные инвестиции в акции требуют не гениального чутья, а терпения, дисциплины и готовности учиться.\n\nГлавное, что нужно запомнить: цена акции постоянно меняется, и это нормально. Бизнес растёт медленно, а котировки скачут. Не паникуйте при падениях и не эйфорьтесь при росте. Смотрите на компанию, а не на график. Покупайте то, что понимаете. Держите долго. И помните: время на рынке важнее, чем попытка угадать момент входа.\n\nВ следующей статье мы поговорим об облигациях — инструменте, который во многом противоположен акциям: более предсказуемом, стабильном, но с меньшим потенциалом роста. Понимание обоих инструментов поможет вам выстроить сбалансированный подход к инвестициям.'
    }
  ]
},
4: {
  title: 'Облигации',
  sections: [
    {
      title: 'Введение',
      content: 'Если акции — это доля в бизнесе, то облигации — это долг. Когда вы покупаете облигацию, вы не становитесь совладельцем компании. Вы даёте ей деньги в долг на определённый срок, а она обязуется вернуть вам эти деньги с процентами. Звучит скучнее, чем акции? Возможно. Но именно эта «скучность» делает облигации одним из самых надёжных инструментов в портфеле инвестора.\n\nОблигации часто называют консервативным инструментом, и это правда: они менее волатильны, более предсказуемы и подходят тем, кто не готов к резким колебаниям стоимости. Но за внешней простотой скрывается множество нюансов: какие бывают облигации, как считаются выплаты, что такое дюрация и почему даже надёжная облигация может принести убыток. В этой статье разберёмся, как работают облигации на практике и кому они подходят.'
    },
    {
      title: 'Как работает облигация',
      content: 'Представьте, что государство или компания хочет занять деньги. Вместо того чтобы идти в банк, они выпускают облигации — ценные бумаги, которые продают инвесторам. Вы покупаете такую бумагу, фактически даёте деньги в долг. Взамен получаете два бонуса: регулярные выплаты (купон) и возврат номинала в конце срока.\n\nКупон — это процент, который эмитент платит за пользование вашими деньгами. Обычно он выплачивается раз в квартал или полгода. Например, вы купили облигацию номиналом 1000 рублей с купоном 8% годовых. Раз в год вы будете получать 80 рублей, а в конце срока вам вернут 1000 рублей.\n\nНоминал — это сумма, которую эмитент обязуется вернуть при погашении. Важно: цена облигации на рынке может отличаться от номинала. Вы можете купить её за 950 рублей или за 1050. Но при погашении вы всё равно получите номинал — 1000 рублей. Эта разница между ценой покупки и номиналом тоже влияет на вашу итоговую доходность.\n\nСрок обращения — период, через который эмитент вернёт долг. Он может составлять от нескольких месяцев до десяти и более лет. Чем дольше срок, тем выше обычно доходность, но и тем больше неопределённости: за это время может измениться экономическая ситуация, ставки, инфляция.'
    },
    {
      title: 'Виды облигаций',
      content: 'Не все облигации одинаковы. Они различаются по эмитенту, типу купона, валюте и другим параметрам.\n\nПо эмитенту:\n• Государственные облигации (ОФЗ в России) — самые надёжные, потому что за ними стоит государство. Доходность обычно чуть выше инфляции.\n• Муниципальные облигации — выпускают регионы и города. Риск чуть выше, доходность тоже.\n• Корпоративные облигации — выпускают компании. Доходность выше, но и риск зависит от надёжности бизнеса.\n\nПо типу купона:\n• Постоянный купон — процент известен заранее и не меняется. Самый понятный вариант для новичка.\n• Плавающий купон — выплата привязана к ключевой ставке или инфляции. Удобно, когда ставки растут.\n• Дисконтные облигации — не платят купон, но продаются дешевле номинала. Доход формируется за счёт разницы между ценой покупки и номиналом.\n\nПо валюте:\n• Рублёвые — нет валютного риска для тех, кто живёт в России.\n• Валютные — защищают от ослабления рубля, но несут риск колебаний курса.\nДля начинающего инвестора оптимальный старт — ОФЗ с постоянным купоном. Они понятны, надёжны и позволяют привыкнуть к механизму работы облигаций без лишнего риска.'
    },
    {
      title: 'Почему цена облигации меняется',
      content: 'Многие думают: если облигация — это долг с фиксированным купоном, то её цена должна быть стабильной. На практике это не так. Цена облигации на бирже постоянно колеблется, и главная причина — изменение процентных ставок в экономике.\n\nРаботает обратная зависимость: когда ставки растут, старые облигации с более низким купоном становятся менее привлекательными, и их цена падает. Когда ставки падают, старые облигации с высоким купоном становятся ценнее, и их цена растёт.\n\nПример. Вы купили облигацию с купоном 7% годовых. Через год Центробанк поднял ключевую ставку, и новые облигации стали выпускать с купоном 10%. Ваши 7% уже не так интересны инвесторам, поэтому цена вашей облигации снизится, чтобы её доходность сравнялась с новыми выпусками.\n\nКроме ставок, на цену влияют:\n• кредитный рейтинг эмитента (если у компании проблемы, её облигации дешевеют);\n• инфляционные ожидания (если инфляция растёт, фиксированный купон теряет ценность);\n• спрос и предложение на рынке (крупные покупки или продажи сдвигают цену);\n• геополитика и макроэкономические новости.\n\nВажный момент: если вы держите облигацию до погашения, колебания цены для вас не так важны. Вы всё равно получите номинал и все купоны. Но если вы захотите продать раньше, рыночная цена будет иметь значение.'
      ,image: {
      src: Рисунок17,
      alt: 'Инфляция',
      caption: ' '
    },},
    {
      title: 'Доходность облигации: что смотреть',
      content: 'Новички часто смотрят только на размер купона: «Эта облигация платит 10%, беру». Но реальная доходность складывается из нескольких компонентов.\n\nКупонная доходность — это процент от номинала, который платит эмитент. Но если вы купили облигацию не по номиналу, а дешевле или дороже, ваша фактическая доходность будет другой.\n\nДоходность к погашению — более точный показатель. Он учитывает и купоны, и разницу между ценой покупки и номиналом, и срок до погашения. Именно на этот параметр стоит ориентироваться при сравнении облигаций.\n\nНКД (накопленный купонный доход) — часть купона, которая уже «набежала», но ещё не выплачена. При покупке облигации вы платите продавцу эту сумму сверх цены. Это нормально: он держал бумагу часть периода и заслужил пропорциональную часть купона. При следующей выплате вы получите весь купон целиком, таким образом компенсируя свои затраты.\n\nПростой чек-лист при выборе облигации:\n• Смотреть доходность к погашению, а не только купон.\n• Проверять кредитный рейтинг эмитента.\n• Оценивать срок: соответствует ли он вашим целям.\n• Учитывать налоги и комиссии брокера.\n• Понимать, будете ли вы держать до погашения или, возможно, продадите раньше.'
    },
    {
      title: 'Риски облигаций',
      content: 'Облигации считаются надёжным инструментом, но риск есть всегда.\n\nКредитный риск — вероятность, что эмитент не сможет выплатить долг или купон. У государства он минимален, у компании — зависит от её финансового положения. Перед покупкой корпоративных облигаций стоит проверить, насколько устойчив бизнес.\n\nПроцентный риск — уже описанная выше зависимость цены от ставок. Если вам придётся продать облигацию раньше срока, а ставки за это время выросли, вы можете получить убыток.\n\nИнфляционный риск — если купон ниже инфляции, вы формально зарабатываете, но реально теряете покупательную способность. Для защиты от этого существуют облигации с индексацией к инфляции.\n\nВалютный риск — актуален для валютных облигаций. Если вы купили долларовую облигацию, а рубль укрепился, при конвертации вы получите меньше рублей, даже если сама облигация не изменилась в цене.\n\nРиск ликвидности — некоторые облигации, особенно маленьких компаний, сложно быстро продать по справедливой цене. Спред между ценой покупки и продажи может быть большим.\n\nХорошая новость: большинство этих рисков можно снизить. Диверсификация по эмитентам, выбор надёжных выпусков, держание до погашения — всё это делает инвестиции в облигации предсказуемыми и комфортными.'
    },
    {
      title: 'Кому подходят облигации',
      content: 'Облигации — универсальный инструмент, но особенно они полезны в нескольких ситуациях.\n\nЕсли вы консервативный инвестор и не готовы к резким колебаниям стоимости, облигации дадут спокойствие. Их цена меняется плавнее, чем у акций, а купоны обеспечивают регулярный доход.\n\nЕсли вы копите на конкретную цель с известным сроком (покупка квартиры через три года, оплата образования через пять), облигации с подходящим сроком погашения помогут сохранить капитал и получить предсказуемый результат.\n\nЕсли вы формируете сбалансированный портфель, облигации выполняют роль «подушки». Когда акции падают, облигации часто держатся стабильнее или даже растут, сглаживая общую волатильность портфеля.\n\nЕсли вы только начинаете и хотите привыкнуть к рынку без лишнего стресса, облигации — отличный старт. Они учат дисциплине, пониманию доходности и работе с брокерским счётом, не подвергая капитал высоким рискам.'
    },
    {
      title: 'С чего начать',
      content: 'Покупка первой облигации не требует сложных действий.\n\nОткройте брокерский счёт, если ещё не сделали этого. Большинство банков и брокеров позволяют купить облигацию в несколько кликов через мобильное приложение.\n\nВыберите тип облигации. Для старта подойдут ОФЗ с постоянным купоном и сроком погашения, соответствующим вашим целям.\n\nПроверьте параметры выпуска: доходность к погашению, дату следующего купона, минимальный лот (обычно одна облигация стоит около 1000 рублей).\n\nКупите облигацию. При покупке вы заплатите цену плюс НКД. Купон придёт на счёт в дату выплаты, номинал вернётся в дату погашения.\n\nНе обязательно покупать много разных выпусков сразу. Начните с одной-двух облигаций, чтобы понять механику. Потом постепенно расширяйте набор.'
    },
    {
      title: 'Заключение',
      content: 'Облигации — это не скучный инструмент для тех, кто боится риска. Это предсказуемый способ получать доход, сохранять капитал и балансировать портфель. Они не обещают сверхприбыли, но и не подвергают вас экстремальным колебаниям.\n\nГлавное, что нужно запомнить: облигация — это долг, а не доля. Вы не владеете бизнесом, вы даёте деньги в долг. Доход складывается из купонов и, возможно, разницы между ценой покупки и номиналом. Цена облигации меняется из-за ставок, но если держать до погашения, эти колебания не так важны.\n\nОблигации не заменят полностью акции, но и не должны игнорироваться. В сбалансированном портфеле они выполняют свою роль: обеспечивают стабильность, регулярный доход и защиту от резких движений рынка. Понимание этого инструмента — важный шаг к осознанному инвестированию.\n\nВ следующей статье мы поговорим об ETF и инвестиционных фондах — инструментах, которые позволяют купить сразу много активов одной покупкой. Это откроет новые возможности для диверсификации и упростит управление портфелем.'
    }
  ]
},
5: {
title: 'ETF и фонды',
  sections: [
    {
      title: 'Введение',
      content: 'Представьте, что вы хотите попробовать разные фрукты, но не знаете, какие вам понравятся. Можно купить по одному яблоку, груше, апельсину — это долго, дорого и неудобно. А можно взять готовую фруктовую корзину, где уже есть понемногу всего. Примерно так работают инвестиционные фонды и ETF. Вместо того чтобы покупать акции десятков компаний по отдельности, вы покупаете один инструмент, который уже содержит в себе целый набор активов.\n\nДля новичка это может звучать как идеальное решение: просто, удобно, не нужно разбираться в каждой компании. Но за внешней простотой скрываются важные детали: какие бывают фонды, чем они отличаются, сколько за это берут комиссии и как не запутаться в многообразии вариантов. В этой статье разберёмся, что такое ETF и инвестиционные фонды, как они устроены и когда их стоит использовать в своём портфеле.'
,image: {
      src: Рисунок25,
      alt: 'Инфляция',
      caption: ' '
    },},
    {
      title: 'Что такое фонд простыми словами',
      content: 'Инвестиционный фонд — это «общий котёл», в который складывают деньги множество инвесторов. Эти деньги профессиональные управляющие вкладывают в разные активы: акции, облигации, товары. Каждый инвестор владеет не самими акциями, а долей в фонде — паем или акцией фонда.\n\nПредставьте, что вы с друзьями скинулись по тысяче рублей и наняли повара, чтобы он купил продукты и приготовил ужин на всех. Вы не выбираете каждый ингредиент сами, но в итоге получаете готовое блюдо. Так и с фондом: вы доверяете управление профессионалам или алгоритму, а взамен получаете диверсифицированный портфель без необходимости покупать каждую бумагу отдельно.\n\nГлавное преимущество фонда — диверсификация. Покупая один пай, вы автоматически вкладываетесь в десятки или сотни компаний. Если одна из них просядет, другие могут это компенсировать. Это снижает риск по сравнению с покупкой акций одной компании.'
    },
    {
      title: 'Чем отличаются ETF от обычных фондов',
      content: 'Не все фонды одинаковы. Два основных типа, с которыми столкнётся частный инвестор, — это взаимные фонды (ПИФы в России) и биржевые фонды (ETF).\n\nВзаимные фонды управляются активно. Управляющий сам решает, какие бумаги покупать и продавать, пытаясь обыграть рынок. За эту работу берётся комиссия, обычно 1–3% в год. Проблема в том, что большинство активных управляющих на длинной дистанции не могут стабильно обгонять рынок, а комиссии при этом съедают часть дохода.\n\nETF (биржевые фонды) работают иначе. Они не пытаются обыграть рынок, а просто копируют его. Например, фонд может повторять состав индекса Московской биржи или американского S&P 500. Покупая такой фонд, вы получаете результат рынка минус небольшая комиссия (обычно 0,1–0,5% в год).\n\nЕщё одно важное отличие — способ покупки. ПИФы покупаются и продаются по цене, которая рассчитывается раз в день. ETF торгуются на бирже как обычные акции: цена меняется в реальном времени, купить или продать можно в любой момент торговой сессии.'
    ,image: {
      src: Рисунок30,
      alt: 'Инфляция',
      caption: ' '
    },},
    {
      title: 'Какие бывают фонды',
      content: 'Фонды различаются по тому, во что они инвестируют. Понимание этих категорий помогает выбрать подходящий инструмент.\n\nФонды акций инвестируют в акции компаний. Они могут следовать за широким рынком (все крупные компании страны) или фокусироваться на отрасли: технологии, здравоохранение, энергетика. Такие фонды подходят для долгосрочного роста, но несут риски, характерные для акций.\n\nФонды облигаций вкладывают деньги в государственные или корпоративные долговые бумаги. Они менее волатильны, приносят регулярный доход через купоны и подходят для консервативной части портфеля.\n\nСмешанные фонды держат и акции, и облигации в определённой пропорции. Например, 60% акций и 40% облигаций. Это готовый сбалансированный портфель в одном инструменте.\n\nОтраслевые и тематические фонды фокусируются на конкретной теме: искусственный интеллект, зелёная энергетика, кибербезопасность. Они могут показать высокий рост, но несут повышенный риск из-за узкой специализации.\n\nВалютные и товарные фонды инвестируют в валюты, золото, нефть или другие сырьевые активы. Они часто используются для защиты от инфляции или диверсификации.\n\nДля новичка оптимальный старт — широкий фонд акций или смешанный фонд с низкой комиссией. Они дают диверсификацию, понятную логику и не требуют постоянного внимания.'
    },
    {
      title: 'Почему комиссии имеют значение',
      content: 'Одна из главных ловушек при выборе фонда — смотреть только на доходность, игнорируя расходы. Комиссия фонда (расходы фонда или expense ratio) вычитается из стоимости активов автоматически. Вы не платите её отдельно, но она снижает ваш итоговый доход.\n\nРазница между 0,2% и 2% в год кажется небольшой. Но за двадцать лет при доходности 8% годовых эта разница превращается в десятки процентов итогового капитала. Фонд с низкой комиссией часто обгоняет фонд с высокой комиссией не потому, что лучше инвестирует, а потому, что меньше забирает.\n\nКроме комиссии фонда, есть и другие расходы: комиссия брокера за сделку, налоги, спреды. Перед покупкой стоит проверить:\n\n• Какой размер комиссии у фонда.\n• Как часто фонд проводит ребалансировку и есть ли скрытые издержки.\n• Какие налоги применяются к выплатам фонда в вашей юрисдикции.\n\nПростое правило: при прочих равных выбирайте фонд с более низкой комиссией. На длинной дистанции это существенно повлияет на результат.'
    },
    {
      title: 'Как фонд выбирает активы',
      content: 'Механизм отбора активов зависит от стратегии фонда.\n\nПассивные фонды следуют за индексом. Они покупают те же бумаги, что и в индексе, в тех же пропорциях. Решение принимает не человек, а алгоритм. Такие фонды прозрачны, предсказуемы и дёшевы в управлении.\n\nАктивные фонды полагаются на решение управляющего. Он анализирует компании, прогнозирует тренды и пытается выбрать лучшие бумаги. Теоретически это может дать преимущество, но на практике большинство активных фондов не обгоняют пассивные аналоги после учёта комиссий.\n\nСмарт-бета фонды занимают промежуточное положение. Они используют правила для отбора бумаг, но не копируют индекс слепо. Например, могут отбирать компании с низкой волатильностью или высоким дивидендом. Это попытка получить лучшее из двух миров, но такие стратегии тоже не гарантируют успеха.\n\nНовичку проще начать с пассивного фонда: он понятнее, дешевле и не требует веры в гениальность управляющего.'
    },
    {
      title: 'Риски фондов',
      content: 'Фонды снижают одни риски, но не устраняют их полностью.\n\nРыночный риск остаётся: если падает весь рынок, упадёт и фонд, который его повторяет. Диверсификация защищает от краха одной компании, но не от системного кризиса.\n\nРиск ликвидности актуален для узкоспециализированных или маленьких фондов. Их может быть сложно быстро продать по справедливой цене, особенно в моменты паники на рынке.\n\nВалютный риск возникает, если фонд инвестирует в иностранные активы, а вы живёте в другой стране. Колебания курса могут усилить или ослабить ваш результат.\n\nРиск отслеживания (tracking error) — это когда фонд не точно повторяет индекс, за которым следует. Причины могут быть разными: комиссии, задержки в ребалансировке, ограничения на покупку некоторых бумаг.\n\nКредитный риск касается фондов облигаций: если эмитенты, в которые вложен фонд, столкнутся с проблемами, это отразится на стоимости пая.\n\nХорошая новость: большинство этих рисков можно контролировать. Выбор широких, ликвидных фондов с низкой комиссией, понимание валютной экспозиции и долгосрочный горизонт делают инвестиции в фонды предсказуемыми и комфортными.'
    ,image: {
      src: Рисунок31,
      alt: 'Инфляция',
      caption: ' '
    },},
    {
      title: 'С чего начать',
      content: 'Покупка первого фонда не требует сложных действий.\n\nОпределитесь с целью. Копите на пенсию через двадцать лет? Присмотритесь к фонду акций. Нужна стабильность на горизонте трёх лет? Рассмотрите фонд облигаций или смешанный фонд.\n\nВыберите тип фонда. Для старта подойдёт пассивный ETF на широкий индекс с низкой комиссией. В России это, например, фонды на индекс Мосбиржи. Для международного разнообразия — фонды на глобальные индексы.\n\nПроверьте параметры: комиссия, размер фонда (крупные фонды обычно ликвиднее), валюта, способ распределения дохода (накапливающий или выплачивающий).\n\nКупите фонд через брокерское приложение. Процесс такой же, как покупка акции: находите тикер, указываете количество, подтверждаете сделку.\n\nНе обязательно вкладывать всё сразу. Можно начать с небольшой суммы, привыкнуть к колебаниям стоимости пая, а потом постепенно увеличивать позицию.'
    },
    {
      title: 'Заключение',
      content: 'ETF и инвестиционные фонды — это не волшебная таблетка, но мощный инструмент в руках осознанного инвестора. Они дают диверсификацию одной покупкой, экономят время на анализ отдельных компаний и позволяют начать инвестировать с небольшой суммы.\n\nГлавное, что нужно запомнить: фонд не отменяет необходимости понимать, во что вы вкладываете. Низкая комиссия, широкая диверсификация и соответствие вашим целям — три критерия, которые стоит проверять перед покупкой. Фонды не гарантируют прибыль, но они делают путь к финансовым целям более предсказуемым и управляемым.\n\nНе обязательно выбирать между акциями и фондами. Многие инвесторы комбинируют оба подхода: ядро портфеля строят на широких фондах, а небольшую часть выделяют на отдельные идеи. Такой гибридный подход даёт и стабильность, и возможность для точечных решений.\n\nВ следующей статье мы поговорим о цифровых и защитных активах — инструментах, которые ведут себя иначе, чем классические ценные бумаги, и часто используются для диверсификации или защиты в нестабильные времена.'
    }
  ]
},
6: {
  title: 'Инвестиционный портфель',
  sections: [
    {
      title: 'Введение',
      content: 'Представьте, что вы собираетесь в поход. Вы не берёте с собой только воду или только еду. Вы кладёте в рюкзак разное: воду, перекус, дождевик, аптечку, карту. Каждый предмет выполняет свою задачу, и вместе они повышают шансы на успешное путешествие. Инвестиционный портфель работает похожим образом. Это не случайный набор активов, а продуманная комбинация инструментов, где каждый элемент играет свою роль.\n\nМногие новички начинают инвестировать, покупая первую попавшуюся акцию или фонд. Со временем таких покупок накапливается несколько, и возникает ощущение, что портфель «как-то сам сложился». Но портфель, который формируется без плана, часто оказывается несбалансированным: слишком много риска в одной части, слишком мало защиты в другой, а цели при этом остаются размытыми. В этой статье разберём, что такое инвестиционный портфель, зачем он нужен, как его собирать и как поддерживать в рабочем состоянии, чтобы он помогал достигать финансовых целей, а не создавал лишние проблемы.'
        ,image: {
      src: Рисунок21,
      alt: 'Инфляция',
      caption: ' '
    },},
    {
      title: 'Что такое портфель и зачем он нужен',
      content: 'Инвестиционный портфель — это совокупность всех ваших активов: акций, облигаций, фондов, валюты и других инструментов. Но важно понимать: портфель — это не просто список того, что вы купили. Это система, в которой каждый элемент подобран под определённую цель.\n\nЗачем вообще думать о портфеле, а не просто покупать то, что нравится? Потому что отдельные активы ведут себя по-разному. Акции могут расти, но сильно колебаться. Облигации стабильнее, но приносят меньше. Золото защищает в кризис, но не растёт в спокойные времена. Если держать только один тип активов, вы становитесь зависимы от его поведения. Портфель позволяет сгладить эти колебания: когда один инструмент проседает, другой может расти или оставаться стабильным.\n\nЕщё одна причина — цели. Вы копите на пенсию через двадцать лет? Вам подойдёт портфель с упором на рост. Собираете на машину через три года? Нужна большая доля стабильных инструментов. Портфель помогает согласовать ваши инвестиции с вашими планами.'
    },
    {
      title: 'Из чего состоит портфель',
      content: 'Структура портфеля зависит от ваших целей, отношения к риску и горизонта инвестирования. Но есть базовые компоненты, которые встречаются в большинстве сбалансированных портфелей.\n\nАкции отвечают за рост. На длинных отрезках времени они исторически показывают доходность выше инфляции. Но они же несут наибольшую волатильность: цена может сильно меняться. Доля акций в портфеле обычно выше у тех, кто инвестирует надолго и готов к временным просадкам.\n\nОблигации обеспечивают стабильность. Они приносят регулярный доход через купоны и меньше колеблются в цене. Облигации часто выполняют роль «подушки»: когда акции падают, облигации помогают сдержать общую просадку портфеля.\n\nФонды и ETF упрощают диверсификацию. Вместо покупки десятков отдельных акций можно купить один фонд, который уже содержит широкий набор бумаг. Это экономит время и снижает риск ошибки при выборе отдельных компаний.\n\nЗащитные активы — золото, валюта, инфляционные облигации — помогают сохранить капитал в нестабильные времена. Они не всегда растут, но часто ведут себя иначе, чем традиционный рынок, что полезно для баланса.\n\nДенежная часть — небольшой остаток в рублях или валюте на случай возможностей или непредвиденных расходов. Это не инвестиция в полном смысле, но важная часть управления ликвидностью.\n\nПропорции этих компонентов и определяют характер портфеля. Консервативный портфель может содержать 70% облигаций и 30% акций. Умеренный — 50 на 50. Агрессивный — 80% акций и 20% остальных инструментов. Нет «правильной» формулы для всех — есть та, которая подходит именно вам.'
    },
    {
      title: 'Как определить свою структуру',
      content: 'Выбор пропорций — не математическая задача, а вопрос самопознания. Начните с трёх простых вопросов.\n\nКакова ваша цель? Если вы копите на пенсию, у вас есть время переживать колебания рынка. Если деньги понадобятся через год-два, стабильность важнее потенциального роста.\n\nКак вы реагируете на просадки? Представьте, что ваш портфель упал на 20%. Вы будете паниковать и продавать? Или спокойно продолжите плановые покупки? Честный ответ поможет выбрать подходящий уровень риска.\n\nКакой у вас горизонт? Чем дольше вы готовы держать активы, тем больше риска можно себе позволить. Краткосрочные вложения требуют предсказуемости, долгосрочные — терпения.\n\nНе обязательно сразу попасть в идеальную структуру. Можно начать с простой модели: например, 60% акций через широкий фонд, 30% облигаций, 10% защитных активов. Потом, по мере опыта и изменения обстоятельств, корректировать пропорции.'
        ,image: {
      src: Рисунок22,
      alt: 'Инфляция',
      caption: ' '
    },},
    {
      title: 'Как собирать портфель на практике',
      content: 'Сборка портфеля не требует сложных действий. Вот примерный алгоритм для новичка.\n\nОпределите общую сумму, которую готовы инвестировать. Не вкладывайте последние деньги — инвестируйте только свободный капитал.\n\nВыберите брокера и откройте счёт. Если планируете использовать ИИС для налоговых льгот, оформите его сразу.\n\nПодберите инструменты под каждую часть портфеля. Для акций — широкий индексный фонд или несколько крупных компаний. Для облигаций — ОФЗ или надёжные корпоративные выпуски. Для защиты — золото через фонд или валюту.\n\nКупите активы в нужных пропорциях. Не обязательно делать всё за один день — можно распределить покупки на несколько недель, чтобы сгладить момент входа.\n\nЗафиксируйте план. Запишите, какие доли вы выбрали и почему. Это поможет не поддаваться эмоциям, когда рынок начнёт колебаться.\n\nНе стремитесь к идеалу с первого раза. Лучше простой, но работающий портфель, чем сложный, который вы не понимаете и не можете поддерживать.'
    },
    {
      title: 'Ребалансировка: почему портфель нужно обновлять',
      content: 'Со временем структура портфеля меняется сама собой. Представьте, что вы начали с пропорции 60% акций и 40% облигаций. Если акции выросли сильнее облигаций, через год у вас может оказаться 70% акций и 30% облигаций. Портфель стал более рискованным, чем вы планировали.\n\nРебалансировка — это процесс возврата к исходным пропорциям. Вы продаёте часть подорожавших активов и докупаете те, что отстали. Это звучит как «продавать дорогое и покупать дешёвое» — и это действительно одна из дисциплинированных стратегий управления портфелем.\n\nКак часто проводить ребалансировку? Есть два подхода. По времени — например, раз в год. По отклонению — когда доля какого-то актива выходит за заранее установленные границы, скажем, ±5%.\n\nВажно: ребалансировка не должна превращаться в постоянную торговлю. Частые сделки увеличивают комиссии и налоги. Достаточно делать это осознанно и редко.'
        ,image: {
      src: Рисунок23,
      alt: 'Инфляция',
      caption: ' '
    },},
    {
      title: 'Частые ошибки при формировании портфеля',
      content: 'Даже с хорошим планом новички иногда наступают на одни и те же грабли.\n\nПерегрузка одним активом. Покупка акций одной компании или одной отрасли создаёт концентрацию риска. Если у этой компании возникнут проблемы, портфель пострадает сильно. Диверсификация — не просто слово, а защита.\n\nПогоня за доходностью. Выбор инструментов только по прошлой доходности — опасная стратегия. То, что росло вчера, не обязательно будет расти завтра. Важнее понимание логики и соответствия целям.\n\nИгнорирование расходов. Фонд с высокой комиссией может обесценить преимущество даже хорошей стратегии. Всегда проверяйте комиссии брокера и фондов.\n\nЭмоциональные изменения. Рынок упал — продать всё. Рынок вырос — купить ещё. Такие решения, принятые на эмоциях, часто разрушают долгосрочный план.\n\nОтсутствие плана ребалансировки. Портфель, который никогда не обновляется, со временем перестаёт соответствовать изначальным целям.\n\nИзбегать этих ошибок помогает простая привычка: перед любым действием спрашивать себя — это часть плана или реакция на эмоции?'
    },
    {
      title: 'Заключение',
      content: 'Инвестиционный портфель — это не статичный набор бумаг, а живая система, которая должна работать на ваши цели. Его сила не в том, чтобы каждый актив рос каждый день, а в том, чтобы разные инструменты дополняли друг друга и сглаживали колебания.\n\nГлавное, что нужно запомнить: портфель начинается с понимания себя — своих целей, сроков и отношения к риску. Структура должна быть простой настолько, чтобы вы её понимали, и сбалансированной настолько, чтобы вы могли спать спокойно. Регулярная, но нечастая ребалансировка помогает держать курс, а осознанность защищает от эмоциональных ошибок.\n\nНе обязательно создавать идеальный портфель с первого дня. Лучше начать с простой модели, протестировать её на практике и постепенно уточнять. Инвестиции — это путь, а не пункт назначения. Портфель — ваш компас на этом пути.\n\nВ следующей статье мы подробнее разберём диверсификацию — принцип, который лежит в основе устойчивого портфеля и помогает снижать риски без жертвования долгосрочной доходностью.'
    }
  ]
},
7: {
  title: 'Горизонт инвестирования',
  sections: [
    {
      title: 'Введение',
      content: 'Представьте, что вы собираетесь в путешествие. Если вы едете на выходные за город, вы берёте с собой лёгкий рюкзак с самым необходимым. Если отправляетесь в кругосветку на год, вы готовитесь иначе: изучаете маршрут, планируете бюджет, выбираете снаряжение, которое выдержит долгий путь. С инвестициями похожая история. Срок, на который вы вкладываете деньги, — это не просто цифра в календаре. Это фактор, который определяет, какие инструменты вам подходят, какой риск вы можете себе позволить и какую стратегию стоит выбрать.\n\nГоризонт инвестирования — это период времени, на который вы готовы вложить деньги без необходимости забирать их обратно. У кого-то это год-два: накопить на машину или первый взнос по ипотеке. У других — десять, двадцать лет и больше: подготовка к пенсии, образование детей, создание капитала для будущих поколений. В этой статье разберём, почему срок имеет такое значение, как он влияет на выбор инструментов и как определить свой горизонт, чтобы инвестиции работали на ваши цели, а не против них.'
    },
    {
      title: 'Почему срок меняет всё',
      content: 'Одна и та же сумма, вложенная на разный срок, может привести к совершенно разным результатам. Возьмём для примера две ситуации.\n\nАнна копит на первый взнос по ипотеке. Ей нужны деньги через два года. Она не может позволить себе рискнуть: если рынок упадёт за полгода до покупки квартиры, у неё не будет времени ждать восстановления. Поэтому Анна выбирает консервативные инструменты: облигации с погашением в нужный срок, банковские вклады, часть в валюте. Доходность будет умеренной, но предсказуемой.\n\nПётр готовится к пенсии. Ему пятьдесят лет, до выхода на заслуженный отдых — пятнадцать лет. Он может позволить себе более рискованные инструменты: акции, фонды, часть в защитных активах. Да, в отдельные годы его портфель может проседать. Но у него есть время переждать колебания и дождаться роста. На горизонте пятнадцати лет исторически акции показывают доходность выше инфляции, и Пётр рассчитывает на этот эффект.\n\nОдна и та же цель — финансовая независимость — но разные сроки требуют разных подходов. Горизонт инвестирования определяет допустимый уровень риска, выбор инструментов и ожидания по доходности.'
    },
    {
      title: 'Как срок влияет на выбор инструментов',
      content: 'Не все активы одинаково хорошо работают на разных горизонтах. Понимание этой связи помогает не ошибиться с выбором.\n\nКороткий горизонт (до 3 лет)\nНа коротком сроке главное — сохранение капитала и предсказуемость. Рынок может колебаться, и у вас нет времени ждать, пока просадка отыграется.\n\nПодходящие инструменты:\n• банковские вклады с фиксированной ставкой;\n• короткие облигации с погашением в нужный срок;\n• валюта для защиты от курсовых колебаний;\n• фонды денежного рынка.\n\nНеподходящие инструменты:\n• акции отдельных компаний — слишком волатильны;\n• криптовалюты — непредсказуемы;\n• длинные облигации — чувствительны к изменению ставок.\n\nСредний горизонт (3–7 лет)\nНа этом отрезке уже можно позволить себе умеренный риск. У вас есть время переждать временные просадки и получить доход выше инфляции.\n\nПодходящие инструменты:\n• сбалансированный портфель из акций и облигаций;\n• широкие индексные фонды;\n• корпоративные облигации надёжных эмитентов;\n• часть в защитных активах (золото, валюта).\n\nНеподходящие инструменты:\n• спекулятивные активы с высокой волатильностью;\n• узкоспециализированные фонды с высоким риском.\n\nДлинный горизонт (7+ лет)\nНа длинном сроке время работает в вашу пользу. Краткосрочные колебания сглаживаются, а эффект сложного процента набирает силу. Здесь можно позволить себе более агрессивную стратегию.\n\nПодходящие инструменты:\n• акции компаний и широкие фонды акций;\n• международная диверсификация;\n• часть в растущих, но рискованных активах (если вы их понимаете);\n• регулярное пополнение портфеля для усреднения.\n\nНеподходящие инструменты: инструменты с фиксированным низким доходом, которые не опережают инфляцию на длинной дистанции.'
    },
    {
      title: 'Как определить свой горизонт',
      content: 'Определение горизонта инвестирования — это не только вопрос календаря. Это честный разговор с самим собой о целях, возможностях и ограничениях.\n\nНачните с цели. На что вы копите? Покупка машины через три года — это один горизонт. Подготовка к пенсии через двадцать лет — другой. Образование детей, которое начнётся через десять лет, — третий. Каждая цель имеет свой срок, и под каждую можно формировать отдельную часть портфеля.\n\nОцените свою финансовую устойчивость. Есть ли у вас подушка безопасности на три-шесть месяцев жизни? Если нет, то даже длинный горизонт не спасёт: при непредвиденных расходах вам придётся продавать активы, возможно, в неудачный момент. Сначала создайте запас, потом инвестируйте.\n\nПодумайте о своей психологической готовности. Даже если формально у вас длинный горизонт, но вы не спите ночами при виде просадки в портфеле, возможно, стоит выбрать более консервативную стратегию. Срок — это не только внешние обстоятельства, но и ваша внутренняя устойчивость.\n\nНе обязательно иметь один горизонт на всё. У вас может быть несколько целей с разными сроками. В этом случае логично разделить капитал: часть — на короткий срок с консервативными инструментами, часть — на длинный с более рискованными. Так вы балансируете между предсказуемостью и потенциалом роста.'
    },
    {
      title: 'Что делать, если горизонт меняется',
      content: 'Жизнь не статична. Планы корректируются, цели сдвигаются, обстоятельства меняются. И горизонт инвестирования — не исключение.\n\nЕсли срок сокращается. Представьте, что вы копили на квартиру через пять лет, но нашли отличный вариант, который нужно купить через год. В этом случае стоит пересмотреть структуру портфеля: снизить долю рискованных активов, зафиксировать прибыль, перевести часть в более предсказуемые инструменты. Лучше немного недополучить доход, чем потерять капитал в неудачный момент.\n\nЕсли срок удлиняется. Бывает и наоборот: цель отодвигается, или появляется новая, более долгосрочная. Это возможность постепенно увеличить долю растущих активов, добавить международную диверсификацию, пересмотреть стратегию в сторону большего потенциала.\n\nГлавное — не игнорировать изменения. Регулярно, хотя бы раз в год, пересматривайте свои цели и сроки. Инвестиционный план должен быть гибким, но не хаотичным.'
,image: {
      src: Рисунок24,
      alt: 'Инфляция',
      caption: ' '
    },},
    {
      title: 'Распространённые ошибки, связанные со сроком',
      content: 'Даже понимая важность горизонта, новички иногда наступают на одни и те же грабли.\n\nИнвестиции «на всякий случай» без срока. Человек откладывает деньги, но не определяет, зачем и когда они понадобятся. В итоге портфель формируется наугад: то ли консервативно, то ли агрессивно. Без чёткого срока сложно выбрать правильную стратегию.\n\nИгнорирование инфляции на коротком сроке. Некоторые думают: «Раз деньги нужны скоро, положу их на обычный счёт». Но даже за год-два инфляция может съесть часть покупательной способности. Короткий горизонт не означает игнорирование доходности — просто приоритеты смещаются в сторону надёжности.\n\nСлишком консервативная стратегия на длинном сроке. Если вы копите на пенсию через двадцать лет, но держите всё в вкладах под 6% при инфляции 7%, вы постепенно теряете реальную стоимость капитала. Длинный горизонт — это возможность использовать рост, а не повод бояться любого риска.\n\nЭмоциональная смена стратегии при колебаниях. Рынок упал — человек решает, что «долгосрочно больше не работает», и продаёт активы. Это ошибка: горизонт не меняется из-за краткосрочных движений рынка. План должен быть устойчивее эмоций.'
    },
    {
      title: 'Практические шаги для старта',
      content: 'Если вы хотите применить принцип горизонта инвестирования, но не знаете, с чего начать, вот простой алгоритм.\n\nЗапишите свои финансовые цели. Для каждой укажите примерный срок достижения: год, три года, десять лет.\n\nОцените, сколько вы готовы вкладывать в каждую цель. Не обязательно распределять всё сразу — можно начать с одной.\n\nПодберите инструменты под каждый срок. Короткий — консервативные, длинный — с потенциалом роста.\n\nЗафиксируйте план. Запишите, почему вы выбрали те или иные инструменты и как будете реагировать на изменения.\n\nПересматривайте раз в год. Цели могут сдвигаться, обстоятельства — меняться. Регулярная проверка помогает держать курс.\n\nНе обязательно делать всё идеально с первого раза. Лучше простой план, которому вы следуете, чем сложная стратегия, которую вы бросаете при первой трудности.'
    },
    {
      title: 'Заключение',
      content: 'Горизонт инвестирования — это не просто дата в календаре. Это компас, который помогает выбирать направление. Он определяет, какой риск вы можете себе позволить, какие инструменты подходят вашим целям и как реагировать на колебания рынка.\n\nГлавное, что нужно запомнить: срок меняет правила игры. То, что работает на двадцати годах, не подходит для двух. То, что безопасно на короткой дистанции, может быть недостаточно эффективным на длинной. Понимание этой связи помогает не путать стратегии и не ждать от инструментов того, что они не могут дать.\n\nНе обязательно иметь идеальный план с первого дня. Начните с одной цели, одного срока, одного простого решения. Со временем вы добавите новые элементы, уточните пропорции, найдёте баланс, который будет работать именно для вас. Горизонт инвестирования — это не ограничение, а возможность выстроить стратегию, которая ведёт к вашим целям с осознанностью и уверенностью.\n\nВ следующей, заключительной статье мы поговорим о рыночных изменениях — о том, почему цены постоянно колеблются, как реагировать на новости и кризисы, и как сохранять хладнокровие, когда рынок живёт своей жизнью. Это поможет вам завершить базовое понимание инвестиций и перейти к осознанной практике.'
    }
  ]
}
  };

  const currentContent = articleContent[id] || articleContent[1];
  const articleTitleDisplay = currentContent?.title || articleTitle;


const modulesData = {
  1: {
    title: 'Модуль 1 - Введение в финансы',
    articles: [
      { id: 1, number: '1', title: 'Что такое финансовая грамотность?' },
      { id: 2, number: '2', title: 'Основы бюджетирования' }
    ]
  },
  2: {
    title: 'Модуль 2 - Инвестиции',
    articles: [
      { id: 3, number: '3', title: 'Почему важно инвестировать?' },
      { id: 4, number: '4', title: 'Виды инвестиций' },
      { id: 5, number: '5', title: 'Как выбрать брокера?' }
    ]
  },
  3: {
    title: 'Модуль 3 - Кредиты и налоги',
    articles: [
      { id: 6, number: '6', title: 'Виды кредитов' },
      { id: 7, number: '7', title: 'Налоговые вычеты' }
    ]
  }
};

// Функция для определения текущего модуля по ID статьи
// Функция для определения текущего модуля по ID статьи
const getCurrentModuleByArticleId = (articleId) => {
  // Статья 1 и 2 - модуль 1
  if (articleId >= 1 && articleId <= 2) return 1;
  // Статья 3, 4, 5 - модуль 2
  if (articleId >= 3 && articleId <= 5) return 2;
  // Статья 6, 7 - модуль 3
  if (articleId >= 6 && articleId <= 7) return 3;
  return 1; // по умолчанию модуль 1
};

const currentModuleId = getCurrentModuleByArticleId(parseInt(id));
const currentModuleData = modulesData[currentModuleId];

// Данные для отображения в правом сайдбаре
const moduleArticles = currentModuleData.articles;
const currentModule = currentModuleId;
const currentModuleTitle = currentModuleData.title;

  const contentsItems = currentContent.sections.map((section, index) => ({
    id: index,
    title: section.title,
    type: 'inactive'
  }));

const getContentsItemType = (index) => {
  // Если это последняя секция и мы внизу страницы - делаем её активной
  if (index === activeSection) {
    return 'active';
  } else if (index === activeSection - 1 || index === activeSection + 1) {
    return 'default';
  } else {
    return 'inactive';
  }
};

  const scrollToSection = (index) => {
    const section = sectionRefs.current[index];
    if (section && containerRef.current) {
      const offsetTop = section.offsetTop - 100;
      containerRef.current.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <div className="article-layout">
      {/* Левая часть - контент статьи */}
      <div className="article-main" ref={containerRef}>
        <div className="article-container">
          {/* Карточка 1: Содержание статьи */}
          <div className="article-module-card">
            <div className="article-header">
              <button className="article-back-button" onClick={handleBack}>
                <IconArrowLeft size={20} strokeWidth={2} color="#1a1a1a" />
                <span>Назад</span>
              </button>
              <h1 className="article-title">{articleTitleDisplay}</h1>
            </div>
            <div className="article-divider"></div>
            
<div className="article-content">
  {currentContent?.sections?.map((section, index) => (
    <div key={index} ref={el => sectionRefs.current[index] = el} className="article-section">
      {section.title && <h2>{section.title}</h2>}
      {section.content && <p>{section.content}</p>}
      {/* ДОБАВЬТЕ ЭТОТ БЛОК ДЛЯ КАРТИНОК */}
      {section.image && (
        <div className="article-image-container">
          <img src={section.image.src} alt={section.image.alt} className="article-image" />
          <div className="article-image-caption">{section.image.caption}</div>
        </div>
      )}
    </div>
  ))}
</div>
            
{/* Кнопки навигации между статьями */}
<div className="article-navigation">
  <button 
    className="article-nav-btn prev-btn" 
    onClick={() => {
      const prevId = parseInt(id) - 1;
      if (prevId >= 1) navigate(`/article/${prevId}`);
    }}
    disabled={parseInt(id) === 1}
  >
<img src={ArrowLeftIcon} alt="→" className="btn-icon" />
    Предыдущая статья
  </button>
  <button 
    className={`article-nav-btn prev-btn ${!isCurrentArticleCompleted() ? 'blocked' : ''}`}
    onClick={() => {
      if (!isCurrentArticleCompleted()) {
        return;
      }
      const nextId = parseInt(id) + 1;
      if (nextId <= 7) navigate(`/article/${nextId}`);
    }}
    disabled={parseInt(id) === 7}
  >
    Следующая статья <img src={ArrowRightIcon} alt="→" className="btn-icon" />
  </button>
</div>
          </div>

          {/* Карточка 2: Проверь себя */}
          <div className="article-module-card quiz-module-card">
            {!quizCompleted ? (
              <>
                <div className="quiz-header">
                  <div className="quiz-icon">
                    <div className="yellow-circle-icon">
<img src={QuizIcon} 
    alt="Quiz" 
    width="17" 
    height="17" 
    style={{ transform: 'translateZ(6px)' }}  />
                    </div>
                  </div>
                  <div className="quiz-info">
                    <h2 className="quiz-title">Проверь себя</h2>
                    <p className="quiz-questions-count">{totalQuestions} вопроса</p>
                  </div>
                </div>

                <div className="quiz-progress">
                  <div className="progress-dots">
                    {[...Array(totalQuestions)].map((_, idx) => (
                      <div key={idx} className={`progress-dot ${idx <= currentQuestion ? 'active' : ''}`} style={{ width: idx === currentQuestion ? '32px' : '8px' }}></div>
                    ))}
                  </div>
                  <div className="progress-text">Вопрос {currentQuestion + 1} из {totalQuestions}</div>
                </div>

                <div className={`quiz-question-card ${animateDirection === 'next' ? 'slide-left' : animateDirection === 'prev' ? 'slide-right' : ''}`}>
                  <div className="question-header">
                    <div className="question-number"><span>{currentQuestion + 1}</span></div>
                    <div className="question-text-wrapper">
                      <p className="question-text">{currentQ.text}</p>
                      <span className="question-subtext">{currentQ.subtext}</span>
                    </div>
                  </div>
                  <div className="quiz-options-list">
                    {quizOptions.map((option) => (
                      <label key={option.id} className={`quiz-option ${option.checked ? 'checked' : ''}`}>
                        <input type="checkbox" checked={option.checked} onChange={() => toggleQuizOption(option.id)} className="quiz-checkbox-input" />
                        <div className={`quiz-checkbox ${option.checked ? 'checked' : ''}`}>
                          {option.checked && <span className="check-mark">✓</span>}
                        </div>
                        <span className="quiz-option-text">{option.text}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="quiz-navigation">
                  {currentQuestion > 0 && (
<button 
  className="quiz-nav-btn prev" 
  onClick={handlePrevQuestion}
  disabled={isAnimating}
>
  <img src={ArrowLeftIcon} alt="←" className="btn-icon-left" />
  Назад
</button>
                  )}
<button 
  className={`quiz-next-btn ${currentQuestion === 0 ? 'alone' : ''}`} 
  onClick={handleNextQuestion} 
  disabled={isAnimating}
>
  {currentQuestion === totalQuestions - 1 ? (
    <>
      Завершить
      <img src={CheckIcon} alt="✓" className="btn-icon" />
    </>
  ) : (
    <>
      Дальше
      <img src={ArrowRightIcon} alt="→" className="btn-icon" />
    </>
  )}
</button>
                </div>
              </>
            ) : (
              <div className={`quiz-results ${resultsAnimation ? 'animate-in' : ''}`}>
                <div className="results-header">
                  <div className="score-circle">
                    <div className="score-value">{quizScore}</div>
                  </div>
                  <h2 className="results-title">Тест пройден!</h2>
                  <p className="results-description">
                    Отличная работа! Вы успешно завершили тест по теме «{articleTitleDisplay}»
                  </p>
                </div>

                <div className="results-stats">
                  <div className="stat-card correct">
                    <div className="stat-value">{quizStats.correct}</div>
                    <div className="stat-label">правильных</div>
                  </div>
                  <div className="stat-card wrong">
                    <div className="stat-value">{quizStats.wrong}</div>
                    <div className="stat-label">с ошибкой</div>
                  </div>
                  <div className="stat-card percentage">
                    <div className="stat-value">{quizStats.percentage}%</div>
                    <div className="stat-label">результат</div>
                  </div>
                </div>

                <div className="results-actions">
                  <button className="retry-btn" onClick={handleRetryQuiz}>
                    <span className="retry-icon">↻</span>
                    Пройти заново
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Правая часть - сайдбар */}
      <div className="article-sidebar">
        <div className="sidebar-contents">
          <div className="contents-header">
            <span className="contents-title">СОДЕРЖАНИЕ</span>
          </div>
          <div className="contents-list">
            {contentsItems.map((item, index) => {
              const itemType = getContentsItemType(index);
              return (
                <div key={item.id} className={`contents-item contents-item-${itemType}`} onClick={() => scrollToSection(index)}>
                  <span className="contents-dot"></span>
                  <span className="contents-item-title">{item.title}</span>
                </div>
              );
            })}
          </div>
        </div>

<div className="sidebar-bottom">
  <div className="sidebar-bottom-content">
    <div className="module-articles-header">
      <span className="module-articles-title">СТАТЬИ МОДУЛЯ {currentModule}</span>
    </div>
    <div className="module-articles-list">
      {moduleArticles.map(article => {
        const articleProgress = getArticleProgress(article.id);
        const isCompleted = articleProgress >= 100;
        
        return (
          <div key={article.id} className="module-article-item">
            <div className="module-article-left">
              <div className="module-article-number">{article.number}</div>
              <div className="module-article-info">
                <div className="module-article-title">{article.title}</div>
              </div>
            </div>
            {isCompleted ? (
              <div className="module-article-check completed">
                <IconCheck size={14} className="check-icon" />
              </div>
            ) : (
              <CircularProgress progress={articleProgress} size={20} completed={false} />
            )}
          </div>
        );
      })}
    </div>
  </div>
</div>
      </div>
    </div>
  );
};

export default ArticlePage;