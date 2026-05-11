import React, { useState, useEffect } from 'react';
import { IconChartPieFilled, IconArrowDown } from '@tabler/icons-react';
import './QuizPage.css';
import QuizIcon from '../assets/icons/quiz.svg';
import PieIcon from '../assets/icons/pie.svg';
import ArrowLeftIcon from '../assets/icons/arrow_left.svg';
import ArrowRightIcon from '../assets/icons/arrow_right.svg';
import CheckIcon from '../assets/icons/check.svg';
import { useNavigate } from 'react-router-dom';

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
  totalQuizzes: 13, 
  quizResults: {},
  inProgressQuiz: null,
  quizProgress: {}
});

const [isContinueVisible, setIsContinueVisible] = useState(true); 
  const articlesData = [
    { id: 1, title: 'Что такое финансовая грамотность?', module: 'Модуль 1 — Введение в финансы' },
    { id: 2, title: 'Основы бюджетирования', module: 'Модуль 1 — Введение в финансы' },
    { id: 3, title: 'Почему важно инвестировать?', module: 'Модуль 2 — Инвестиции' },
    { id: 4, title: 'Виды инвестиций', module: 'Модуль 2 — Инвестиции' },
    { id: 5, title: 'Как выбрать брокера?', module: 'Модуль 2 — Инвестиции' },
    { id: 6, title: 'Виды кредитов', module: 'Модуль 3 — Кредиты и налоги' },
    { id: 7, title: 'Налоговые вычеты', module: 'Модуль 3 — Кредиты и налоги' }
  ];

  // ========= ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ТЕКУЩЕЙ СТАТЬИ =========
  const getCurrentArticleData = () => {
    // Получаем прогресс статей из localStorage
    const savedProgress = localStorage.getItem('articleProgress');
    
    if (savedProgress) {
      const progressData = JSON.parse(savedProgress);
      // Ищем первую незавершенную статью
      for (let i = 1; i <= 7; i++) {
        const articleProgress = progressData[i];
        if (!articleProgress || articleProgress < 100) {
          const article = articlesData.find(a => a.id === i);
          if (article) {
            return {
              ...article,
              progress: articleProgress || 0,
              id: i
            };
          }
        }
      }
    }
    
    // Если все статьи пройдены или нет прогресса, возвращаем первую
    return { ...articlesData[0], progress: 0, id: 1 };
  };

   const handleCloseContinue = () => {  // ← СЮДА
    setIsContinueVisible(false);
  };

  // ========= ДОБАВЬТЕ useNavigate ПОСЛЕ useState =========
  const navigate = useNavigate();  // ← СЮДА (не забудьте импортировать useNavigate)

  const handleContinueClick = (articleId) => {  // ← СЮДА
    navigate(`/article/${articleId}`);
  };

  // Все данные для викторин
  const generalQuizzes = {
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
      
    },
  };

const moduleQuizzes = {
// МОДУЛЬ 1 - КАРТОЧКА 1
101: {
  id: 101,
  title: 'Что такое финансовая грамотность?',
  description: 'Базовые понятия и принципы',
  maxPoints: 40,
  totalQuestions: 4,
  questions: [
    {
      id: 1,
      text: 'Что такое финансовая грамотность?',
      subtext: '(выберите один вариант)',
      points: 10,
      options: [
        { id: 'a', text: 'Умение зарабатывать много денег', correct: false },
        { id: 'b', text: 'Способность эффективно управлять личными финансами', correct: true },
        { id: 'c', text: 'Знание всех банковских продуктов', correct: false },
        { id: 'd', text: 'Умение экономить на всём', correct: false }
      ]
    },
    {
      id: 2,
      text: 'Что из перечисленного является компонентом финансовой грамотности?',
      subtext: '(выберите один вариант)',
      points: 10,
      options: [
        { id: 'a', text: 'Умение вести учет доходов и расходов', correct: true },
        { id: 'b', text: 'Умение быстро тратить деньги', correct: false },
        { id: 'c', text: 'Игнорирование финансового планирования', correct: false },
        { id: 'd', text: 'Использование только наличных денег', correct: false }
      ]
    },
    {
      id: 3,
      text: 'Какой процент дохода рекомендуется откладывать на сбережения?',
      subtext: '(выберите один вариант)',
      points: 10,
      options: [
        { id: 'a', text: 'Нет правильного ответа', correct: false },
        { id: 'b', text: '10-20% от дохода', correct: true },
        { id: 'c', text: '50% от дохода', correct: false },
        { id: 'd', text: 'Всё зависит от возраста', correct: false }
      ]
    },
    {
      id: 4,
      text: 'Кто из перечисленных считается финансово грамотным человеком?',
      subtext: '(выберите один вариант)',
      points: 10,
      options: [
        { id: 'a', text: 'Тот, у кого много денег', correct: false },
        { id: 'b', text: 'Тот, кто умеет планировать бюджет и создавать накопления', correct: true },
        { id: 'c', text: 'Тот, кто никогда не берёт кредиты', correct: false },
        { id: 'd', text: 'Тот, кто инвестирует все деньги в акции', correct: false }
      ]
    }
  ]
},

// МОДУЛЬ 1 - КАРТОЧКА 2
102: {
  id: 102,
  title: 'Основы бюджетирования',
  description: 'Как планировать доходы и расходы',
  maxPoints: 40,
  totalQuestions: 4,
  questions: [
    {
      id: 1,
      text: 'Что такое бюджет?',
      subtext: '(выберите один вариант)',
      points: 10,
      options: [
        { id: 'a', text: 'План доходов и расходов на определённый период', correct: true },
        { id: 'b', text: 'Сумма всех налогов', correct: false },
        { id: 'c', text: 'Банковский счёт', correct: false },
        { id: 'd', text: 'Кредитный лимит', correct: false }
      ]
    },
    {
      id: 2,
      text: 'Что означает правило 50/30/20?',
      subtext: '(выберите один вариант)',
      points: 10,
      options: [
        { id: 'a', text: '50% на еду, 30% на одежду, 20% на развлечения', correct: false },
        { id: 'b', text: '50% на обязательные расходы, 30% на желания, 20% на сбережения', correct: true },
        { id: 'c', text: '50% на налоги, 30% на кредиты, 20% на жизнь', correct: false },
        { id: 'd', text: '50% на инвестиции, 30% на недвижимость, 20% на бизнес', correct: false }
      ]
    },
    {
      id: 3,
      text: 'Какой инструмент помогает вести учёт расходов?',
      subtext: '(выберите один вариант)',
      points: 10,
      options: [
        { id: 'a', text: 'Мобильные приложения для финансов', correct: true },
        { id: 'b', text: 'Кредитная карта', correct: false },
        { id: 'c', text: 'Потребительский кредит', correct: false },
        { id: 'd', text: 'Депозит', correct: false }
      ]
    },
    {
      id: 4,
      text: 'Что делать, если расходы превышают доходы?',
      subtext: '(выберите один вариант)',
      points: 10,
      options: [
        { id: 'a', text: 'Взять кредит', correct: false },
        { id: 'b', text: 'Пересмотреть бюджет и сократить ненужные расходы', correct: true },
        { id: 'c', text: 'Игнорировать проблему', correct: false },
        { id: 'd', text: 'Уволиться с работы', correct: false }
      ]
    }
  ]
},

// МОДУЛЬ 2 - КАРТОЧКА 1
103: {
  id: 103,
  title: 'Почему важно инвестировать?',
  description: 'Преимущества инвестирования',
  maxPoints: 40,
  totalQuestions: 4,
  questions: [
    {
      id: 1,
      text: 'Что такое инфляция?',
      subtext: '(выберите один вариант)',
      points: 10,
      options: [
        { id: 'a', text: 'Рост цен на товары и услуги', correct: true },
        { id: 'b', text: 'Снижение курса валюты', correct: false },
        { id: 'c', text: 'Увеличение налогов', correct: false },
        { id: 'd', text: 'Рост зарплат', correct: false }
      ]
    },
    {
      id: 2,
      text: 'Как инфляция влияет на сбережения?',
      subtext: '(выберите один вариант)',
      points: 10,
      options: [
        { id: 'a', text: 'Увеличивает их покупательную способность', correct: false },
        { id: 'b', text: 'Снижает их покупательную способность', correct: true },
        { id: 'c', text: 'Не влияет', correct: false },
        { id: 'd', text: 'Делает их безопаснее', correct: false }
      ]
    },
    {
      id: 3,
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
      id: 4,
      text: 'Почему важно начинать инвестировать рано?',
      subtext: '(выберите один вариант)',
      points: 10,
      options: [
        { id: 'a', text: 'Больше времени для роста капитала', correct: true },
        { id: 'b', text: 'Меньше налогов', correct: false },
        { id: 'c', text: 'Меньше рисков', correct: false },
        { id: 'd', text: 'Гарантированная доходность', correct: false }
      ]
    }
  ]
},

// МОДУЛЬ 2 - КАРТОЧКА 2
104: {
  id: 104,
  title: 'Виды инвестиций',
  description: 'Какие бывают инвестиционные инструменты',
  maxPoints: 40,
  totalQuestions: 4,
  questions: [
    {
      id: 1,
      text: 'Что такое акции?',
      subtext: '(выберите один вариант)',
      points: 10,
      options: [
        { id: 'a', text: 'Долговая расписка компании', correct: false },
        { id: 'b', text: 'Доля в компании', correct: true },
        { id: 'c', text: 'Банковский депозит', correct: false },
        { id: 'd', text: 'Государственная облигация', correct: false }
      ]
    },
    {
      id: 2,
      text: 'Что такое облигации?',
      subtext: '(выберите один вариант)',
      points: 10,
      options: [
        { id: 'a', text: 'Долговые ценные бумаги', correct: true },
        { id: 'b', text: 'Акции компании', correct: false },
        { id: 'c', text: 'Страховой полис', correct: false },
        { id: 'd', text: 'Кредитный договор', correct: false }
      ]
    },
    {
      id: 3,
      text: 'Что менее рискованно?',
      subtext: '(выберите один вариант)',
      points: 10,
      options: [
        { id: 'a', text: 'Акции молодых компаний', correct: false },
        { id: 'b', text: 'Государственные облигации', correct: true },
        { id: 'c', text: 'Криптовалюта', correct: false },
        { id: 'd', text: 'Форекс', correct: false }
      ]
    },
    {
      id: 4,
      text: 'Что такое диверсификация?',
      subtext: '(выберите один вариант)',
      points: 10,
      options: [
        { id: 'a', text: 'Вложение всех денег в один актив', correct: false },
        { id: 'b', text: 'Распределение инвестиций между разными активами', correct: true },
        { id: 'c', text: 'Вывод всех денег из инвестиций', correct: false },
        { id: 'd', text: 'Покупка только акций', correct: false }
      ]
    }
  ]
},

// МОДУЛЬ 2 - КАРТОЧКА 3
105: {
  id: 105,
  title: 'Как выбрать брокера?',
  description: 'Критерии выбора надежного брокера',
  maxPoints: 40,
  totalQuestions: 4,
  questions: [
    {
      id: 1,
      text: 'Что такое брокер?',
      subtext: '(выберите один вариант)',
      points: 10,
      options: [
        { id: 'a', text: 'Посредник между инвестором и биржей', correct: true },
        { id: 'b', text: 'Банк', correct: false },
        { id: 'c', text: 'Страховая компания', correct: false },
        { id: 'd', text: 'Инвестиционный фонд', correct: false }
      ]
    },
    {
      id: 2,
      text: 'На что обратить внимание при выборе брокера?',
      subtext: '(выберите один вариант)',
      points: 10,
      options: [
        { id: 'a', text: 'Наличие лицензии', correct: true },
        { id: 'b', text: 'Красивый сайт', correct: false },
        { id: 'c', text: 'Яркая реклама', correct: false },
        { id: 'd', text: 'Обещание 100% доходности', correct: false }
      ]
    },
    {
      id: 3,
      text: 'Что такое комиссия брокера?',
      subtext: '(выберите один вариант)',
      points: 10,
      options: [
        { id: 'a', text: 'Плата за обслуживание счета', correct: true },
        { id: 'b', text: 'Налог на прибыль', correct: false },
        { id: 'c', text: 'Дивиденды по акциям', correct: false },
        { id: 'd', text: 'Купон по облигациям', correct: false }
      ]
    },
    {
      id: 4,
      text: 'Как проверить легальность брокера?',
      subtext: '(выберите один вариант)',
      points: 10,
      options: [
        { id: 'a', text: 'Посмотреть отзывы', correct: false },
        { id: 'b', text: 'Проверить наличие лицензии на сайте ЦБ РФ', correct: true },
        { id: 'c', text: 'Спросить у друзей', correct: false },
        { id: 'd', text: 'Никак, все брокеры легальны', correct: false }
      ]
    }
  ]
},

// МОДУЛЬ 3 - КАРТОЧКА 1
106: {
  id: 106,
  title: 'Виды кредитов',
  description: 'Потребительский, ипотека, автокредит',
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
      text: 'Что такое автокредит?',
      subtext: '(выберите один вариант)',
      points: 10,
      options: [
        { id: 'a', text: 'Кредит на покупку автомобиля', correct: true },
        { id: 'b', text: 'Кредит на жильё', correct: false },
        { id: 'c', text: 'Кредит на образование', correct: false },
        { id: 'd', text: 'Кредит на лечение', correct: false }
      ]
    },
    {
      id: 3,
      text: 'Что такое потребительский кредит?',
      subtext: '(выберите один вариант)',
      points: 10,
      options: [
        { id: 'a', text: 'Кредит на любые цели без залога', correct: true },
        { id: 'b', text: 'Кредит под залог недвижимости', correct: false },
        { id: 'c', text: 'Кредит под залог автомобиля', correct: false },
        { id: 'd', text: 'Беспроцентный кредит', correct: false }
      ]
    },
    {
      id: 4,
      text: 'Какой платёж уменьшается со временем?',
      subtext: '(выберите один вариант)',
      points: 10,
      options: [
        { id: 'a', text: 'Аннуитетный', correct: false },
        { id: 'b', text: 'Дифференцированный', correct: true },
        { id: 'c', text: 'Фиксированный', correct: false },
        { id: 'd', text: 'Льготный', correct: false }
      ]
    }
  ]
},

// МОДУЛЬ 3 - КАРТОЧКА 2
107: {
  id: 107,
  title: 'Налоговые вычеты',
  description: 'Как вернуть часть уплаченных налогов',
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
        { id: 'a', text: '100 000 ₽', correct: false },
        { id: 'b', text: '260 000 ₽', correct: true },
        { id: 'c', text: '500 000 ₽', correct: false },
        { id: 'd', text: '1 000 000 ₽', correct: false }
      ]
    },
    {
      id: 3,
      text: 'На какие цели можно получить социальный вычет?',
      subtext: '(выберите один вариант)',
      points: 10,
      options: [
        { id: 'a', text: 'Лечение и обучение', correct: true },
        { id: 'b', text: 'Покупка автомобиля', correct: false },
        { id: 'c', text: 'Путешествия', correct: false },
        { id: 'd', text: 'Покупка квартиры', correct: false }
      ]
    },
    {
      id: 4,
      text: 'Что нужно сделать, чтобы получить вычет?',
      subtext: '(выберите один вариант)',
      points: 10,
      options: [
        { id: 'a', text: 'Подать декларацию 3-НДФЛ', correct: true },
        { id: 'b', text: 'Ничего, вычет приходит автоматически', correct: false },
        { id: 'c', text: 'Обратиться в банк', correct: false },
        { id: 'd', text: 'Обратиться в страховую компанию', correct: false }
      ]
    }
  ]
}
};
const allQuizzes = { ...generalQuizzes, ...moduleQuizzes };
// Функция для подсчета завершенных викторин (всех)
const getTotalCompletedCount = () => {
  const allQuizIds = [...Object.keys(generalQuizzes), ...Object.keys(moduleQuizzes)];
  return allQuizIds.filter(id => userRating.quizResults[id]?.completed).length;
};

// Функция для подсчета общего количества викторин
const getTotalQuizzesCount = () => {
  return Object.keys(generalQuizzes).length + Object.keys(moduleQuizzes).length;
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
  totalQuizzes: 13, // ← измените с 6 на 13
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
  const existingResult = userRating.quizResults[quizId];
  const wasAlreadyCompleted = existingResult?.completed === true;
  const oldPoints = existingResult?.points || 0;
  
  let newTotalPoints = userRating.totalPoints;
  let newCompletedQuizzes = userRating.completedQuizzes;
  let bestPoints = earnedPoints;
  
  if (wasAlreadyCompleted) {
    // Если викторина уже была пройдена, берем ЛУЧШИЙ результат
    bestPoints = Math.max(oldPoints, earnedPoints);
    const pointsDifference = bestPoints - oldPoints;
    
    if (pointsDifference > 0) {
      // Если новый результат лучше, добавляем разницу
      newTotalPoints = userRating.totalPoints + pointsDifference;
    } else {
      // Если новый результат хуже или равен, очки не меняются
      newTotalPoints = userRating.totalPoints;
    }
    newCompletedQuizzes = userRating.completedQuizzes; // счетчик не меняется
  } else {
    // Если викторина не была пройдена - просто добавляем очки
    newTotalPoints = userRating.totalPoints + earnedPoints;
    newCompletedQuizzes = userRating.completedQuizzes + 1;
  }
  
  const newRating = {
    ...userRating,
    totalPoints: newTotalPoints,
    completedQuizzes: newCompletedQuizzes,
    inProgressQuiz: null,
    quizProgress: {
      ...userRating.quizProgress,
      [quizId]: {
        completed: true,
        points: bestPoints,
        maxPoints: totalPoints,
        completedAt: new Date().toISOString(),
        bestScore: true
      }
    },
    quizResults: {
      ...userRating.quizResults,
      [quizId]: {
        completed: true,
        points: bestPoints,
        maxPoints: totalPoints,
        completedAt: new Date().toISOString()
      }
    }
  };
  
  localStorage.setItem('quizRating', JSON.stringify(newRating));
  setUserRating(newRating);
  
  // Для отладки
  console.log(`Викторина ${quizId}: старые очки=${oldPoints}, новые=${earnedPoints}, лучшие=${bestPoints}`);
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

const quizzesList = Object.values(generalQuizzes).map(quiz => ({
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
  
  // Ищем викторину в allQuizzes
  const quiz = allQuizzes[quizId];
  if (!quiz) return;
  
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
const currentArticle = getCurrentArticleData();
  const currentQ = selectedQuiz?.questions[currentQuestion];
  
const totalCompleted = getTotalCompletedCount();
const totalQuizzesCount = getTotalQuizzesCount();
const remainingQuizzes = totalQuizzesCount - totalCompleted;

const quizStats = {
  totalQuiz: totalQuizzesCount,
  completedQuiz: totalCompleted,
  remainingQuiz: remainingQuizzes,
  points: userRating.totalPoints,
  progressPercent: totalQuizzesCount > 0 
    ? Math.round((totalCompleted / totalQuizzesCount) * 100) 
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
  { id: 1, title: 'Что такое финансовая грамотность?', description: 'Базовые понятия и принципы', status: getQuizStatus(101), questions: '4 вопросов', points: getQuizPoints(101), maxPoints: 40, quizId: 101, buttonLabel: getQuizStatus(101) === 'Пройдено' ? 'Перепройти' : (getQuizStatus(101) === 'В процессе' ? 'Продолжить' : 'Пройти') },
  { id: 2, title: 'Основы бюджетирования', description: 'Как планировать доходы и расходы', status: getQuizStatus(102), questions: '4 вопросов', points: getQuizPoints(102), maxPoints: 40, quizId: 102, buttonLabel: getQuizStatus(102) === 'Пройдено' ? 'Перепройти' : (getQuizStatus(102) === 'В процессе' ? 'Продолжить' : 'Пройти') }
];

const module2Cards = [
  { id: 1, title: 'Почему важно инвестировать?', description: 'Преимущества инвестирования', status: getQuizStatus(103), questions: '4 вопросов', points: getQuizPoints(103), maxPoints: 40, quizId: 103, buttonLabel: getQuizStatus(103) === 'Пройдено' ? 'Перепройти' : (getQuizStatus(103) === 'В процессе' ? 'Продолжить' : 'Пройти') },
  { id: 2, title: 'Виды инвестиций', description: 'Какие бывают инвестиционные инструменты', status: getQuizStatus(104), questions: '4 вопросов', points: getQuizPoints(104), maxPoints: 40, quizId: 104, buttonLabel: getQuizStatus(104) === 'Пройдено' ? 'Перепройти' : (getQuizStatus(104) === 'В процессе' ? 'Продолжить' : 'Пройти') },
  { id: 3, title: 'Как выбрать брокера?', description: 'Критерии выбора надежного брокера', status: getQuizStatus(105), questions: '4 вопросов', points: getQuizPoints(105), maxPoints: 40, quizId: 105, buttonLabel: getQuizStatus(105) === 'Пройдено' ? 'Перепройти' : (getQuizStatus(105) === 'В процессе' ? 'Продолжить' : 'Пройти') }
];

const module3Cards = [
  { id: 1, title: 'Виды кредитов', description: 'Потребительский, ипотека, автокредит', status: getQuizStatus(106), questions: '4 вопросов', points: getQuizPoints(106), maxPoints: 40, quizId: 106, buttonLabel: getQuizStatus(106) === 'Пройдено' ? 'Перепройти' : (getQuizStatus(106) === 'В процессе' ? 'Продолжить' : 'Пройти') },
  { id: 2, title: 'Налоговые вычеты', description: 'Как вернуть часть уплаченных налогов', status: getQuizStatus(107), questions: '4 вопросов', points: getQuizPoints(107), maxPoints: 40, quizId: 107, buttonLabel: getQuizStatus(107) === 'Пройдено' ? 'Перепройти' : (getQuizStatus(107) === 'В процессе' ? 'Продолжить' : 'Пройти') }
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
        className={`module-item-card 
          ${card.quizId ? 'clickable' : ''} 
          ${activeQuizId === card.quizId ? 'active' : ''}
          ${card.status === 'В процессе' && activeQuizId !== card.quizId ? 'in-progress' : ''}`}
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
           {card.buttonLabel === 'Перепройти' && <span className="action-icon">↻</span>}
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
        className={`module-item-card 
          ${card.quizId ? 'clickable' : ''} 
          ${activeQuizId === card.quizId ? 'active' : ''}
          ${card.status === 'В процессе' && activeQuizId !== card.quizId ? 'in-progress' : ''}`}
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
           {card.buttonLabel === 'Перепройти' && <span className="action-icon">↻</span>}
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
        className={`module-item-card 
          ${card.quizId ? 'clickable' : ''} 
          ${activeQuizId === card.quizId ? 'active' : ''}
          ${card.status === 'В процессе' && activeQuizId !== card.quizId ? 'in-progress' : ''}`}
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
           {card.buttonLabel === 'Перепройти' && <span className="action-icon">↻</span>}
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
              <span className="progress-number">{totalCompleted}</span>
            </div>
          </div>

          <div className="stats-container-sidebar">
            <div className="stat-card-sidebar">
              <div className="stat-value-sidebar">{userRating.totalPoints}</div>
              <div className="stat-label-sidebar">очков</div>
            </div>
            <div className="stat-card-sidebar">
              <div className="stat-value-sidebar">{totalCompleted}</div>
              <div className="stat-label-sidebar">пройдено</div>
            </div>
            <div className="stat-card-sidebar">
              <div className="stat-value-sidebar">{totalQuizzesCount - totalCompleted}</div>
              <div className="stat-label-sidebar">осталось</div>
            </div>
          </div>
        </div>

        {/* Блок "Продолжить" - ВНУТРИ quiz-sidebar */}
        {isContinueVisible && (
          <div className="continue-block">
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
                <div className="continue-article-title">{currentArticle.title}</div>
                <div className="continue-article-module">{currentArticle.module}</div>
              </div>
              <div className="progress-section">
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${currentArticle.progress}%` }}></div>
                </div>
                <div className="progress-stats">
                  <span className="progress-completed">завершено</span>
                  <span className="progress-percent">{currentArticle.progress}%</span>
                </div>
              </div>
              <button 
                className="continue-button" 
                onClick={() => handleContinueClick(currentArticle.id)}
              >
                Продолжить <span className="arrow">→</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;