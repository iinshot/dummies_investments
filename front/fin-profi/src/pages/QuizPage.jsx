import React, { useState, useEffect, useRef } from 'react';
import { IconChartPieFilled, IconArrowDown } from '@tabler/icons-react';
import './QuizPage.css';
import QuizIcon from '../assets/icons/quiz.svg';
import PieIcon from '../assets/icons/pie.svg';
import ArrowLeftIcon from '../assets/icons/arrow_left.svg';
import ArrowRightIcon from '../assets/icons/arrow_right.svg';
import CheckIcon from '../assets/icons/check.svg';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

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
    { id: 1, title: 'Что такое инвестиции?', module: 'Модуль 1 — Основы инвестиций' },
    { id: 2, title: 'Виды активов?', module: 'Модуль 1 — Основы инвестиций' },
    { id: 3, title: 'Акции', module: 'Модуль 2 — Инвестиционные инструменты' },
    { id: 4, title: 'Облигации', module: 'Модуль 2 — Инвестиционные инструменты' },
    { id: 5, title: 'ETF и фонды', module: 'Модуль 2 — Инвестиционные инструменты' },
    { id: 6, title: 'Инвестиционный портфель', module: 'Модуль 3 — Принципы инвестирования' },
    { id: 7, title: 'Горизонт инвестирования', module: 'Модуль 3 — Принципы инвестирования' }
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
      title: 'Введение в инвестиции',
      description: 'Проверьте базовые знания о начале инвестирования',
      maxPoints: 40,
      totalQuestions: 4,
      questions: [
        {
          id: 1,
          text: 'Какая минимальная сумма нужна, чтобы начать инвестировать на бирже?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: '100 рублей, можно купить пай в фонде', correct: true },
            { id: 'b', text: 'Минимум 10 000 рублей', correct: false },
            { id: 'c', text: 'Нужно ждать зарплату', correct: false },
            { id: 'd', text: 'Минимум 100 000 рублей', correct: false }
          ]
        },
        {
          id: 2,
          text: 'Что из перечисленного является преимуществом долгосрочных инвестиций?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Снижается влияние краткосрочных колебаний', correct: true },
            { id: 'b', text: 'Можно выйти в любой момент без потерь', correct: false },
            { id: 'c', text: 'Сложный процент работает дольше', correct: true },
            { id: 'd', text: 'Гарантированная доходность', correct: false }
          ]
        },
        {
          id: 3,
          text: 'Какой временной горизонт считается долгосрочным в инвестициях?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'До 1 года', correct: false },
            { id: 'b', text: 'От 3 до 5 лет', correct: false },
            { id: 'c', text: 'Более 7-10 лет', correct: true },
            { id: 'd', text: '1-2 года', correct: false }
          ]
        },
        {
          id: 4,
          text: 'Что такое "усреднение цены" (DCA)?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Покупка акций на пике роста', correct: false },
            { id: 'b', text: 'Регулярная покупка активов на фиксированную сумму', correct: true },
            { id: 'c', text: 'Продажа активов при падении', correct: false },
            { id: 'd', text: 'Покупка только облигаций', correct: false }
          ]
        }
      ]
    },
    2: {
      id: 2,
      title: 'Риски и доходность',
      description: 'Понимание рисков и потенциальной доходности инвестиций',
      maxPoints: 40,
      totalQuestions: 4,
      questions: [
        {
          id: 1,
          text: 'Какой актив исторически приносит самую высокую доходность в долгосрочной перспективе?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Банковский вклад', correct: false },
            { id: 'b', text: 'Акции', correct: true },
            { id: 'c', text: 'Облигации', correct: false },
            { id: 'd', text: 'Наличные деньги', correct: false }
          ]
        },
        {
          id: 2,
          text: 'Что такое волатильность?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Стабильность цены', correct: false },
            { id: 'b', text: 'Степень колебания цены актива', correct: true },
            { id: 'c', text: 'Скорость продажи актива', correct: false },
            { id: 'd', text: 'Размер дивидендов', correct: false }
          ]
        },
        {
          id: 3,
          text: 'Какие риски существуют при инвестировании?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Инфляционный риск', correct: true },
            { id: 'b', text: 'Рыночный риск', correct: true },
            { id: 'c', text: 'Риск банкротства эмитента', correct: true },
            { id: 'd', text: 'Риск загара брокера', correct: false }
          ]
        },
        {
          id: 4,
          text: 'Золото на фондовом рынке — это...',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Товарный актив и "тихая гавань"', correct: true },
            { id: 'b', text: 'Акция золотодобывающей компании', correct: false },
            { id: 'c', text: 'Вид облигации', correct: false },
            { id: 'd', text: 'Криптовалюта', correct: false }
          ]
        }
      ]
    },
    3: {
      id: 3,
      title: 'Акции и дивиденды',
      description: 'Как работают акции и дивиденды',
      maxPoints: 40,
      totalQuestions: 4,
      questions: [
        {
          id: 1,
          text: 'Что такое дивидендная доходность?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Сумма всех дивидендов за год', correct: false },
            { id: 'b', text: 'Отношение дивиденда на акцию к цене акции', correct: true },
            { id: 'c', text: 'Рост цены акции в процентах', correct: false },
            { id: 'd', text: 'Налог на дивиденды', correct: false }
          ]
        },
        {
          id: 2,
          text: 'Какие компании чаще всего платят дивиденды?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Зрелые компании со стабильной прибылью', correct: true },
            { id: 'b', text: 'Молодые растущие компании', correct: false },
            { id: 'c', text: 'Компании из сектора потребительских товаров', correct: true },
            { id: 'd', text: 'Стартапы', correct: false }
          ]
        },
        {
          id: 3,
          text: 'Что такое сплит акций?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Разделение акций на более мелкие без изменения капитализации', correct: true },
            { id: 'b', text: 'Объединение акций', correct: false },
            { id: 'c', text: 'Выплата дивидендов акциями', correct: false },
            { id: 'd', text: 'Дополнительная эмиссия', correct: false }
          ]
        },
        {
          id: 4,
          text: 'Какой показатель помогает оценить переоцененность акции?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'P/E (цена/прибыль)', correct: true },
            { id: 'b', text: 'ROE', correct: false },
            { id: 'c', text: 'EPS', correct: false },
            { id: 'd', text: 'EBITDA', correct: false }
          ]
        }
      ]
    },
    4: {
      id: 4,
      title: 'Облигации и фонды',
      description: 'Как работают облигации и биржевые фонды',
      maxPoints: 40,
      totalQuestions: 4,
      questions: [
        {
          id: 1,
          text: 'Что такое НКД по облигациям?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Налог на купонный доход', correct: false },
            { id: 'b', text: 'Накопленный купонный доход при покупке', correct: true },
            { id: 'c', text: 'Номинальная стоимость облигации', correct: false },
            { id: 'd', text: 'Норма купонной доходности', correct: false }
          ]
        },
        {
          id: 2,
          text: 'Чем ETF отличается от ПИФа?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'ETF торгуется на бирже в реальном времени', correct: true },
            { id: 'b', text: 'ПИФ можно купить только в банке', correct: false },
            { id: 'c', text: 'Комиссии ETF обычно ниже', correct: true },
            { id: 'd', text: 'ПИФ торгуется как акция', correct: false }
          ]
        },
        {
          id: 3,
          text: 'Что такое дюрация облигации?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Дата погашения облигации', correct: false },
            { id: 'b', text: 'Средневзвешенный срок возврата инвестиций', correct: true },
            { id: 'c', text: 'Размер купона', correct: false },
            { id: 'd', text: 'Кредитный рейтинг эмитента', correct: false }
          ]
        },
        {
          id: 4,
          text: 'Какой фонд подходит для пассивного инвестора?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Активный ПИФ', correct: false },
            { id: 'b', text: 'Индексный ETF, копирующий рынок', correct: true },
            { id: 'c', text: 'Венчурный фонд', correct: false },
            { id: 'd', text: 'Хедж-фонд', correct: false }
          ]
        }
      ]
    },
    5: {
      id: 5,
      title: 'Диверсификация и управление рисками',
      description: 'Как распределять инвестиции и снижать риски',
      maxPoints: 40,
      totalQuestions: 4,
      questions: [
        {
          id: 1,
          text: 'Что такое диверсификация?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Вложение всех денег в одну акцию', correct: false },
            { id: 'b', text: 'Распределение инвестиций между разными активами', correct: true },
            { id: 'c', text: 'Продажа активов при падении', correct: false },
            { id: 'd', text: 'Покупка только государственных облигаций', correct: false }
          ]
        },
        {
          id: 2,
          text: 'Как снизить риски инвестиционного портфеля?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Инвестировать в разные классы активов', correct: true },
            { id: 'b', text: 'Инвестировать в разные страны и валюты', correct: true },
            { id: 'c', text: 'Купить акции одной компании', correct: false },
            { id: 'd', text: 'Использовать ETF и фонды', correct: true }
          ]
        },
        {
          id: 3,
          text: 'Что такое ребалансировка портфеля?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Полная замена всех активов', correct: false },
            { id: 'b', text: 'Возврат портфеля к целевым пропорциям', correct: true },
            { id: 'c', text: 'Вывод всех денег с рынка', correct: false },
            { id: 'd', text: 'Покупка только выросших активов', correct: false }
          ]
        },
        {
          id: 4,
          text: 'Какая корреляция между акциями и облигациями в кризис?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Положительная (растут вместе)', correct: false },
            { id: 'b', text: 'Отрицательная или низкая (облигации держатся)', correct: true },
            { id: 'c', text: 'Идеальная положительная', correct: false },
            { id: 'd', text: 'Акции растут, облигации падают', correct: false }
          ]
        }
      ]
    },
    6: {
      id: 6,
      title: 'Долгосрочное инвестирование',
      description: 'Стратегии для долгосрочного накопления капитала',
      maxPoints: 40,
      totalQuestions: 4,
      questions: [
        {
          id: 1,
          text: 'Что важнее при долгосрочном инвестировании?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Время в рынке', correct: true },
            { id: 'b', text: 'Попытка угадать дно', correct: false },
            { id: 'c', text: 'Ежедневная торговля', correct: false },
            { id: 'd', text: 'Использование кредитного плеча', correct: false }
          ]
        },
        {
          id: 2,
          text: 'Как часто нужно проверять свой портфель, чтобы не поддаваться эмоциям?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Каждый час', correct: false },
            { id: 'b', text: 'Раз в день', correct: false },
            { id: 'c', text: 'Раз в квартал или реже', correct: true },
            { id: 'd', text: 'Только при новостях', correct: false }
          ]
        },
        {
          id: 3,
          text: 'Что такое "снежный ком"?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Пирамида в трейдинге', correct: false },
            { id: 'b', text: 'Эффект сложного процента', correct: true },
            { id: 'c', text: 'Схема быстрого обогащения', correct: false },
            { id: 'd', text: 'Продажа активов', correct: false }
          ]
        },
        {
          id: 4,
          text: 'Какая стратегия подходит для долгосрочного накопления капитала?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Регулярное пополнение портфеля', correct: true },
            { id: 'b', text: 'Реинвестирование дивидендов', correct: true },
            { id: 'c', text: 'Попытка предсказать курс', correct: false },
            { id: 'd', text: 'Покупка и удержание на годы', correct: true }
          ]
        }
      ]
    }
  };

  const moduleQuizzes = {
    // СТАТЬЯ 1 - Введение в инвестиции
    101: {
      id: 101,
      title: 'Введение в инвестиции',
      description: 'Базовые понятия и принципы инвестирования',
      maxPoints: 80,
      totalQuestions: 8,
      questions: [
        {
          id: 1,
          text: 'Что такое инвестиции простыми словами?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Это способ быстро разбогатеть, вложив 100 рублей', correct: false },
            { id: 'b', text: 'Это вложение денег сегодня с целью получить больше денег в будущем', correct: true },
            { id: 'c', text: 'Это хранение денег дома под подушкой', correct: false },
            { id: 'd', text: 'Это покупка товаров по скидке', correct: false }
          ]
        },
        {
          id: 2,
          text: 'Почему деньги со временем теряют свою покупательную способность?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Из-за дефляции', correct: false },
            { id: 'b', text: 'Из-за инфляции', correct: true },
            { id: 'c', text: 'Из-за роста курса доллара', correct: false },
            { id: 'd', text: 'Из-за экономического кризиса 2008 года', correct: false }
          ]
        },
        {
          id: 3,
          text: 'Какой процент годовой инфляции в России считается средним?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: '1–2%', correct: false },
            { id: 'b', text: '4–7%', correct: true },
            { id: 'c', text: '10–15%', correct: false },
            { id: 'd', text: '20–25%', correct: false }
          ]
        },
        {
          id: 4,
          text: 'Благодаря какому эффекту разница между накоплениями и инвестициями становится заметной через 10 лет?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Эффект домино', correct: false },
            { id: 'b', text: 'Сложный процент (процент на процент)', correct: true },
            { id: 'c', text: 'Эффект Вавилонской башни', correct: false },
            { id: 'd', text: 'Линейный процент', correct: false }
          ]
        },
        {
          id: 5,
          text: 'Чем, согласно тексту, НЕ являются инвестиции?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Способом быстро разбогатеть', correct: true },
            { id: 'b', text: 'Азартной игрой или казино', correct: true },
            { id: 'c', text: 'Гарантией прибыли (в отличие от вклада)', correct: true },
            { id: 'd', text: 'Инструментом для защиты от инфляции', correct: false }
          ]
        },
        {
          id: 6,
          text: 'С чего, по мнению автора, должен начинаться путь инвестора?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'С открытия брокерского счета и покупки первых акций', correct: false },
            { id: 'b', text: 'С покупки дорогого костюма трейдера', correct: false },
            { id: 'c', text: 'С понимания собственных финансов, погашения долгов и создания финансовой подушки', correct: true },
            { id: 'd', text: 'С поиска мошенников, которые обещают 30% годовых', correct: false }
          ]
        },
        {
          id: 7,
          text: 'Какой размер финансовой подушки безопасности рекомендуется иметь?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Запас на 1 месяц', correct: false },
            { id: 'b', text: 'Запас на 3-6 месяцев', correct: true },
            { id: 'c', text: 'Запас на 5 лет', correct: false },
            { id: 'd', text: 'Сумму, равную стоимости квартиры', correct: false }
          ]
        },
        {
          id: 8,
          text: 'Какая реальная доходность сбалансированного портфеля указана в тексте?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: '20–30% годовых', correct: false },
            { id: 'b', text: '50% годовых', correct: false },
            { id: 'c', text: '8–12% годовых', correct: true },
            { id: 'd', text: '1–3% годовых', correct: false }
          ]
        }
      ]
    },

    // СТАТЬЯ 2 - Основные виды активов
    102: {
      id: 102,
      title: 'Основные виды активов',
      description: 'Какие бывают инвестиционные инструменты',
      maxPoints: 80,
      totalQuestions: 8,
      questions: [
        {
          id: 1,
          text: 'Что такое актив в контексте инвестиций?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Это всё, что забирает деньги из кармана', correct: false },
            { id: 'b', text: 'Это финансовый инструмент, который вы покупаете в расчёте на рост стоимости или регулярные выплаты', correct: true },
            { id: 'c', text: 'Это только наличные деньги', correct: false },
            { id: 'd', text: 'Это квартира, в которой вы живёте и платите за коммунальные услуги', correct: false }
          ]
        },
        {
          id: 2,
          text: 'Чем акции отличаются от облигаций?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Акции дают долю (совладение) в компании', correct: true },
            { id: 'b', text: 'Облигации — это долг, который нужно вернуть с процентами', correct: true },
            { id: 'c', text: 'Акции гарантируют фиксированный доход, а облигации — нет', correct: false },
            { id: 'd', text: 'Облигации считаются более консервативным инструментом, чем акции', correct: true }
          ]
        },
        {
          id: 3,
          text: 'Какими двумя способами акции приносят доход?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Рост цены (продал дороже, чем купил)', correct: true },
            { id: 'b', text: 'Купоны (регулярные процентные выплаты)', correct: false },
            { id: 'c', text: 'Дивиденды (часть прибыли компании)', correct: true },
            { id: 'd', text: 'Дисконт при погашении', correct: false }
          ]
        },
        {
          id: 4,
          text: 'Что такое инвестиционные фонды (ETF) и в чём их главное преимущество?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Это инструмент, дающий гарантию 20% годовых', correct: false },
            { id: 'b', text: 'Это готовый набор активов, который обеспечивает диверсификацию (риск снижается)', correct: true },
            { id: 'c', text: 'Это вклад в банке со страховкой АСВ', correct: false },
            { id: 'd', text: 'Это замена паспорту инвестора', correct: false }
          ]
        },
        {
          id: 5,
          text: 'Для чего в инвестиционном портфеле обычно используют покупку валюты?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Для получения высоких дивидендов и купонов', correct: false },
            { id: 'b', text: 'Для защиты сбережений от ослабления национальной валюты (рубля)', correct: true },
            { id: 'c', text: 'Для спекуляций и быстрого обогащения за неделю', correct: false },
            { id: 'd', text: 'Чтобы получать процентный доход как по облигациям', correct: false }
          ]
        },
        {
          id: 6,
          text: 'Какой драгоценный металл считается самой популярной "безопасной гаванью" в периоды кризисов?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Серебро', correct: false },
            { id: 'b', text: 'Платина', correct: false },
            { id: 'c', text: 'Золото', correct: true },
            { id: 'd', text: 'Бронза', correct: false }
          ]
        },
        {
          id: 7,
          text: 'Какие недостатки есть у недвижимости как актива?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Низкая ликвидность (сложно быстро продать без потери цены)', correct: true },
            { id: 'b', text: 'Нужен большой стартовый капитал', correct: true },
            { id: 'c', text: 'Всегда падает в цене при любом кризисе', correct: false },
            { id: 'd', text: 'Есть дополнительные расходы (налоги, коммунальные платежи, ремонт)', correct: true }
          ]
        },
        {
          id: 8,
          text: 'Какой совет даётся новичкам про криптовалюты?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Вложить в криптовалюту все сбережения, так как это самый надёжный актив', correct: false },
            { id: 'b', text: 'Не вкладывать в криптовалюты больше, чем вы готовы потерять', correct: true },
            { id: 'c', text: 'Криптовалюта гарантирует стабильный доход, как облигации', correct: false },
            { id: 'd', text: 'Криптовалюты не подвержены волатильности', correct: false }
          ]
        }
      ]
    },

    // СТАТЬЯ 3 - Акции — подробный разбор
    103: {
      id: 103,
      title: 'Акции — подробный разбор',
      description: 'Как работают акции и дивиденды',
      maxPoints: 80,
      totalQuestions: 8,
      questions: [
        {
          id: 1,
          text: 'Что происходит, когда инвестор покупает обыкновенную акцию?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Он даёт компании деньги в долг под фиксированный процент', correct: false },
            { id: 'b', text: 'Он становится совладельцем (акционером) компании', correct: true },
            { id: 'c', text: 'Он получает право на гарантированный купонный доход', correct: false },
            { id: 'd', text: 'Он становится кредитором первой очереди', correct: false }
          ]
        },
        {
          id: 2,
          text: 'Какими двумя основными способами акции приносят доход инвестору?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Рост цены (продал дороже, чем купил)', correct: true },
            { id: 'b', text: 'Дивиденды (часть прибыли компании)', correct: true },
            { id: 'c', text: 'Купонные выплаты', correct: false },
            { id: 'd', text: 'Тело вклада', correct: false }
          ]
        },
        {
          id: 3,
          text: 'В чём главное отличие growth-компаний от dividend-компаний?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Growth-компании не платят дивиденды, реинвестируя прибыль в развитие', correct: true },
            { id: 'b', text: 'Dividend-компании всегда обанкрочиваются, а growth-компании — нет', correct: false },
            { id: 'c', text: 'Growth-компании платят дивиденды каждый месяц', correct: false },
            { id: 'd', text: 'Dividend-компании нельзя покупать новичкам', correct: false }
          ]
        },
        {
          id: 4,
          text: 'Почему цена акций может постоянно меняться?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Из-за ожиданий инвесторов относительно будущего', correct: true },
            { id: 'b', text: 'Из-за новостей о компании и экономики в целом', correct: true },
            { id: 'c', text: 'Из-за настроений (страха или жадности) на рынке', correct: true },
            { id: 'd', text: 'Потому что компания каждый день меняет цену на свои товары', correct: false }
          ]
        },
        {
          id: 5,
          text: 'Что показывает показатель P/E (цена/прибыль)?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Сколько компания должна банкам', correct: false },
            { id: 'b', text: 'За сколько лет компания окупит свою стоимость при текущей прибыли', correct: true },
            { id: 'c', text: 'Размер дивидендов в процентах', correct: false },
            { id: 'd', text: 'Количество акций в обращении', correct: false }
          ]
        },
        {
          id: 6,
          text: 'Чем привилегированные акции отличаются от обыкновенных?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'По префам часто платят более высокие дивиденды', correct: true },
            { id: 'b', text: 'Выплаты дивидендов по префам приоритетны', correct: true },
            { id: 'c', text: 'Префы обычно дают право голоса на собрании акционеров, а обыкновенные — нет', correct: false },
            { id: 'd', text: 'Префы — это долг, а обыкновенные акции — доля', correct: false }
          ]
        },
        {
          id: 7,
          text: 'Что такое "голубые фишки" на фондовом рынке?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Акции крупнейших, самых надёжных и ликвидных компаний', correct: true },
            { id: 'b', text: 'Самые дешёвые акции на рынке', correct: false },
            { id: 'c', text: 'Акции компаний третьего эшелона с низкой ликвидностью', correct: false },
            { id: 'd', text: 'Акции технологических стартапов', correct: false }
          ]
        },
        {
          id: 8,
          text: 'Какой совет даётся новичкам при покупке первых акций?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Начинать с небольшой суммы и не вкладывать всё сразу', correct: true },
            { id: 'b', text: 'Выбирать компанию, бизнес которой вам понятен', correct: true },
            { id: 'c', text: 'Пытаться угадать идеальный момент для покупки (войти в рынок на самом дне)', correct: false },
            { id: 'd', text: 'Не паниковать при падениях и смотреть на компанию, а не только на график', correct: true }
          ]
        }
      ]
    },

    // СТАТЬЯ 4 - Облигации — подробный разбор
    104: {
      id: 104,
      title: 'Облигации — подробный разбор',
      description: 'Как работают облигации и купоны',
      maxPoints: 80,
      totalQuestions: 8,
      questions: [
        {
          id: 1,
          text: 'Чем облигация принципиально отличается от акции?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Облигация даёт право голоса в компании', correct: false },
            { id: 'b', text: 'Облигация — это долг, а акция — доля в бизнесе', correct: true },
            { id: 'c', text: 'Облигации можно купить только в валюте', correct: false },
            { id: 'd', text: 'Облигация не имеет срока погашения, в отличие от акции', correct: false }
          ]
        },
        {
          id: 2,
          text: 'Что такое купон по облигации и номинал?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Купон — это процент, который эмитент платит за пользование деньгами', correct: true },
            { id: 'b', text: 'Номинал — это сумма, которую эмитент обязуется вернуть при погашении', correct: true },
            { id: 'c', text: 'Купон — это сумма, которую эмитент возвращает в конце срока', correct: false },
            { id: 'd', text: 'Номинал — это регулярная выплата процентов', correct: false }
          ]
        },
        {
          id: 3,
          text: 'Какие облигации считаются самыми надёжными в России?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Корпоративные облигации небольших компаний', correct: false },
            { id: 'b', text: 'Муниципальные облигации', correct: false },
            { id: 'c', text: 'Государственные облигации (ОФЗ)', correct: true },
            { id: 'd', text: 'Валютные облигации', correct: false }
          ]
        },
        {
          id: 4,
          text: 'Почему цена облигации на бирже может снизиться, если ключевая ставка выросла?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Потому что компания-эмитент сразу теряет прибыль', correct: false },
            { id: 'b', text: 'Обратная зависимость: новые облигации с более высоким купоном делают старые менее привлекательными', correct: true },
            { id: 'c', text: 'Потому что при росте ставок государство отзывает все старые облигации', correct: false },
            { id: 'd', text: 'Потому что это прямое указание закона', correct: false }
          ]
        },
        {
          id: 5,
          text: 'Что такое НКД (накопленный купонный доход) при покупке облигации?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Это дополнительная комиссия брокера', correct: false },
            { id: 'b', text: 'Это часть купона, которая уже "набежала" с прошлой выплаты, и её платят продавцу', correct: true },
            { id: 'c', text: 'Это штраф за досрочную продажу', correct: false },
            { id: 'd', text: 'Это налог на прибыль', correct: false }
          ]
        },
        {
          id: 6,
          text: 'На какой показатель доходности стоит ориентироваться при сравнении разных облигаций?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Только на размер купона в процентах', correct: false },
            { id: 'b', text: 'На доходность к погашению (учитывает купоны, цену покупки и номинал)', correct: true },
            { id: 'c', text: 'На цвет облигации в приложении брокера', correct: false },
            { id: 'd', text: 'На объём торгов за последний час', correct: false }
          ]
        },
        {
          id: 7,
          text: 'Что такое кредитный риск при инвестировании в облигации?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Риск того, что цена облигации упадёт из-за роста ставок', correct: false },
            { id: 'b', text: 'Риск того, что эмитент не сможет выплатить долг или купон', correct: true },
            { id: 'c', text: 'Риск колебаний валютного курса', correct: false },
            { id: 'd', text: 'Риск того, что облигацию нельзя быстро продать', correct: false }
          ]
        },
        {
          id: 8,
          text: 'Кому в первую очередь подойдут инвестиции в облигации?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Консервативным инвесторам, кто не готов к резким колебаниям стоимости', correct: true },
            { id: 'b', text: 'Тем, кто копит на конкретную цель с известным сроком', correct: true },
            { id: 'c', text: 'Тем, кто ищет способ быстро удвоить капитал за месяц', correct: false },
            { id: 'd', text: 'Новичкам, которые хотят привыкнуть к рынку без лишнего стресса', correct: true }
          ]
        }
      ]
    },

    // СТАТЬЯ 5 - Инвестиционные фонды (ETF и ПИФы)
    105: {
      id: 105,
      title: 'Инвестиционные фонды (ETF и ПИФы)',
      description: 'Как работают фонды и их преимущества',
      maxPoints: 80,
      totalQuestions: 8,
      questions: [
        {
          id: 1,
          text: 'Как работает инвестиционный фонд простыми словами?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Это "общий котёл", куда инвесторы складывают деньги, а управляющие вкладывают их в активы', correct: true },
            { id: 'b', text: 'Это брокерский счёт, на котором лежат только наличные', correct: false },
            { id: 'c', text: 'Это объединение спекулянтов для игры на бирже', correct: false },
            { id: 'd', text: 'Это гарантированный способ получить 20% годовых без риска', correct: false }
          ]
        },
        {
          id: 2,
          text: 'В чём главное отличие ETF от обычного ПИФа?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'ETF торгуются на бирже как обычные акции (цена меняется в реальном времени)', correct: true },
            { id: 'b', text: 'ETF обычно пассивно копируют индекс (не пытаются его обыграть)', correct: true },
            { id: 'c', text: 'У ETF обычно комиссия ниже, чем у активных ПИФов', correct: true },
            { id: 'd', text: 'ETF можно купить только раз в день по цене закрытия', correct: false }
          ]
        },
        {
          id: 3,
          text: 'Какое главное преимущество даёт покупка фонда вместо отдельных акций?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Гарантия сохранения капитала', correct: false },
            { id: 'b', text: 'Диверсификация — вы вкладываетесь в десятки компаний одной покупкой, снижая риск', correct: true },
            { id: 'c', text: 'Освобождение от уплаты налогов', correct: false },
            { id: 'd', text: 'Возможность заработать 100% за месяц', correct: false }
          ]
        },
        {
          id: 4,
          text: 'Почему комиссия фонда так важна на длинной дистанции?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Потому что она платится один раз при входе в фонд', correct: false },
            { id: 'b', text: 'Потому что она ежегодно вычитается из стоимости активов и снижает итоговый капитал за счёт сложного процента', correct: true },
            { id: 'c', text: 'Потому что без неё нельзя торговать фондом', correct: false },
            { id: 'd', text: 'Потому что комиссия идёт напрямую инвесторам', correct: false }
          ]
        },
        {
          id: 5,
          text: 'Что такое пассивный фонд (фонд, следующий за индексом)?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Фонд, где управляющий активно выбирает лучшие акции', correct: false },
            { id: 'b', text: 'Фонд, который копирует состав индекса (например, S&P 500) по алгоритму, без попыток его обыграть', correct: true },
            { id: 'c', text: 'Фонд, который даёт отрицательную доходность', correct: false },
            { id: 'd', text: 'Фонд, который инвестирует только в наличные деньги', correct: false }
          ]
        },
        {
          id: 6,
          text: 'Какой тип фонда подойдёт новичку для самого первого шага?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Широкий фонд акций с низкой комиссией', correct: true },
            { id: 'b', text: 'Смешанный фонд (акции + облигации) с понятной логикой', correct: true },
            { id: 'c', text: 'Узкоспециализированный фонд на искусственный интеллект с высокой комиссией', correct: false },
            { id: 'd', text: 'Фонд с плечом (кредитным рычагом) 5x', correct: false }
          ]
        },
        {
          id: 7,
          text: 'Что такое риск отслеживания (tracking error) для ETF?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Вероятность того, что эмитент фонда обанкротится', correct: false },
            { id: 'b', text: 'Ситуация, когда фонд не точно повторяет свой индекс из-за комиссий, задержек в ребалансировке и других факторов', correct: true },
            { id: 'c', text: 'Риск того, что фонд заблокирует вывод средств', correct: false },
            { id: 'd', text: 'Шанс того, что цена фонда упадёт на 50% за день', correct: false }
          ]
        },
        {
          id: 8,
          text: 'Какие риски НЕ устраняются покупкой диверсифицированного фонда?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Рыночный риск (если падает весь рынок — падает и фонд)', correct: true },
            { id: 'b', text: 'Валютный риск (если фонд в долларах, а расходы в рублях)', correct: true },
            { id: 'c', text: 'Риск банкротства одной конкретной компании', correct: false },
            { id: 'd', text: 'Риск того, что фонд окажется мошенническим и в него лучше не вкладывать', correct: true }
          ]
        }
      ]
    },

    // СТАТЬЯ 6 - Как собрать инвестиционный портфель
    106: {
      id: 106,
      title: 'Как собрать инвестиционный портфель',
      description: 'Принципы формирования портфеля',
      maxPoints: 80,
      totalQuestions: 8,
      questions: [
        {
          id: 1,
          text: 'Что такое инвестиционный портфель?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Это случайный набор акций, которые понравились инвестору', correct: false },
            { id: 'b', text: 'Это продуманная комбинация активов, где каждый элемент подобран под определённую цель', correct: true },
            { id: 'c', text: 'Это брокерский счёт с минимальным остатком', correct: false },
            { id: 'd', text: 'Это гарантированный способ получить 50% годовых', correct: false }
          ]
        },
        {
          id: 2,
          text: 'Зачем нужен портфель, а не просто покупка отдельных активов?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Чтобы сгладить колебания: когда один инструмент падает, другой может расти или оставаться стабильным', correct: true },
            { id: 'b', text: 'Чтобы согласовать инвестиции с финансовыми целями', correct: true },
            { id: 'c', text: 'Чтобы полностью исключить любые риски потерь', correct: false },
            { id: 'd', text: 'Чтобы не зависеть от поведения одного типа активов', correct: true }
          ]
        },
        {
          id: 3,
          text: 'Какую роль в портфеле обычно выполняют акции?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Обеспечивают стабильность и регулярный купонный доход', correct: false },
            { id: 'b', text: 'Отвечают за рост, но несут наибольшую волатильность', correct: true },
            { id: 'c', text: 'Защищают от кризисов и падения рынка', correct: false },
            { id: 'd', text: 'Являются аналогом денег на чёрный день', correct: false }
          ]
        },
        {
          id: 4,
          text: 'Какую роль в портфеле выполняют облигации?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Обеспечивают стабильность и регулярный доход через купоны', correct: true },
            { id: 'b', text: 'Меньше колеблются в цене по сравнению с акциями', correct: true },
            { id: 'c', text: 'Выполняют роль "подушки" при падении акций', correct: true },
            { id: 'd', text: 'Дают самый высокий потенциал роста среди всех активов', correct: false }
          ]
        },
        {
          id: 5,
          text: 'Какой портфель считается агрессивным?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: '70% облигаций и 30% акций', correct: false },
            { id: 'b', text: '50% акций и 50% облигаций', correct: false },
            { id: 'c', text: '80% акций и 20% остальных инструментов', correct: true },
            { id: 'd', text: '100% банковского вклада', correct: false }
          ]
        },
        {
          id: 6,
          text: 'Что такое ребалансировка портфеля?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Полная замена всех активов на новые раз в месяц', correct: false },
            { id: 'b', text: 'Продажа подорожавших активов и покупка отставших для возврата к исходным пропорциям', correct: true },
            { id: 'c', text: 'Вывод всех денег с брокерского счёта', correct: false },
            { id: 'd', text: 'Вложение дополнительных средств без изменения структуры', correct: false }
          ]
        },
        {
          id: 7,
          text: 'Какая частота ребалансировки считается разумной для большинства инвесторов?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Каждый день (для максимальной точности)', correct: false },
            { id: 'b', text: 'Раз в год или при значительном отклонении от целевых пропорций', correct: true },
            { id: 'c', text: 'Раз в месяц обязательно', correct: false },
            { id: 'd', text: 'Ребалансировка не нужна вообще', correct: false }
          ]
        },
        {
          id: 8,
          text: 'Какие ошибки часто допускают новички при формировании портфеля?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Перегрузка одним активом или одной отраслью (недостаточная диверсификация)', correct: true },
            { id: 'b', text: 'Погоня за прошлой доходностью без понимания логики', correct: true },
            { id: 'c', text: 'Эмоциональные решения (продать всё при падении, купить при росте)', correct: true },
            { id: 'd', text: 'Регулярная ребалансировка раз в год', correct: false }
          ]
        }
      ]
    },

    // СТАТЬЯ 7 - Горизонт инвестирования
    107: {
      id: 107,
      title: 'Горизонт инвестирования',
      description: 'Как выбрать стратегию в зависимости от срока',
      maxPoints: 80,
      totalQuestions: 8,
      questions: [
        {
          id: 1,
          text: 'Что такое горизонт инвестирования?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Это максимальная сумма, которую вы готовы потерять', correct: false },
            { id: 'b', text: 'Это период времени, на который вы готовы вложить деньги без необходимости забирать их обратно', correct: true },
            { id: 'c', text: 'Это количество активов в вашем портфеле', correct: false },
            { id: 'd', text: 'Это доходность, которую вы ожидаете получить', correct: false }
          ]
        },
        {
          id: 2,
          text: 'Какой инструмент НЕ подходит для короткого горизонта инвестирования (до 3 лет)?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Банковский вклад с фиксированной ставкой', correct: false },
            { id: 'b', text: 'Короткие облигации с погашением в нужный срок', correct: false },
            { id: 'c', text: 'Акции отдельных компаний (из-за высокой волатильности)', correct: true },
            { id: 'd', text: 'Валюта для защиты от курсовых колебаний', correct: false }
          ]
        },
        {
          id: 3,
          text: 'Почему на длинном горизонте (7+ лет) можно позволить себе более агрессивную стратегию?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Потому что есть время переждать временные просадки и колебания рынка', correct: true },
            { id: 'b', text: 'Потому что на длинных отрезках акции исторически показывают доходность выше инфляции', correct: true },
            { id: 'c', text: 'Потому что короткие просадки на длинном сроке сглаживаются', correct: true },
            { id: 'd', text: 'Потому что длинный горизонт гарантирует отсутствие любых убытков', correct: false }
          ]
        },
        {
          id: 4,
          text: 'Какой инструмент НЕ подходит для длинного горизонта инвестирования (7+ лет)?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Акции компаний и широкие фонды акций', correct: false },
            { id: 'b', text: 'Инструменты с фиксированным низким доходом, которые не опережают инфляцию', correct: true },
            { id: 'c', text: 'Международная диверсификация', correct: false },
            { id: 'd', text: 'Регулярное пополнение портфеля', correct: false }
          ]
        },
        {
          id: 5,
          text: 'Что нужно сделать в первую очередь, прежде чем инвестировать на любой горизонт?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Купить самые доходные акции', correct: false },
            { id: 'b', text: 'Создать финансовую подушку безопасности (запас на 3-6 месяцев жизни)', correct: true },
            { id: 'c', text: 'Открыть кредитную карту', correct: false },
            { id: 'd', text: 'Продать все активы', correct: false }
          ]
        },
        {
          id: 6,
          text: 'Что делать, если горизонт инвестирования сократился?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Снизить долю рискованных активов в портфеле', correct: true },
            { id: 'b', text: 'Зафиксировать прибыль по выросшим позициям', correct: true },
            { id: 'c', text: 'Перевести часть средств в более предсказуемые инструменты', correct: true },
            { id: 'd', text: 'Вложить все деньги в высокорискованные криптовалюты', correct: false }
          ]
        },
        {
          id: 7,
          text: 'С какой периодичностью рекомендуется пересматривать свои цели и горизонт инвестирования?',
          subtext: '(выберите один вариант)',
          points: 10,
          options: [
            { id: 'a', text: 'Каждый день', correct: false },
            { id: 'b', text: 'Раз в год (или при значительном изменении жизненных обстоятельств)', correct: true },
            { id: 'c', text: 'Раз в пять лет', correct: false },
            { id: 'd', text: 'Никогда, план должен быть неизменным', correct: false }
          ]
        },
        {
          id: 8,
          text: 'Какие ошибки часто совершают инвесторы, связанные с горизонтом инвестирования?',
          subtext: '(выберите все верные)',
          points: 10,
          options: [
            { id: 'a', text: 'Инвестиции "на всякий случай" без чётко определённого срока и цели', correct: true },
            { id: 'b', text: 'Слишком консервативная стратегия на длинном сроке', correct: true },
            { id: 'c', text: 'Эмоциональная смена стратегии при краткосрочных колебаниях рынка', correct: true },
            { id: 'd', text: 'Регулярная ребалансировка портфеля раз в год', correct: false }
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


  useEffect(() => {
    console.log('🔵 QuizPage useEffect ЗАПУЩЕН');

    const loadRatingFromStorage = () => {
      const savedRating = localStorage.getItem('quizRating');
      console.log('📁 quizRating из localStorage:', savedRating);

      if (savedRating) {
        let parsedRating = JSON.parse(savedRating);

        // ПРОВЕРКА: если данные вложенные — извлекаем
        if (parsedRating.quiz_rating && !parsedRating.quizResults) {
          // Старый формат с вложенностью
          parsedRating = parsedRating.quiz_rating;
          // Исправляем localStorage
          localStorage.setItem('quizRating', JSON.stringify(parsedRating));
          console.log('🔄 Структура исправлена на плоскую');
        }

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
          totalQuizzes: 13,
          quizResults: {},
          inProgressQuiz: null,
          quizProgress: {}
        };
        localStorage.setItem('quizRating', JSON.stringify(initialRating));
        setUserRating(initialRating);
        console.log('📁 Создан начальный quizRating');
      }
    };

    const sync = async () => {
      const token = localStorage.getItem('access_token');
      console.log('🔑 Токен:', token ? 'Есть' : 'Нет');

      if (!token) {
        console.log('⚠️ Токена нет, грузим localStorage');
        loadRatingFromStorage();
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id_user;
        console.log('👤 userId:', userId);

        // ЛОГИН
        const justLoggedIn = sessionStorage.getItem('justLoggedIn');
        console.log('🏷️ justLoggedIn:', justLoggedIn);

        if (justLoggedIn) {
          sessionStorage.removeItem('justLoggedIn');
          console.log('📥 ЗАГРУЖАЕМ с сервера...');

          const res = await fetch(`/api/users/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          console.log('📡 Статус загрузки:', res.status);

          if (res.ok) {
            const data = await res.json();
            console.log('📦 Данные с сервера:', data);

            if (data.quiz_rating) {
              localStorage.setItem('quizRating', JSON.stringify(data.quiz_rating));
              console.log('✅ quizRating загружен с сервера', data.quiz_rating);
            } else {
              console.log('⚠️ quiz_rating отсутствует в ответе сервера');
            }
          }
        }

        // РЕГИСТРАЦИЯ
        const justRegistered = sessionStorage.getItem('justRegistered');
        console.log('🏷️ justRegistered:', justRegistered);

        if (justRegistered) {
          sessionStorage.removeItem('justRegistered');
          console.log('📤 ОТПРАВЛЯЕМ на сервер...');

          const qr = JSON.parse(localStorage.getItem('quizRating') || '{}');
          console.log('📦 Отправляемые данные:', qr);

          const urlParams = new URLSearchParams({
            points: qr.totalPoints || 0,
          }).toString()

          const res = await fetch(`/api/users/${userId}?${urlParams}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          console.log('📡 Статус отправки:', res.status);
        }
      } catch (error) {
        console.error('❌ Ошибка синхронизации:', error);
      }

      loadRatingFromStorage();
    };

    sync();
  }, []);

  useEffect(() => {
    const saveToBackend = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      if (userRating.totalPoints === 0 && userRating.completedQuizzes === 0) return;

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id_user;

        const urlParams = new URLSearchParams({
          points: userRating.totalPoints || 0,
        }).toString()

        await fetch(`/api/users/${userId}?${urlParams}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('💾 Автосохранено на бек:', userRating.totalPoints, 'очков');
      } catch (error) {
        console.error('❌ Ошибка автосохранения:', error);
      }
    };

    saveToBackend();
  }, [userRating]);
  // Функция для сохранения завершения викторины
  const saveQuizProgress = async (quizId, earnedPoints, totalPoints) => {
    const existingResult = userRating.quizResults[quizId];
    const wasAlreadyCompleted = existingResult?.completed === true;
    const oldPoints = existingResult?.points || 0;

    let newTotalPoints = userRating.totalPoints;
    let newCompletedQuizzes = userRating.completedQuizzes;
    let bestPoints = earnedPoints;

    if (wasAlreadyCompleted) {
      bestPoints = Math.max(oldPoints, earnedPoints);
      const pointsDifference = bestPoints - oldPoints;

      if (pointsDifference > 0) {
        newTotalPoints = userRating.totalPoints + pointsDifference;
      } else {
        newTotalPoints = userRating.totalPoints;
      }
      newCompletedQuizzes = userRating.completedQuizzes;
    } else {
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

    console.log(`Викторина ${quizId}: старые очки=${oldPoints}, новые=${earnedPoints}, лучшие=${bestPoints}`);

    // 🔥 Автоматическая синхронизация с бекендом
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id_user;
        const articleProgress = JSON.parse(localStorage.getItem('articleProgress') || '{}');
        const readArticles = Object.values(articleProgress).filter(p => p >= 100).length;

        // 1. Начинаем викторину (игнорируем ошибку, если уже начата)
        await fetch(`/api/quizzes/start_quiz/${quizId}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => { });

        // 2. Завершаем викторину (создает запись в UserQuiz)
        await fetch(`/api/quizzes/end_quiz/${quizId}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const urlParams = new URLSearchParams({
          points: newTotalPoints,
          total_points: readArticles * 200 + newTotalPoints
        }).toString()

        // 3. Сохраняем очки и quiz_rating в User
        await fetch(`/api/users/${userId}?${urlParams}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('✅ Все данные сохранены на бекенде');
      } catch (error) {
        console.error('❌ Ошибка синхронизации:', error);
      }
    }
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
  const mainRef = useRef(null);
  const scrollToTop = () => {
    setTimeout(() => {
      const quizMain = document.querySelector('.quiz-main');
      if (quizMain) {
        quizMain.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 150);
  };
  // убрать setTimeout полностью
  // Выбор викторины
  const handleSelectQuiz = (quizId) => {
    if (activeQuizId === quizId) return;

    const quiz = allQuizzes[quizId];
    if (!quiz) return;

    setSelectedQuiz(quiz);
    setActiveQuizId(quizId);

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

    // Прокрутка страницы вверх
    scrollToTop();
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
      // Прокрутка страницы вверх
      scrollToTop();
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
    { id: 1, title: 'Введение в инвестиции', description: 'Базовые понятия и принципы', status: getQuizStatus(101), questions: '8 вопросов', points: getQuizPoints(101), maxPoints: 80, quizId: 101, buttonLabel: getQuizStatus(101) === 'Пройдено' ? 'Перепройти' : (getQuizStatus(101) === 'В процессе' ? 'Продолжить' : 'Пройти') },
    { id: 2, title: 'Основные виды активов', description: 'Какие бывают инвестиционные инструменты', status: getQuizStatus(102), questions: '8 вопросов', points: getQuizPoints(102), maxPoints: 80, quizId: 102, buttonLabel: getQuizStatus(102) === 'Пройдено' ? 'Перепройти' : (getQuizStatus(102) === 'В процессе' ? 'Продолжить' : 'Пройти') }
  ];

  const module2Cards = [
    { id: 1, title: 'Акции — подробный разбор', description: 'Как работают акции и дивиденды', status: getQuizStatus(103), questions: '8 вопросов', points: getQuizPoints(103), maxPoints: 80, quizId: 103, buttonLabel: getQuizStatus(103) === 'Пройдено' ? 'Перепройти' : (getQuizStatus(103) === 'В процессе' ? 'Продолжить' : 'Пройти') },
    { id: 2, title: 'Облигации — подробный разбор', description: 'Как работают облигации и купоны', status: getQuizStatus(104), questions: '8 вопросов', points: getQuizPoints(104), maxPoints: 80, quizId: 104, buttonLabel: getQuizStatus(104) === 'Пройдено' ? 'Перепройти' : (getQuizStatus(104) === 'В процессе' ? 'Продолжить' : 'Пройти') },
    { id: 3, title: 'Инвестиционные фонды (ETF и ПИФы)', description: 'Как работают фонды и их преимущества', status: getQuizStatus(105), questions: '8 вопросов', points: getQuizPoints(105), maxPoints: 80, quizId: 105, buttonLabel: getQuizStatus(105) === 'Пройдено' ? 'Перепройти' : (getQuizStatus(105) === 'В процессе' ? 'Продолжить' : 'Пройти') }
  ];

  const module3Cards = [
    { id: 1, title: 'Как собрать инвестиционный портфель', description: 'Принципы формирования портфеля', status: getQuizStatus(106), questions: '8 вопросов', points: getQuizPoints(106), maxPoints: 80, quizId: 106, buttonLabel: getQuizStatus(106) === 'Пройдено' ? 'Перепройти' : (getQuizStatus(106) === 'В процессе' ? 'Продолжить' : 'Пройти') },
    { id: 2, title: 'Горизонт инвестирования', description: 'Как выбрать стратегию в зависимости от срока', status: getQuizStatus(107), questions: '8 вопросов', points: getQuizPoints(107), maxPoints: 80, quizId: 107, buttonLabel: getQuizStatus(107) === 'Пройдено' ? 'Перепройти' : (getQuizStatus(107) === 'В процессе' ? 'Продолжить' : 'Пройти') }
  ];

  return (
    <div className="quiz-layout">
      {/* Центральный блок */}
      <div className="quiz-main" ref={mainRef}>
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
                    {quiz.status === 'Пройдено' ? 'Перепройти ↻' : quiz.status === 'В процессе' ? 'Продолжить' : 'Пройти'}
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
                Продолжить <img src={ArrowRightIcon} alt="→" className="btn-icon" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;