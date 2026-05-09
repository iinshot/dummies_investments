import React, { useState, useEffect } from 'react';
import { IconChartPieFilled, IconArrowDown } from '@tabler/icons-react';
import './QuizPage.css';
import QuizIcon from '../assets/icons/quiz.svg';
import PieIcon from '../assets/icons/pie.svg';
import ArrowLeftIcon from '../assets/icons/arrow_left.svg';
import ArrowRightIcon from '../assets/icons/arrow_right.svg';
import CheckIcon from '../assets/icons/check.svg';

const QuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showAllQuizzes, setShowAllQuizzes] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [animateDirection, setAnimateDirection] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [resultsAnimation, setResultsAnimation] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [activeQuizId, setActiveQuizId] = useState(null);
  
  // Состояния для рейтинга и прогресса
  const [userRating, setUserRating] = useState({
    totalPoints: 0,
    completedQuizzes: 0,
    totalQuizzes: 6,
    quizResults: {},
    inProgressQuiz: null
  });
  
  // Все данные для викторин
  const allQuizzes = {
    1: {
      id: 1,
      title: 'Основы финансовой грамотности',
      description: 'Проверьте базовые знания о деньгах и финансах',
      maxPoints: 40,
      totalQuestions: 4,
      questions: [
        {
          id: 1,
          text: 'Что из перечисленного является компонентом финансовой грамотности?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Умение вести учет доходов и расходов', correct: true },
            { id: 'b', text: 'Понимание принципов кредитования', correct: true },
            { id: 'c', text: 'Умение быстро тратить деньги', correct: false },
            { id: 'd', text: 'Способность планировать финансовые цели', correct: true }
          ]
        },
        {
          id: 2,
          text: 'Какой процент россиян имеют высокий уровень финансовой грамотности?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Около 50%', correct: false },
            { id: 'b', text: 'Около 38%', correct: true },
            { id: 'c', text: 'Около 70%', correct: false },
            { id: 'd', text: 'Около 25%', correct: false }
          ]
        },
        {
          id: 3,
          text: 'Что такое финансовая подушка безопасности?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Сумма на кредитной карте', correct: false },
            { id: 'b', text: 'Накопления на 3-6 месяцев расходов', correct: true },
            { id: 'c', text: 'Инвестиции в акции', correct: false },
            { id: 'd', text: 'Страховка автомобиля', correct: false }
          ]
        },
        {
          id: 4,
          text: 'Какие факторы влияют на финансовую грамотность?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Семейное воспитание', correct: true },
            { id: 'b', text: 'Образование', correct: true },
            { id: 'c', text: 'Место рождения', correct: false },
            { id: 'd', text: 'Личный опыт', correct: true }
          ]
        }
      ]
    },
    2: {
      id: 2,
      title: 'Инвестиции для начинающих',
      description: 'Как начать инвестировать и не потерять деньги',
      maxPoints: 40,
      totalQuestions: 4,
      questions: [
        {
          id: 1,
          text: 'Что такое сложный процент?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Процент на первоначальную сумму', correct: false },
            { id: 'b', text: 'Процент на проценты', correct: true },
            { id: 'c', text: 'Банковская комиссия', correct: false },
            { id: 'd', text: 'Налог на доход', correct: false }
          ]
        },
        {
          id: 2,
          text: 'Почему важно начинать инвестировать рано?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Больше времени для роста капитала', correct: true },
            { id: 'b', text: 'Эффект сложного процента работает дольше', correct: true },
            { id: 'c', text: 'Меньше налогов', correct: false },
            { id: 'd', text: 'Можно инвестировать меньшие суммы', correct: true }
          ]
        },
        {
          id: 3,
          text: 'Какой доход в долгосрочной перспективе приносит фондовый рынок?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: '2-4% годовых', correct: false },
            { id: 'b', text: '8-12% годовых', correct: true },
            { id: 'c', text: '15-20% годовых', correct: false },
            { id: 'd', text: '1-3% годовых', correct: false }
          ]
        },
        {
          id: 4,
          text: 'Что нужно сделать перед началом инвестирования?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Взять кредит', correct: false },
            { id: 'b', text: 'Создать финансовую подушку', correct: true },
            { id: 'c', text: 'Купить дорогую вещь', correct: false },
            { id: 'd', text: 'Уволиться с работы', correct: false }
          ]
        }
      ]
    },
    3: {
      id: 3,
      title: 'Кредиты и займы',
      description: 'Разбираемся в кредитных продуктах',
      maxPoints: 40,
      totalQuestions: 4,
      questions: [
        {
          id: 1,
          text: 'Что такое ипотека?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Кредит на покупку жилья под залог', correct: true },
            { id: 'b', text: 'Кредит на автомобиль', correct: false },
            { id: 'c', text: 'Кредитная карта', correct: false },
            { id: 'd', text: 'Микрозайм', correct: false }
          ]
        },
        {
          id: 2,
          text: 'Какой платеж уменьшается со временем?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Аннуитетный', correct: false },
            { id: 'b', text: 'Дифференцированный', correct: true },
            { id: 'c', text: 'Фиксированный', correct: false },
            { id: 'd', text: 'Льготный', correct: false }
          ]
        },
        {
          id: 3,
          text: 'Какие бывают виды кредитов?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Потребительский', correct: true },
            { id: 'b', text: 'Ипотечный', correct: true },
            { id: 'c', text: 'Автокредит', correct: true },
            { id: 'd', text: 'Инвестиционный', correct: false }
          ]
        },
        {
          id: 4,
          text: 'Что такое полная стоимость кредита (ПСК)?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Только процентная ставка', correct: false },
            { id: 'b', text: 'Все затраты на обслуживание кредита', correct: true },
            { id: 'c', text: 'Сумма основного долга', correct: false },
            { id: 'd', text: 'Комиссия за открытие счета', correct: false }
          ]
        }
      ]
    },
    4: {
      id: 4,
      title: 'Налоговая грамотность',
      description: 'Как платить налоги и получать вычеты',
      maxPoints: 40,
      totalQuestions: 4,
      questions: [
        {
          id: 1,
          text: 'Что такое налоговый вычет?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Дополнительный налог', correct: false },
            { id: 'b', text: 'Возврат части уплаченного налога', correct: true },
            { id: 'c', text: 'Штраф за неуплату', correct: false },
            { id: 'd', text: 'Налоговая льгота для бизнеса', correct: false }
          ]
        },
        {
          id: 2,
          text: 'Какой максимальный возврат по имущественному вычету?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: '260 000 ₽', correct: true },
            { id: 'b', text: '100 000 ₽', correct: false },
            { id: 'c', text: '500 000 ₽', correct: false },
            { id: 'd', text: '1 000 000 ₽', correct: false }
          ]
        },
        {
          id: 3,
          text: 'На какие цели можно получить социальный вычет?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Лечение', correct: true },
            { id: 'b', text: 'Обучение', correct: true },
            { id: 'c', text: 'Покупка автомобиля', correct: false },
            { id: 'd', text: 'Благотворительность', correct: true }
          ]
        },
        {
          id: 4,
          text: 'Что такое инвестиционный вычет?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Вычет на доход от инвестиций', correct: true },
            { id: 'b', text: 'Вычет на покупку акций', correct: false },
            { id: 'c', text: 'Вычет на брокерские услуги', correct: false },
            { id: 'd', text: 'Вычет на аренду жилья', correct: false }
          ]
        }
      ]
    },
    5: {
      id: 5,
      title: 'Пенсионное планирование',
      description: 'Как накопить на достойную пенсию',
      maxPoints: 40,
      totalQuestions: 4,
      questions: [
        {
          id: 1,
          text: 'Что такое индивидуальный пенсионный план (ИПП)?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Государственная пенсия', correct: false },
            { id: 'b', text: 'Добровольные пенсионные накопления', correct: true },
            { id: 'c', text: 'Социальное пособие', correct: false },
            { id: 'd', text: 'Страхование жизни', correct: false }
          ]
        },
        {
          id: 2,
          text: 'Почему важно начинать копить на пенсию рано?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Меньше ежемесячный взнос', correct: true },
            { id: 'b', text: 'Больше времени для накопления', correct: true },
            { id: 'c', text: 'Гарантированная доходность', correct: false },
            { id: 'd', text: 'Эффект сложного процента', correct: true }
          ]
        },
        {
          id: 3,
          text: 'Какой процент дохода рекомендуется откладывать на пенсию?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: '5-7%', correct: false },
            { id: 'b', text: '10-15%', correct: true },
            { id: 'c', text: '20-25%', correct: false },
            { id: 'd', text: '30-40%', correct: false }
          ]
        },
        {
          id: 4,
          text: 'Что такое негосударственный пенсионный фонд (НПФ)?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Государственный пенсионный фонд', correct: false },
            { id: 'b', text: 'Частная пенсионная компания', correct: true },
            { id: 'c', text: 'Страховая компания', correct: false },
            { id: 'd', text: 'Банковский вклад', correct: false }
          ]
        }
      ]
    },
    6: {
      id: 6,
      title: 'Финансовая безопасность',
      description: 'Как защитить себя от мошенников',
      maxPoints: 40,
      totalQuestions: 4,
      questions: [
        {
          id: 1,
          text: 'Что нельзя сообщать по телефону незнакомцам?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Номер карты', correct: true },
            { id: 'b', text: 'CVV-код', correct: true },
            { id: 'c', text: 'Срок действия карты', correct: true },
            { id: 'd', text: 'Имя владельца', correct: false }
          ]
        },
        {
          id: 2,
          text: 'Что делать, если вы стали жертвой мошенников?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Ничего не делать', correct: false },
            { id: 'b', text: 'Заблокировать карту и обратиться в банк', correct: true },
            { id: 'c', text: 'Ждать, пока вернут деньги', correct: false },
            { id: 'd', text: 'Снять все деньги с карты', correct: false }
          ]
        },
        {
          id: 3,
          text: 'Как определить мошеннический сайт?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Неправильное написание адреса', correct: true },
            { id: 'b', text: 'Отсутствие HTTPS-сертификата', correct: true },
            { id: 'c', text: 'Слишком выгодные предложения', correct: true },
            { id: 'd', text: 'Красивый дизайн', correct: false }
          ]
        },
        {
          id: 4,
          text: 'Что такое фишинг?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Вид рыбной ловли', correct: false },
            { id: 'b', text: 'Вид мошенничества для кражи данных', correct: true },
            { id: 'c', text: 'Способ шифрования', correct: false },
            { id: 'd', text: 'Банковская операция', correct: false }
          ]
        }
      ]
    }
  };

  // Загрузка рейтинга из localStorage
  useEffect(() => {
    const loadRatingFromStorage = () => {
      const savedRating = localStorage.getItem('quizRating');
      if (savedRating) {
        const parsedRating = JSON.parse(savedRating);
        setUserRating(parsedRating);
        // Если есть викторина в процессе, восстанавливаем её
        if (parsedRating.inProgressQuiz) {
          const progressData = parsedRating.quizProgress?.[parsedRating.inProgressQuiz];
          if (progressData && !progressData.completed) {
            setSelectedQuiz(allQuizzes[parsedRating.inProgressQuiz]);
            setActiveQuizId(parsedRating.inProgressQuiz);
            setCurrentQuestion(progressData.currentQuestion || 0);
            setUserAnswers(progressData.userAnswers || {});
          }
        }
      } else {
        const initialRating = {
          totalPoints: 0,
          completedQuizzes: 0,
          totalQuizzes: 6,
          quizResults: {},
          inProgressQuiz: null,
          quizProgress: {}
        };
        localStorage.setItem('quizRating', JSON.stringify(initialRating));
        setUserRating(initialRating);
      }
    };
    
    loadRatingFromStorage();
  }, []);

  // Сохранение прогресса текущей викторины
  const saveCurrentProgress = () => {
    if (selectedQuiz && !quizCompleted) {
      const newRating = {
        ...userRating,
        inProgressQuiz: selectedQuiz.id,
        quizProgress: {
          ...userRating.quizProgress,
          [selectedQuiz.id]: {
            currentQuestion: currentQuestion,
            userAnswers: userAnswers,
            startedAt: new Date().toISOString(),
            completed: false
          }
        }
      };
      localStorage.setItem('quizRating', JSON.stringify(newRating));
      setUserRating(newRating);
    }
  };

  // Сохранение прогресса при изменении вопроса или ответов
  useEffect(() => {
    if (selectedQuiz && !quizCompleted) {
      saveCurrentProgress();
    }
  }, [currentQuestion, userAnswers, selectedQuiz, quizCompleted]);

  // Функция для сохранения завершения викторины
  const saveQuizProgress = (quizId, earnedPoints, totalPoints) => {
    const newRating = {
      ...userRating,
      totalPoints: userRating.totalPoints + earnedPoints,
      completedQuizzes: userRating.completedQuizzes + 1,
      inProgressQuiz: null,
      quizProgress: {
        ...userRating.quizProgress,
        [quizId]: {
          completed: true,
          points: earnedPoints,
          maxPoints: totalPoints,
          completedAt: new Date().toISOString()
        }
      },
      quizResults: {
        ...userRating.quizResults,
        [quizId]: {
          completed: true,
          points: earnedPoints,
          maxPoints: totalPoints,
          completedAt: new Date().toISOString()
        }
      }
    };
    
    localStorage.setItem('quizRating', JSON.stringify(newRating));
    setUserRating(newRating);
  };

  // Список викторин для отображения
  const getQuizStatus = (quizId) => {
    if (userRating.quizResults[quizId]?.completed) return 'Пройдено';
    if (userRating.inProgressQuiz === quizId) return 'В процессе';
    return 'Не пройдено';
  };

  const getQuizPoints = (quizId) => {
    return userRating.quizResults[quizId]?.points || 0;
  };

  const quizzesList = Object.values(allQuizzes).map(quiz => ({
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    status: getQuizStatus(quiz.id),
    points: getQuizPoints(quiz.id),
    maxPoints: quiz.maxPoints,
    questions: `${quiz.totalQuestions} вопросов`,
    theme: activeQuizId === quiz.id ? 'dark' : 'light',
    isActive: activeQuizId === quiz.id,
    isInProgress: userRating.inProgressQuiz === quiz.id && !userRating.quizResults[quiz.id]?.completed
  }));

  // Выбор викторины
  const handleSelectQuiz = (quizId) => {
    if (activeQuizId === quizId) return;
    
    const quiz = allQuizzes[quizId];
    setSelectedQuiz(quiz);
    setActiveQuizId(quizId);
    
    // Восстанавливаем прогресс, если есть
    const savedProgress = userRating.quizProgress?.[quizId];
    if (savedProgress && !savedProgress.completed) {
      setCurrentQuestion(savedProgress.currentQuestion || 0);
      setUserAnswers(savedProgress.userAnswers || {});
    } else {
      setCurrentQuestion(0);
      setUserAnswers({});
    }
    
    setQuizCompleted(false);
    setQuizScore(0);
    setResultsAnimation(false);
  };

  const handleCloseQuiz = () => {
    if (selectedQuiz && !quizCompleted) {
      saveCurrentProgress();
    }
    setSelectedQuiz(null);
    setActiveQuizId(null);
    setCurrentQuestion(0);
    setQuizCompleted(false);
    setUserAnswers({});
    setQuizScore(0);
    setResultsAnimation(false);
  };

  const currentQ = selectedQuiz?.questions[currentQuestion];
  
  const quizStats = {
    totalQuiz: userRating.totalQuizzes,
    completedQuiz: userRating.completedQuizzes,
    remainingQuiz: userRating.totalQuizzes - userRating.completedQuizzes,
    points: userRating.totalPoints,
    progressPercent: userRating.totalQuizzes > 0 
      ? Math.round((userRating.completedQuizzes / userRating.totalQuizzes) * 100) 
      : 0
  };

  const handleOptionSelect = (optionId) => {
    if (isAnimating) return;
    
    const currentQuestionData = selectedQuiz.questions[currentQuestion];
    const isSingleChoice = currentQuestionData.subtext === '(выберите один вариант)';
    
    setUserAnswers(prev => {
      const currentAnswers = prev[currentQuestion] || { selectedOptions: [] };
      
      if (isSingleChoice) {
        return {
          ...prev,
          [currentQuestion]: { selectedOptions: [optionId] }
        };
      } else {
        let newSelectedOptions;
        if (currentAnswers.selectedOptions.includes(optionId)) {
          newSelectedOptions = currentAnswers.selectedOptions.filter(id => id !== optionId);
        } else {
          newSelectedOptions = [...currentAnswers.selectedOptions, optionId];
        }
        return {
          ...prev,
          [currentQuestion]: { selectedOptions: newSelectedOptions }
        };
      }
    });
  };

  const isOptionSelected = (optionId) => {
    const answers = userAnswers[currentQuestion];
    return answers?.selectedOptions?.includes(optionId) || false;
  };

  const calculateEarnedPoints = () => {
    let totalPoints = 0;
    
    for (let i = 0; i < selectedQuiz.questions.length; i++) {
      const question = selectedQuiz.questions[i];
      const userAnswer = userAnswers[i];
      const selectedOptions = userAnswer?.selectedOptions || [];
      
      const correctOptions = question.options
        .filter(opt => opt.correct)
        .map(opt => opt.id);
      
      const isSingleChoice = question.subtext === '(выберите один вариант)';
      let isCorrect = false;
      
      if (isSingleChoice) {
        if (selectedOptions.length === 1 && correctOptions.includes(selectedOptions[0])) {
          isCorrect = true;
        }
      } else {
        const allCorrectSelected = correctOptions.every(id => selectedOptions.includes(id));
        const noWrongSelected = selectedOptions.every(id => correctOptions.includes(id));
        
        if (allCorrectSelected && noWrongSelected) {
          isCorrect = true;
        }
      }
      
      if (isCorrect) {
        totalPoints += question.points;
      }
    }
    
    return totalPoints;
  };

  const checkAnswers = () => {
    const earnedPoints = calculateEarnedPoints();
    const maxPoints = selectedQuiz.maxPoints;
    
    setQuizScore(earnedPoints);
    setQuizCompleted(true);
    saveQuizProgress(selectedQuiz.id, earnedPoints, maxPoints);
    setTimeout(() => setResultsAnimation(true), 100);
  };

  const handleNextQuestion = () => {
    if (isAnimating) return;
    
    if (currentQuestion < selectedQuiz.totalQuestions - 1) {
      setAnimateDirection('next');
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setAnimateDirection('');
        setIsAnimating(false);
      }, 300);
    } else {
      checkAnswers();
    }
  };

  const handlePrevQuestion = () => {
    if (isAnimating || currentQuestion === 0) return;
    
    setAnimateDirection('prev');
    setIsAnimating(true);
    
    setTimeout(() => {
      setCurrentQuestion(currentQuestion - 1);
      setAnimateDirection('');
      setIsAnimating(false);
    }, 300);
  };

  const handleRetryQuiz = () => {
    setResultsAnimation(false);
    setTimeout(() => {
      setCurrentQuestion(0);
      setQuizCompleted(false);
      setUserAnswers({});
      setQuizScore(0);
    }, 300);
  };

  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (quizStats.progressPercent / 100) * circumference;

  const displayedQuizzes = showAllQuizzes ? quizzesList : quizzesList.slice(0, 3);

  // Данные для модулей

const module1Cards = [
  { id: 1, title: 'Что такое финансовая грамотность?', description: 'Базовые понятия и принципы', status: getQuizStatus(1), questions: '10 вопросов', points: getQuizPoints(1), maxPoints: 40, quizId: 1, buttonLabel: getQuizStatus(1) === 'Пройдено' ? 'Перепройти' : (getQuizStatus(1) === 'В процессе' ? 'Продолжить' : 'Пройти') },
  { id: 2, title: 'Основы бюджетирования', description: 'Как планировать доходы и расходы', status: 'Не пройдено', questions: '10 вопросов', points: 0, maxPoints: 40, quizId: null, buttonLabel: 'Пройти' }
];

const module2Cards = [
  { id: 1, title: 'Почему важно инвестировать?', description: 'Преимущества инвестирования', status: getQuizStatus(2), questions: '10 вопросов', points: getQuizPoints(2), maxPoints: 40, quizId: 2, buttonLabel: getQuizStatus(2) === 'Пройдено' ? 'Перепройти' : (getQuizStatus(2) === 'В процессе' ? 'Продолжить' : 'Пройти') },
  { id: 2, title: 'Виды инвестиций', description: 'Какие бывают инвестиционные инструменты', status: 'Не пройдено', questions: '10 вопросов', points: 0, maxPoints: 40, quizId: null, buttonLabel: 'Пройти' },
  { id: 3, title: 'Как выбрать брокера?', description: 'Критерии выбора надежного брокера', status: 'Не пройдено', questions: '10 вопросов', points: 0, maxPoints: 40, quizId: null, buttonLabel: 'Пройти' }
];

const module3Cards = [
  { id: 1, title: 'Виды кредитов', description: 'Потребительский, ипотека, автокредит', status: getQuizStatus(3), questions: '10 вопросов', points: getQuizPoints(3), maxPoints: 40, quizId: 3, buttonLabel: getQuizStatus(3) === 'Пройдено' ? 'Перепройти' : (getQuizStatus(3) === 'В процессе' ? 'Продолжить' : 'Пройти') },
  { id: 2, title: 'Налоговые вычеты', description: 'Как вернуть часть уплаченных налогов', status: getQuizStatus(4), questions: '10 вопросов', points: getQuizPoints(4), maxPoints: 40, quizId: 4, buttonLabel: getQuizStatus(4) === 'Пройдено' ? 'Перепройти' : (getQuizStatus(4) === 'В процессе' ? 'Продолжить' : 'Пройти') }
];

  return (
    <div className="quiz-layout">
      {/* Центральный блок */}
      <div className="quiz-main">
        {/* КАРТОЧКА 1: Текущая викторина */}
        <div className="quiz-module-card">
          {!selectedQuiz ? (
            <div className="empty-quiz-state">
              <div className="empty-quiz-icon">
                <div className="yellow-circle-icon">
                   <img src={PieIcon} alt="Викторина" className="icon-img" />
                </div>
              </div>
              <h3 className="empty-quiz-title">Выберите викторину</h3>
              <p className="empty-quiz-description">
                Нажмите на любую викторину в списке снизу,<br />
                чтобы начать проверку знаний
              </p>
            </div>
          ) : !quizCompleted ? (
            <>
              <div className="quiz-header">
                <div className="quiz-icon">
                  <div className="yellow-circle-icon">
                      <img src={PieIcon} alt="Прогресс" className="icon-img-small" />
                  </div>
                </div>
                <div className="quiz-info">
                  <h1 className="quiz-title">{selectedQuiz.title}</h1>
                  <div className="quiz-questions-count">{selectedQuiz.totalQuestions} вопроса</div>
                </div>
                <button className="quiz-close-btn" onClick={handleCloseQuiz}>✕</button>
              </div>

              <div className="quiz-progress">
                <div className="progress-dots">
                  {[...Array(selectedQuiz.totalQuestions)].map((_, idx) => (
                    <div
                      key={idx}
                      className={`progress-dot ${idx < currentQuestion ? 'completed' : idx === currentQuestion ? 'active' : ''}`}
                      style={{ width: idx === currentQuestion ? '32px' : '8px' }}
                    />
                  ))}
                </div>
                <div className="progress-text">
                  Вопрос {currentQuestion + 1} из {selectedQuiz.totalQuestions}
                </div>
              </div>

              <div className={`quiz-question-card ${animateDirection === 'next' ? 'slide-left' : animateDirection === 'prev' ? 'slide-right' : ''}`}>
                <div className="question-header">
                  <div className="question-number">
                    <span>{currentQuestion + 1}</span>
                  </div>
                  <div className="question-text-wrapper">
                    <p className="question-text">{currentQ.text}</p>
                    <span className="question-subtext">{currentQ.subtext}</span>
                  </div>
                </div>

                <div className="quiz-options-list">
                  {currentQ.options.map((option) => (
                    <label
                      key={option.id}
                      className={`quiz-option ${isOptionSelected(option.id) ? 'checked' : ''}`}
                    >
                      <input
                        type={currentQ.subtext === '(выберите один вариант)' ? 'radio' : 'checkbox'}
                        name={`question-${currentQuestion}`}
                        checked={isOptionSelected(option.id)}
                        onChange={() => handleOptionSelect(option.id)}
                        className="quiz-checkbox-input"
                      />
                      <div className={`quiz-checkbox ${isOptionSelected(option.id) ? 'checked' : ''}`}>
                        {isOptionSelected(option.id) && <span className="check-mark">✓</span>}
                      </div>
                      <span className="quiz-option-text">{option.text}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="quiz-navigation">
                {currentQuestion > 0 && (
<button className="quiz-nav-btn prev" onClick={handlePrevQuestion} disabled={isAnimating}>
  <img src={ArrowLeftIcon} alt="Назад" className="nav-icon-left" />
  <span>Назад</span>
</button>
                )}
<button 
  className={`quiz-next-btn ${currentQuestion === 0 ? 'alone' : ''}`} 
  onClick={handleNextQuestion} 
  disabled={isAnimating}
>
  <span>{currentQuestion === selectedQuiz.totalQuestions - 1 ? 'Завершить' : 'Дальше'}</span>
  {currentQuestion === selectedQuiz.totalQuestions - 1 ? (
    <img src={CheckIcon} alt="Завершить" className="nav-icon-check" />
  ) : (
    <img src={ArrowRightIcon} alt="Далее" className="nav-icon-right" />
  )}
</button>
              </div>
            </>
          ) : (
            <div className={`quiz-results-completed ${resultsAnimation ? 'animate-in' : ''}`}>
              <div className="results-header">
                <div className="score-circle">
                  <div className="score-value">{quizScore}</div>
                </div>
                <h2 className="results-title">Викторина пройдена!</h2>
                <p className="results-description">
                  Отличная работа! Вы набрали {quizScore} из {selectedQuiz.maxPoints} очков
                </p>
              </div>

              <div className="results-stats">
                <div className="stat-card correct">
                  <div className="stat-value">{quizScore}</div>
                  <div className="stat-label">очков</div>
                </div>
                <div className="stat-card percentage">
                  <div className="stat-value">{Math.round((quizScore / selectedQuiz.maxPoints) * 100)}%</div>
                  <div className="stat-label">результат</div>
                </div>
              </div>

              <div className="results-actions">
                <button className="retry-btn" onClick={handleRetryQuiz}>
                  <span className="retry-icon">↻</span>
                  Пройти заново
                </button>
                <button className="close-results-btn" onClick={handleCloseQuiz}>
                  Закрыть
                </button>
              </div>
            </div>
          )}
        </div>

        {/* КАРТОЧКА 2: Общие викторины */}
        <div className="quiz-module-card">
          <div className="quizzes-section">
            <h2 className="quizzes-title">Общие викторины</h2>
            <div className="quizzes-grid">
              {displayedQuizzes.map((quiz) => (
                <div 
                  key={quiz.id} 
                  className={`quiz-card ${quiz.theme === 'dark' ? 'card-dark' : 'card-light'} ${activeQuizId === quiz.id ? 'active' : ''}`}
                  onClick={() => handleSelectQuiz(quiz.id)}
                >
                  <h3 className="quiz-card-title">{quiz.title}</h3>
                  <p className="quiz-card-description">{quiz.description}</p>
                  
                  <div className="quiz-card-footer">
                    <div className={`quiz-status ${quiz.status === 'Пройдено' ? 'status-completed' : quiz.status === 'В процессе' ? 'status-in-progress' : 'status-not-started'}`}>
                      <span className={quiz.status === 'Пройдено' ? 'status-text-completed' : quiz.status === 'В процессе' ? 'status-text-in-progress' : 'status-text-not-started'}>
                        {quiz.status}
                      </span>
                    </div>
                    <div className="quiz-stats">
<div className="quiz-stat">
  <img src={QuizIcon} alt="quiz" className="stat-icon-img" />
  <span className="stat-text">{quiz.questions}</span>
</div>
                      <div className="quiz-stat">
                        <span className="stat-icon">⚡</span>
                        <span className="stat-text">{quiz.points} / {quiz.maxPoints}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className={`quiz-action-btn ${quiz.status === 'Пройдено' ? 'completed' : quiz.status === 'В процессе' ? 'in-progress' : ''}`}>
                    {quiz.status === 'Пройдено' ? 'Перепройти' : quiz.status === 'В процессе' ? 'Продолжить' : 'Пройти'}
                  </button>
                </div>
              ))}
            </div>
            
            <button className="show-all-btn" onClick={() => setShowAllQuizzes(!showAllQuizzes)}>
              <span>{showAllQuizzes ? 'СКРЫТЬ' : 'ПОКАЗАТЬ ВСЕ'}</span>
              <IconArrowDown size={16} className={`show-all-icon ${showAllQuizzes ? 'rotated' : ''}`} />
            </button>
          </div>
        </div>

        {/* КАРТОЧКА 3: По модулям - все карточки одинакового размера */}
        <div className="quiz-module-card">
          <div className="modules-section">
            <h2 className="modules-title">По модулям</h2>
            
{/* Модуль 1 */}
<div className="module-block">
  <h3 className="module-title">Модуль 1 — Введение в финансы</h3>
  <div className="module-cards-grid grid-3cols">
    {module1Cards.map((card) => (
      <article 
        key={card.id} 
        className={`module-item-card ${card.quizId ? 'clickable' : ''} ${card.status === 'Пройдено' ? 'card-completed' : card.status === 'В процессе' ? 'card-in-progress' : ''}`}
        onClick={() => card.quizId && handleSelectQuiz(card.quizId)}
      >
        <div className="module-card-content">
          <h4 className="module-card-title">{card.title}</h4>
          <p className="module-card-description">{card.description}</p>
        </div>
        <div className="module-card-meta">
          <div className={`status-badge ${card.status === 'Пройдено' ? 'status-completed' : card.status === 'В процессе' ? 'status-in-progress' : 'status-not-started'}`}>
            <span>{card.status}</span>
          </div>
          <div className="module-stats">
            <div className="module-stat">
              <img src={QuizIcon} alt="quiz" className="stat-icon-img" />
              <span>{card.questions}</span>
            </div>
            <div className="module-stat">
              <span className="stat-icon">⚡</span>
              <span>{card.points} / {card.maxPoints}</span>
            </div>
          </div>
        </div>
        <button className="module-action-btn">
          {card.buttonLabel}
        </button>
      </article>
    ))}
  </div>
</div>

{/* Модуль 2 */}
<div className="module-block">
  <h3 className="module-title">Модуль 2 — Инвестиции</h3>
  <div className="module-cards-grid grid-3cols">
    {module2Cards.map((card) => (
      <article 
        key={card.id} 
        className={`module-item-card ${card.quizId ? 'clickable' : ''} ${card.status === 'Пройдено' ? 'card-completed' : card.status === 'В процессе' ? 'card-in-progress' : ''}`}
        onClick={() => card.quizId && handleSelectQuiz(card.quizId)}
      >
        <div className="module-card-content">
          <h4 className="module-card-title">{card.title}</h4>
          <p className="module-card-description">{card.description}</p>
        </div>
        <div className="module-card-meta">
          <div className={`status-badge ${card.status === 'Пройдено' ? 'status-completed' : card.status === 'В процессе' ? 'status-in-progress' : 'status-not-started'}`}>
            <span>{card.status}</span>
          </div>
          <div className="module-stats">
            <div className="module-stat">
              <img src={QuizIcon} alt="quiz" className="stat-icon-img" />
              <span>{card.questions}</span>
            </div>
            <div className="module-stat">
              <span className="stat-icon">⚡</span>
              <span>{card.points} / {card.maxPoints}</span>
            </div>
          </div>
        </div>
        <button className="module-action-btn">
          {card.buttonLabel}
        </button>
      </article>
    ))}
  </div>
</div>

{/* Модуль 3 */}
<div className="module-block">
  <h3 className="module-title">Модуль 3 — Кредиты и налоги</h3>
  <div className="module-cards-grid grid-3cols">
    {module3Cards.map((card) => (
      <article 
        key={card.id} 
        className={`module-item-card ${card.quizId ? 'clickable' : ''} ${card.status === 'Пройдено' ? 'card-completed' : card.status === 'В процессе' ? 'card-in-progress' : ''}`}
        onClick={() => card.quizId && handleSelectQuiz(card.quizId)}
      >
        <div className="module-card-content">
          <h4 className="module-card-title">{card.title}</h4>
          <p className="module-card-description">{card.description}</p>
        </div>
        <div className="module-card-meta">
          <div className={`status-badge ${card.status === 'Пройдено' ? 'status-completed' : card.status === 'В процессе' ? 'status-in-progress' : 'status-not-started'}`}>
            <span>{card.status}</span>
          </div>
          <div className="module-stats">
            <div className="module-stat">
              <img src={QuizIcon} alt="quiz" className="stat-icon-img" />
              <span>{card.questions}</span>
            </div>
            <div className="module-stat">
              <span className="stat-icon">⚡</span>
              <span>{card.points} / {card.maxPoints}</span>
            </div>
          </div>
        </div>
        <button className="module-action-btn">
          {card.buttonLabel}
        </button>
      </article>
    ))}
  </div>
</div>
          </div>
        </div>
      </div>

      {/* Правый сайдбар */}
      <div className="quiz-sidebar">
        <div className="sidebar-progress">
          <div className="progress-header">
            <div className="yellow-circle">
               <img src={PieIcon} alt="Прогресс" className="icon-img-small-2" />
            </div>
            <span className="progress-title">ВАШ ПРОГРЕСС</span>
          </div>

          <div className="circular-progress-container">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#EEEEEE"
                strokeWidth={strokeWidth}
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#F0F036"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            </svg>
            <div className="circular-progress-center">
              <span className="progress-number">{userRating.completedQuizzes}</span>
            </div>
          </div>

          <div className="stats-container-sidebar">
  <div className="stat-card-sidebar">
    <div className="stat-value-sidebar">{userRating.totalPoints}</div>
    <div className="stat-label-sidebar">очков</div>
  </div>
  <div className="stat-card-sidebar">
    <div className="stat-value-sidebar">{userRating.completedQuizzes}</div>
    <div className="stat-label-sidebar">пройдено</div>
  </div>
  <div className="stat-card-sidebar">
    <div className="stat-value-sidebar">{userRating.totalQuizzes - userRating.completedQuizzes}</div>
    <div className="stat-label-sidebar">осталось</div>
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;