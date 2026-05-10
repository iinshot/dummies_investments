import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IconArrowLeft, IconCheck } from '@tabler/icons-react';
import CircularProgress from '../components/CircularProgress';
import QuizIcon from '../assets/icons/quiz.svg';
import CheckIcon from '../assets/icons/check.svg';
import Рисунок1 from '../assets/articleimage/Рисунок1.jpg';
import Рисунок2 from '../assets/articleimage/Рисунок2.png';
import Рисунок3 from '../assets/articleimage/Рисунок3.jpg';
import Рисунок4 from '../assets/articleimage/Рисунок4.jpg';
      
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
  title: 'Основы бюджетирования',
  sections: [
    {
      title: 'Что такое бюджет и зачем он нужен',
      content: 'Бюджет — это план доходов и расходов на определенный период времени. Он помогает контролировать денежные потоки, избегать долгов и достигать финансовых целей.\n\nВедение бюджета дает вам полный контроль над своими финансами. Вы точно знаете, сколько заработали, сколько потратили и на что именно ушли деньги. Без бюджета деньги "утекают" незаметно, и в конце месяца вы удивляетесь, куда делась зарплата.\n\nБюджетирование снижает уровень стресса, связанного с деньгами. Когда вы знаете, сколько у вас есть и куда они пойдут, вы чувствуете себя увереннее и спокойнее. Бюджет — это инструмент, который помогает вам управлять деньгами, а не наоборот.'
    },
    {
      title: 'Правило 50/30/20',
      content: 'Правило 50/30/20 — это популярная стратегия распределения доходов, предложенная сенатором Элизабет Уоррен. Согласно этому правилу:\n\n50% дохода должно уходить на необходимые расходы (жилье, еда, транспорт, коммунальные услуги, связь, базовая одежда).\n\n30% — на желания (развлечения, хобби, путешествия, рестораны, кафе, подписки, покупки для души).\n\n20% — на сбережения и инвестиции (финансовая подушка, пенсионные накопления, инвестиции, досрочное погашение кредитов).\n\nЭто правило — отличная отправная точка для новичков. Оно простое, понятное и легко запоминается. Однако для каждого человека пропорции могут меняться в зависимости от уровня дохода, места жительства и личных целей.'
    },
    {
      title: 'Как вести семейный бюджет',
      content: 'Ведение семейного бюджета требует дисциплины и постоянства, но есть несколько проверенных стратегий:\n\n1. Выберите удобный инструмент. Это может быть таблица Excel, мобильное приложение (CoinKeeper, ZenMoney, Дзен-мани) или даже обычный блокнот.\n\n2. Начните с отслеживания расходов. Записывайте все траты в течение месяца, не пропуская даже мелочи — кофе на вынос, проезд в транспорте, мелкие покупки.\n\n3. Анализируйте и планируйте. В конце месяца посмотрите, куда ушло больше всего денег. Найдите статьи расходов, на которых можно сэкономить без ущерба для качества жизни.\n\n4. Используйте систему конвертов. Разложите деньги по категориям — на жилье, еду, транспорт, развлечения, сбережения.\n\n5. Вовлекайте всю семью. Обсуждайте финансовые цели, планируйте крупные покупки вместе, учите детей обращаться с деньгами.'
    }
  ]
},
3: {
  title: 'Почему важно инвестировать?',
  sections: [
    {
      title: 'Что такое инвестирование',
      content: 'Инвестирование — это процесс вложения денег в активы с целью получения дохода или сохранения капитала. Простыми словами, это когда вы заставляете свои деньги работать на вас.\n\nВместо того чтобы деньги лежали без дела под подушкой или на банковском счете с минимальным процентом, вы вкладываете их в инструменты, которые приносят дополнительный доход. Это может быть покупка акций компаний, облигаций, недвижимости, драгоценных металлов или других активов.\n\nГлавное преимущество инвестирования — пассивный доход. Вы получаете деньги, не тратя свое время и энергию. Ваши финансы работают 24/7, даже когда вы спите, отдыхаете или занимаетесь другими делами.'
    },
    {
      title: 'Эффект сложного процента',
      content: 'Альберт Эйнштейн назвал сложный процент восьмым чудом света. И это действительно так.\n\nСложный процент — это начисление процентов не только на первоначальную сумму, но и на уже накопленные проценты. Чем раньше вы начнете инвестировать, тем больше времени у ваших денег будет для роста.\n\nПростой пример: Если вы инвестируете 100 000 рублей под 10% годовых, через 10 лет у вас будет около 260 000 рублей, через 20 лет — около 670 000 рублей, а через 30 лет — более 1 700 000 рублей. Это и есть магия сложного процента.\n\nПоэтому ключевые правила инвестирования: начинайте как можно раньше, инвестируйте регулярно и дайте времени работать на вас.'
    },
    {
      title: 'Как начать инвестировать с нуля',
      content: 'Начать инвестировать проще, чем кажется. Вот пошаговая инструкция для новичков:\n\n1. Создайте финансовую подушку безопасности. Прежде чем инвестировать, накопите сумму, равную 3-6 месячным расходам.\n\n2. Изучите основы. Прочитайте книги по инвестициям, посмотрите бесплатные курсы, изучите базовые термины и инструменты.\n\n3. Выберите брокера. Откройте брокерский счет или индивидуальный инвестиционный счет (ИИС). Сравните комиссии, надежность и удобство платформ.\n\n4. Начните с малого. Не нужно сразу вкладывать все сбережения. Начните с небольшой суммы, которую не жалко потерять.\n\n5. Инвестируйте регулярно. Установите автоматическое пополнение счета каждый месяц. Даже 1000-2000 рублей регулярно — это уже хорошая привычка.\n\n6. Диверсифицируйте. Не вкладывайте все деньги в один актив. Распределяйте риски между разными инструментами.'
    }
  ]
},
4: {
  title: 'Виды инвестиций',
  sections: [
    {
      title: 'Классические виды инвестиций',
      content: 'Существует множество способов инвестировать деньги, каждый со своим уровнем риска и потенциальной доходностью:\n\nАкции — покупка доли в компании. Вы становитесь совладельцем бизнеса и получаете право на часть прибыли. Высокий риск, высокая потенциальная доходность (10-30% годовых и выше).\n\nОблигации — долговые ценные бумаги. Вы даете деньги в долг компании или государству под фиксированный процент. Средний риск, средняя доходность (6-12% годовых).\n\nБанковские вклады — деньги лежат на депозите под процент. Самый низкий риск, низкая доходность (4-8% годовых).\n\nНедвижимость — покупка квартир, домов, коммерческой недвижимости для сдачи в аренду или перепродажи. Средний риск, доходность 5-10% годовых плюс рост стоимости объекта.'
    },
    {
      title: 'Современные инструменты',
      content: 'Помимо классических инструментов, существуют современные варианты инвестиций:\n\nПИФы и ETF — готовые портфели ценных бумаг. Вы покупаете долю в фонде, который уже диверсифицирован. Низкий порог входа, удобно для новичков.\n\nКраудлендинг — инвестирование в займы частным лицам или бизнесу через платформы. Доходность 12-20% годовых, но высокий риск невозврата.\n\nКриптовалюты — Bitcoin, Ethereum и другие цифровые активы. Очень высокий риск, потенциально высокая доходность.\n\nДрагоценные металлы — золото, серебро, платина. Хорошо работают как защитный актив во времена кризисов.\n\nИнтеллектуальная собственность — инвестиции в стартапы, авторские права, патенты.'
    },
    {
      title: 'Как выбрать подходящий тип инвестиций',
      content: 'Выбор типа инвестиций зависит от ваших целей, горизонта планирования и склонности к риску:\n\nОпределите свою цель. На что вы копите? Пенсия, образование детей, покупка жилья, пассивный доход?\n\nОцените горизонт инвестирования. На коротком горизонте (1-3 года) лучше выбирать консервативные инструменты (вклады, облигации). На длинном (5-10+ лет) можно рассмотреть акции и недвижимость.\n\nОпределите свою риск-профиль. Консервативный инвестор готов на низкую доходность ради сохранности капитала. Агрессивный принимает высокий риск ради потенциально высокого дохода.\n\nДиверсифицируйте. Не вкладывайте все в один инструмент. Хороший портфель содержит разные классы активов: акции, облигации, недвижимость, золото.'
    }
  ]
},
5: {
  title: 'Как выбрать брокера',
  sections: [
    {
      title: 'Что такое брокер и зачем он нужен',
      content: 'Брокер — это профессиональный посредник между вами и фондовым рынком. Он предоставляет доступ к торговой площадке (бирже), где вы можете покупать и продавать ценные бумаги.\n\nБез брокера частное лицо не может напрямую торговать на бирже. Поэтому выбор надежного брокера — один из самых важных шагов для начинающего инвестора.\n\nБрокер выполняет несколько функций: открывает и обслуживает счета, исполняет ваши поручения на покупку/продажу, хранит ваши ценные бумаги, начисляет дивиденды и купоны, предоставляет отчетность для налоговой.'
    },
    {
      title: 'На что обратить внимание при выборе',
      content: 'При выборе брокера обратите внимание на следующие критерии:\n\nНаличие лицензии. Проверьте, есть ли у брокера лицензия Центрального банка. Это гарантия законности его деятельности.\n\nКомиссии и тарифы. Сравните, сколько брокер берет за обслуживание счета, за каждую сделку, за хранение ценных бумаг. Даже небольшая разница в комиссиях может сильно повлиять на доходность в долгосрочной перспективе.\n\nНадежность и репутация. Почитайте отзывы, изучите историю компании, узнайте, под каким брендом она работает. Выбирайте крупных, проверенных брокеров.\n\nУдобство платформы. Попробуйте демо-доступ к торговой платформе. Приложение должно быть удобным, понятным и стабильным.\n\nОбучение и поддержка. Хороший брокер предоставляет обучающие материалы, вебинары, аналитику и круглосуточную поддержку клиентов.'
    },
    {
      title: 'Топ-5 брокеров в России',
      content: 'По состоянию на текущий год, лучшими брокерами для частных инвесторов считаются:\n\n1. Т-Инвестиции (Т-Банк) — низкие комиссии, удобное приложение, большой выбор инструментов, обучение для начинающих.\n\n2. БКС Мир инвестиций — один из старейших брокеров, широкая сеть офисов, профессиональная аналитика.\n\n3. Сбербанк Инвестиции — надежность, интеграция с мобильным приложением Сбербанк Онлайн, подходит для новичков.\n\n4. ВТБ Мои Инвестиции — удобная платформа, широкий выбор инструментов, поддержка ИИС.\n\n5. Финам — подходит для активных трейдеров, минимальные спреды, мощная торговая платформа.\n\nРекомендуется открыть небольшой счет у нескольких брокеров, чтобы сравнить и выбрать наиболее удобного для вас.'
    }
  ]
},
6: {
  title: 'Виды кредитов',
  sections: [
    {
      title: 'Основные виды кредитов',
      content: 'Кредиты стали неотъемлемой частью финансовой жизни современного человека. Понимание видов кредитов поможет вам выбрать наиболее выгодный вариант:\n\nПотребительский кредит — выдается на любые нужды без залога и поручителей. Ставки обычно выше, чем по целевым кредитам. Сумма до 3-5 миллионов рублей.\n\nИпотека — целевой кредит на покупку жилья под залог приобретаемой недвижимости. Срок до 30 лет, ставка ниже, чем по потребительским кредитам. Есть льготные программы с господдержкой.\n\nАвтокредит — целевой кредит на покупку автомобиля. Автомобиль находится в залоге у банка. Ставка ниже, чем по потребительскому кредиту.\n\nКредитная карта — возобновляемая кредитная линия для ежедневных покупок. Есть льготный период (до 100-120 дней без процентов).\n\nРефинансирование — новый кредит для погашения существующих кредитов на более выгодных условиях. Помогает снизить ежемесячный платеж.'
    },
    {
      title: 'Как рассчитать переплату',
      content: 'Чтобы понять реальную стоимость кредита, нужно обращать внимание не только на процентную ставку, но и на полную стоимость кредита (ПСК):\n\nОсновные параметры для расчета переплаты:\n\nСумма кредита — сколько вы берете в долг.\n\nПроцентная ставка — годовой процент за пользование деньгами.\n\nСрок кредита — чем длиннее срок, тем больше переплата.\n\nПлатеж — аннуитетный (равными частями) или дифференцированный (уменьшается со временем).\n\nДополнительные комиссии — за открытие счета, страховку, обслуживание.\n\nФормула примерного расчета переплаты: Сумма кредита × Ставка × Срок / 2.\n\nНапример, кредит 100 000 ₽ под 20% годовых на 1 год = 100 000 × 0.20 × 1 = 20 000 ₽ переплаты. Реальная переплата будет больше за счет комиссий и страховок.'
    },
    {
      title: 'Правила ответственного заемщика',
      content: 'Чтобы не попасть в долговую яму, соблюдайте простые правила:\n\n1. Берите кредит только в крайнем случае. Оцените, можно ли накопить или найти альтернативу.\n\n2. Рассчитайте нагрузку. Ежемесячный платеж по всем кредитам не должен превышать 30-40% вашего дохода.\n\n3. Изучайте договор. Внимательно читайте все пункты, особенно мелкий шрифт. Обращайте внимание на скрытые комиссии.\n\n4. Не берите кредит, чтобы закрыть другой кредит. Это долговая спираль, из которой трудно выбраться.\n\n5. Используйте досрочное погашение. Чем раньше погасите кредит, тем меньше переплатите.\n\n6. Сравнивайте предложения. Не берите первый попавшийся кредит. Используйте онлайн-калькуляторы для сравнения условий разных банков.\n\n7. Не нарушайте платежную дисциплину. Просрочки портят кредитную историю и ведут к штрафам.'
    }
  ]
},
7: {
  title: 'Виды кредитов',
  sections: [
    {
      title: 'Основные виды кредитов',
      content: 'Кредиты стали неотъемлемой частью финансовой жизни современного человека. Понимание видов кредитов поможет вам выбрать наиболее выгодный вариант:\n\nПотребительский кредит — выдается на любые нужды без залога и поручителей. Ставки обычно выше, чем по целевым кредитам. Сумма до 3-5 миллионов рублей.\n\nИпотека — целевой кредит на покупку жилья под залог приобретаемой недвижимости. Срок до 30 лет, ставка ниже, чем по потребительским кредитам. Есть льготные программы с господдержкой.\n\nАвтокредит — целевой кредит на покупку автомобиля. Автомобиль находится в залоге у банка. Ставка ниже, чем по потребительскому кредиту.\n\nКредитная карта — возобновляемая кредитная линия для ежедневных покупок. Есть льготный период (до 100-120 дней без процентов).\n\nРефинансирование — новый кредит для погашения существующих кредитов на более выгодных условиях. Помогает снизить ежемесячный платеж.'
    },
    {
      title: 'Как рассчитать переплату',
      content: 'Чтобы понять реальную стоимость кредита, нужно обращать внимание не только на процентную ставку, но и на полную стоимость кредита (ПСК):\n\nОсновные параметры для расчета переплаты:\n\nСумма кредита — сколько вы берете в долг.\n\nПроцентная ставка — годовой процент за пользование деньгами.\n\nСрок кредита — чем длиннее срок, тем больше переплата.\n\nПлатеж — аннуитетный (равными частями) или дифференцированный (уменьшается со временем).\n\nДополнительные комиссии — за открытие счета, страховку, обслуживание.\n\nФормула примерного расчета переплаты: Сумма кредита × Ставка × Срок / 2.\n\nНапример, кредит 100 000 ₽ под 20% годовых на 1 год = 100 000 × 0.20 × 1 = 20 000 ₽ переплаты. Реальная переплата будет больше за счет комиссий и страховок.'
    },
    {
      title: 'Правила ответственного заемщика',
      content: 'Чтобы не попасть в долговую яму, соблюдайте простые правила:\n\n1. Берите кредит только в крайнем случае. Оцените, можно ли накопить или найти альтернативу.\n\n2. Рассчитайте нагрузку. Ежемесячный платеж по всем кредитам не должен превышать 30-40% вашего дохода.\n\n3. Изучайте договор. Внимательно читайте все пункты, особенно мелкий шрифт. Обращайте внимание на скрытые комиссии.\n\n4. Не берите кредит, чтобы закрыть другой кредит. Это долговая спираль, из которой трудно выбраться.\n\n5. Используйте досрочное погашение. Чем раньше погасите кредит, тем меньше переплатите.\n\n6. Сравнивайте предложения. Не берите первый попавшийся кредит. Используйте онлайн-калькуляторы для сравнения условий разных банков.\n\n7. Не нарушайте платежную дисциплину. Просрочки портят кредитную историю и ведут к штрафам.'
    }
  ]
},
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
    <span className="arrow-icon">←</span>
    Предыдущая статья
  </button>
  <button 
    className="article-nav-btn prev-btn" 
    onClick={() => {
      const nextId = parseInt(id) + 1;
      if (nextId <= 7) navigate(`/article/${nextId}`);
    }}
    disabled={parseInt(id) === 7}
  >
    Следующая статья
    <span className="arrow-icon">→</span>
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
<img src={QuizIcon} alt="Quiz" width="17" height="17" />
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