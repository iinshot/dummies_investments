import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IconArrowLeft, IconCheck } from '@tabler/icons-react';
import CircularProgress from '../components/CircularProgress';
import QuizIcon from '../assets/icons/quiz.svg';
import CheckIcon from '../assets/icons/check.svg';
      
import ArrowRightIcon from '../assets/icons/arrow_right.svg';  
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
  1: { // Статья 1: "Что такое финансовая грамотность?"
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
      title: 'Что такое финансовая грамотность?',
      sections: [
 {
        title: 'Определение финансовой грамотности',
        content: 'Финансовая грамотность — это способность человека принимать обоснованные решения в отношении управления личными финансами, включая бюджетирование, инвестирование, страхование, пенсионное планирование и управление долгами. Это набор знаний и навыков, необходимых для достижения финансового благополучия и независимости. Финансово грамотный человек понимает, как работают деньги, знает основные финансовые инструменты и умеет применять их на практике. Он способен оценивать риски, сравнивать предложения банков и инвестиционных компаний, планировать свои доходы и расходы на месяцы и годы вперед.\n\nВажно понимать, что финансовая грамотность — это не врожденное качество, а приобретенный навык. Её можно и нужно развивать, изучая специальную литературу, посещая курсы и семинары, а также на собственном опыте. В современном мире, где финансовые продукты становятся все сложнее, а мошенники — все изобретательнее, финансовая грамотность становится критически важной для выживания и процветания.\n\nИстория финансового образования насчитывает несколько десятилетий. Первые программы по повышению финансовой грамотности появились в США в 1990-х годах после серии финансовых кризисов. Сегодня такие программы реализуются в более чем 50 странах мира, включая Россию, где с 2011 года действует национальная стратегия повышения финансовой грамотности населения.\n\nФинансово грамотный человек обладает следующими качествами: он ведет учет своих доходов и расходов, живет по средствам, не берет необоснованные кредиты, имеет финансовую подушку безопасности, знает свои права как потребителя финансовых услуг, разбирается в инвестиционных продуктах, планирует выход на пенсию, страхует свои риски, оптимизирует налоги, защищает себя от мошенников.\n\nПо данным международных исследований, уровень финансовой грамотности в России составляет около 38%, что ниже, чем в странах Европы (52%) и США (57%). Это означает, что большинство россиян не умеют правильно распоряжаться деньгами, легко попадают в долговые ловушки и не могут обеспечить себе достойную старость. Именно поэтому так важно развивать финансовое образование с самого детства — в школах, колледжах, университетах, а также на курсах повышения квалификации для взрослых.\n\nФинансовая грамотность тесно связана с психологией денег. Наши финансовые привычки часто формируются в детстве под влиянием родителей и окружения. Кто-то вырос в семье, где деньги были дефицитом, и теперь испытывает страх перед крупными суммами. Кто-то, наоборот, привык к изобилию и не умеет ценить деньги. Понимание своих психологических установок — важный шаг к финансовой свободе.\n\nИсследования показывают, что финансово грамотные люди реже страдают от депрессии и тревожных расстройств, связанных с деньгами. Они увереннее смотрят в будущее, меньше беспокоятся о завтрашнем дне и могут позволить себе больше радостей жизни. Финансовая грамотность — это не только про деньги, но и про качество жизни в целом.'
      },
      {
        title: 'Почему это важно в современном мире',
        content: 'В современном мире финансовая грамотность становится не просто полезным навыком, а необходимой базой для выживания и процветания. Сложность финансовых продуктов растет, появляются новые формы инвестирования и кредитования. Без базовых знаний легко попасть в долговую яму, стать жертвой мошенников или просто упустить возможности для роста капитала.\n\nПо данным исследований, финансово грамотные люди накапливают в 2-3 раза больше сбережений и реже сталкиваются с финансовыми трудностями. Они лучше справляются с кризисными ситуациями — потерей работы, болезнью, непредвиденными расходами. У них выше уровень психологического благополучия, так как они меньше тревожатся о деньгах и чувствуют контроль над своей жизнью.\n\nКроме того, финансовая грамотность важна не только для отдельного человека, но и для общества в целом. Экономически образованные граждане совершают меньше импульсивных покупок, реже берут необоснованные кредиты, активнее инвестируют в развитие бизнеса и инновации. Это создает более стабильную и предсказуемую экономическую среду для всех.\n\nВ современном мире нас окружает огромное количество финансовых искушений: кредитные карты с высокими лимитами, рассрочки без процентов, быстрые займы под 1% в день. Финансово неграмотный человек легко попадается на эти уловки и оказывается в долговой спирали, из которой очень трудно выбраться. По статистике, более 40% заемщиков микрокредитных организаций не могут вернуть деньги в срок и попадают в рефинансирование, где ставки еще выше.\n\nЕще одна проблема — финансовая неграмотность пенсионеров. Многие пожилые люди становятся жертвами мошенников, которые предлагают "компенсацию за лекарства", "выигрыш в лотерею", "льготную замену счетчиков". Знание простых правил — не переводить деньги незнакомцам, не сообщать данные карты, не подписывать документы не читая — могло бы уберечь миллионы людей от потери последних сбережений.\n\nФинансовая грамотность особенно важна для молодых людей, которые только начинают самостоятельную жизнь. Первая зарплата, первый кредит, первая аренда жилья — все эти шаги требуют осознанного подхода. Обучение финансовой грамотности в школах и университетах должно стать обязательным, как математика или русский язык. Ведь умение обращаться с деньгами — это такой же базовый навык, как умение читать и писать.\n\nРаботодатели все чаще обращают внимание на финансовую грамотность своих сотрудников. Сотрудник, который умеет планировать бюджет, реже просит аванс и меньше отвлекается на личные финансовые проблемы. Некоторые компании даже внедряют программы финансового образования для персонала, понимая, что это повышает производительность и лояльность.\n\nНаконец, финансовая грамотность помогает человеку стать более независимым и свободным. Вы можете уйти с нелюбимой работы, если у вас есть накопления на полгода жизни. Вы можете позволить себе путешествие мечты, если научились откладывать. Вы можете обеспечить детям хорошее образование, если правильно распоряжаетесь деньгами. Финансовая грамотность — это не про жадность или скупость. Это про разумное отношение к деньгам, про умение наслаждаться жизнью, не залезая в долги.'
      },
      {
        title: 'Основные компоненты финансовой грамотности',
        content: 'Финансовая грамотность включает в себя несколько ключевых компонентов, которые необходимо развивать параллельно. Рассмотрим каждый из них подробно.\n\nКОМПОНЕНТ 1: УЧЕТ ДОХОДОВ И РАСХОДОВ\n\nУмение вести учет доходов и расходов — основа финансового планирования. Без понимания того, куда уходят деньги, невозможно эффективно управлять ими. Начните с простого: записывайте все свои траты в течение месяца в блокнот или мобильное приложение. В конце месяца проанализируйте, на что ушло больше всего денег. Вы будете удивлены, сколько средств тратится на мелкие, незначительные покупки — кофе на вынос, обеды в кафе, подписки, которыми вы не пользуетесь.\n\nПосле анализа составьте бюджет на следующий месяц: распределите доходы по категориям — обязательные платежи (коммунальные услуги, связь, интернет, кредиты), продукты, транспорт, развлечения, сбережения. Старайтесь придерживаться этого плана, но будьте гибкими — жизнь непредсказуема.\n\nИспользуйте приложения для учета финансов: CoinKeeper, ZenMoney, Дзен-мани, Money Lover. Они автоматически подключаются к банкам, категоризируют траты, строят графики и диаграммы. Это экономит массу времени и сил. Если вы не доверяете приложениям, используйте обычную таблицу Excel или Google Sheets — они бесплатны и удобны.\n\nВажный совет: планируйте не только расходы, но и доходы. Если у вас нестабильный заработок (фриланс, бизнес, сезонная работа), старайтесь создавать бюджет исходя из минимального дохода за последние 3-6 месяцев. Все, что заработаете сверху, отправляйте в накопления или инвестиции.\n\nКОМПОНЕНТ 2: СБЕРЕЖЕНИЯ И ИНВЕСТИЦИИ\n\nПонимание принципов сбережения и инвестирования — ключ к созданию капитала. Важно знать, как работают банковские депозиты, облигации, акции, паевые инвестиционные фонды. Научитесь оценивать соотношение риска и доходности, распределять активы, не класть все яйца в одну корзину.\n\nНачните с создания финансовой подушки безопасности — суммы, равной 3-6 месячным расходам, которая лежит на отдельном счете и доступна в любой момент. Это спасет вас в случае потери работы, болезни, аварии или других непредвиденных ситуациях. Деньги лучше держать на накопительном счете или вкладе с возможностью частичного снятия.\n\nПосле создания подушки можно начинать инвестировать. Не бойтесь инвестиций — это не только для богатых. Начать можно с 1000 рублей в месяц, вкладывая в облигации федерального займа (ОФЗ) или биржевые паевые инвестиционные фонды (БПИФ). Главное — регулярность и долгосрочность. Даже небольшие суммы, инвестируемые каждый месяц, через 20-30 лет превратятся в серьезный капитал благодаря сложному проценту.\n\nИзучите разные типы активов: акции (доля в бизнесе), облигации (долг), недвижимость, золото, криптовалюты. У каждого есть свои риски и доходность. Для начинающего инвестора лучше всего подойдут индексные фонды (ETF), которые дают широкую диверсификацию в одном инструменте.\n\nНе забывайте про инфляцию — она ежегодно съедает 4-8% ваших сбережений, если деньги просто лежат под подушкой. Инвестиции помогают не только сохранить, но и приумножить капитал. Исторически фондовый рынок приносит 8-12% годовых в долларах, что значительно выше инфляции.\n\nКОМПОНЕНТ 3: УПРАВЛЕНИЕ ДОЛГАМИ\n\nЗнание основ кредитования и управления долгами помогает избежать финансовых ловушек. Понимайте, чем отличается хороший кредит от плохого, как рассчитывается эффективная процентная ставка, какие существуют способы досрочного погашения. Избегайте микрозаймов и кредитов с грабительскими процентами.\n\nХороший кредит — это тот, который помогает вам заработать или сэкономить больше, чем вы платите по процентам. Например, ипотека (вы покупаете жилье, которое дорожает), образовательный кредит (инвестиция в будущий доход), кредит на бизнес (инвестиция в прибыль). Плохой кредит — это тот, который идет на текущее потребление: новый телефон, отпуск, рестораны. По таким кредитам проценты превращают дешевую покупку в очень дорогую.\n\nЕсли у вас уже есть долги, составьте план их погашения. Самый эффективный метод — снежный ком (snowball): выплачивайте сначала самые маленькие долги, а минимальные платежи по большим продолжайте вносить. Когда маленький долг погашен, добавьте его платеж к следующему по величине. Психологически это работает лучше, чем выплата самых дорогих кредитов в первую очередь.\n\nЕсли вы не справляетесь с долгами, не стесняйтесь обращаться за помощью к финансовому консультанту или в службы по урегулированию долгов. Реструктуризация, рефинансирование, кредитные каникулы — есть легальные способы снизить долговую нагрузку. Не затягивайте с решением проблемы — чем раньше вы начнете действовать, тем легче будет выбраться.\n\nКОМПОНЕНТ 4: ДОЛГОСРОЧНОЕ ПЛАНИРОВАНИЕ\n\nСпособность планировать долгосрочные финансовые цели и следовать этому плану — важнейший навык для достижения финансовой независимости. Ставьте конкретные, измеримые цели с четкими сроками. Вместо "хочу много денег" поставьте "хочу накопить 1 миллион рублей на первоначальный взнос по ипотеке за 3 года".\n\nРазбейте большую цель на маленькие шаги. Например, чтобы накопить 1 миллион за 3 года, нужно откладывать примерно 28 000 рублей в месяц. Установите автоматическое списание этой суммы с зарплаты на отдельный счет — так вы даже не заметите, как копите.\n\nПланируйте не только накопления, но и крупные расходы. Отпуск, покупка машины, ремонт, свадьба детей — все это требует денег. Открывайте отдельные счета или "конверты" на каждую цель и регулярно пополняйте их. Это дисциплинирует и помогает не тратить накопленное на мелочи.\n\nДумайте о пенсии заранее. Чем раньше вы начнете откладывать на пенсию, тем меньше будет ежемесячный взнос. Если начать в 25 лет, достаточно откладывать 5-7% дохода. Если начать в 40 лет — уже 15-20%. Используйте все возможности для пенсионных накоплений: индивидуальный пенсионный план (ИПП), негосударственные пенсионные фонды (НПФ), индивидуальный инвестиционный счет (ИИС) с льготами.\n\nКОМПОНЕНТ 5: НАЛОГОВАЯ ГРАМОТНОСТЬ\n\nФинансовая грамотность включает понимание налоговой системы и основ пенсионного планирования. Знайте, какие налоговые вычеты вам положены, как можно легально уменьшить налоговую нагрузку.\n\nВ России существует несколько налоговых вычетов, которые может получить практически каждый работающий человек. Имущественный вычет при покупке жилья (до 260 000 рублей возврата), социальный вычет на лечение и обучение (до 120 000 рублей в год), инвестиционный вычет (на доход от операций с ценными бумагами). Не ленитесь оформлять вычеты — это ваши законные деньги.\n\nЕсли у вас есть бизнес, изучайте налоговые режимы и оптимизируйте налоги легальными способами. Патент, УСН, НПД (налог на профессиональный доход) — у каждого есть свои преимущества в зависимости от типа деятельности. Консультируйтесь с профессиональными бухгалтерами, не экономьте на этом — ошибки в налогах могут стоить гораздо дороже.\n\nСледите за изменениями в налоговом законодательстве. Ставки, лимиты, льготы меняются каждый год. Подпишитесь на рассылки ФНС и профессиональных бухгалтеров, читайте новости. Это поможет избежать неприятных сюрпризов при подаче декларации.\n\nВЫВОД\n\nФинансовая грамотность — это комплексный навык, который требует времени и усилий для развития. Не нужно пытаться освоить все компоненты сразу. Начните с учета расходов — это самый простой и эффективный шаг. Постепенно добавляйте новые привычки: ежемесячное откладывание денег, планирование крупных покупок, чтение книг и статей по финансам.\n\nПомните, что идеального управления личными финансами не существует. Все мы иногда ошибаемся, тратим лишнее, пропускаем выгодные возможности. Главное — не останавливаться и продолжать учиться. Каждый шаг в сторону финансовой грамотности приближает вас к свободе, спокойствию и независимости.\n\nНачните сегодня — откройте приложение для учета расходов, переведите 500 рублей на накопительный счет, прочитайте статью о финансовой грамотности. Маленькие шаги каждый день приводят к большим результатам через год.'
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
            
            <div className="article-content-wrapper">
              {currentContent?.sections?.map((section, index) => (
                <div key={index} ref={el => sectionRefs.current[index] = el} className="article-section">
                  <h2 className="article-section-title">{section.title}</h2>
                  <p className="article-section-text">{section.content}</p>
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