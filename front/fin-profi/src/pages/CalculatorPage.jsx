import React, { useState, useEffect } from 'react';
import { IconChartLine, IconTrophy } from '@tabler/icons-react';
import './CalculatorPage.css';
import { Invest } from '../assets/icons';  
import investIcon from '../assets/icons/invest.svg'; // импорт как URL
import cupIcon from '../assets/icons/cup.svg'; // импорт как URL
import { calculatorAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import ArrowRightIcon from '../assets/icons/arrow_right.svg';  

const CalculatorPage = () => {
  const [initialAmount, setInitialAmount] = useState(700000);
  const [monthlyContribution, setMonthlyContribution] = useState(50000);
  const [interestRate, setInterestRate] = useState(16);
  const [durationUnit, setDurationUnit] = useState('year');
  const [duration, setDuration] = useState(20);
  const [capitalization, setCapitalization] = useState('ЕЖЕМЕСЯЧНО');
  const [inflationEnabled, setInflationEnabled] = useState(true);
  const [inflationRate, setInflationRate] = useState(4);
  const [taxEnabled, setTaxEnabled] = useState(false);
  const [taxRate, setTaxRate] = useState(13);
  const [investmentMethod, setInvestmentMethod] = useState('НАДЕЖНЫЙ');
  const [selectedCalculator, setSelectedCalculator] = useState(1);
  const [isInterestDragging, setIsInterestDragging] = useState(false);
  const [isDurationDragging, setIsDurationDragging] = useState(false);
  const [interestProgress, setInterestProgress] = useState(((16 - 1) / 29) * 100);
const [durationProgress, setDurationProgress] = useState(((20 - 1) / 49) * 100);
const navigate = useNavigate();
const [currentArticle, setCurrentArticle] = useState(null);
  

// Список калькуляторов для правого сайдбара
  const calculators = [
    { id: 1, title: "Калькулятор доходности", description: "Расчет прибыли от инвестиций" },
    { id: 2, title: "Кредитный калькулятор", description: "Расчет переплаты по кредиту" },
    { id: 3, title: "Депозитный калькулятор", description: "Расчет дохода по вкладу" },
  ];

  const capitalizationOptions = ['ЕЖЕМЕСЯЧНО', 'ЕЖЕКВАРТАЛЬНО', 'ЕЖЕГОДНО'];
  const investmentMethods = ['НАДЕЖНЫЙ', 'УМЕРЕННЫЙ', 'РИСКОВАННЫЙ'];

  // Результаты расчета
const [results, setResults] = useState({
  finalAmount: '0 ₽',
  investedAmount: '0 ₽',
  accruedInterest: '0 ₽',
  capitalGrowth: '0%'
});

  const summaryRows = [
    { label: "Итоговая сумма", value: results.finalAmount, bordered: true },
    { label: "Инвестировано", value: results.investedAmount, bordered: true },
    { label: "Начислено процентов", value: results.accruedInterest, bordered: true },
    { label: "Прирост капитала", value: results.capitalGrowth, bordered: false },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
  };

  const formatYears = (value) => {
    const mod10 = value % 10;
    const mod100 = value % 100;

    if (mod10 === 1 && mod100 !== 11) return `${value} год`;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
      return `${value} года`;
    }
    return `${value} лет`;
  };

  const durationMin = durationUnit === 'year' ? 1 : 1;
  const durationMax = durationUnit === 'year' ? 50 : 600;
  const durationValueLabel = durationUnit === 'year' 
    ? formatYears(duration) 
    : `${duration} мес`;

  const handleDurationUnitChange = (unit) => {
    setDurationUnit(unit);
    if (unit === 'year') {
      setDuration(Math.min(Math.max(duration, 1), 50));
    } else {
      setDuration(Math.min(Math.max(duration * 12, 1), 600));
    }
  };
const ColoredInvest = ({ color, ...props }) => (
  <div style={{ color, display: 'inline-flex' }}>
    <Invest {...props} />
  </div>
);

// Замените handleCalculate:
const handleCalculate = async () => {
  const params = {
    initial_amount: initialAmount,
    monthly_deposit: monthlyContribution,
    annual_rate: interestRate,
    period: duration,
    period_type: durationUnit === 'year' ? 'years' : 'months',
    capitalization: capitalization === 'ЕЖЕМЕСЯЧНО' ? 'monthly' : 
                    capitalization === 'ЕЖЕКВАРТАЛЬНО' ? 'quarterly' : 'yearly',
    investment_method: investmentMethod === 'НАДЕЖНЫЙ' ? 'reliable' : 
                       investmentMethod === 'УМЕРЕННЫЙ' ? 'moderate' : 'risky',
    inflation: inflationEnabled ? inflationRate : undefined,
    tax: taxEnabled ? taxRate : undefined
  };

  // Убираем undefined параметры
  Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

  const result = await calculatorAPI.calculate(params);
  
  if (result) {
    setResults({
      finalAmount: formatCurrency(result.total_amount),
      investedAmount: formatCurrency(initialAmount + monthlyContribution * duration),
      accruedInterest: formatCurrency(result.interest_earned),
      capitalGrowth: `${result.capital_growth_percent}%`
    });
  }
};

  const getCalculatorCardClass = (calculatorId) => {
    if (selectedCalculator === calculatorId) {
      return 'calculator-card-active';
    }
    return 'calculator-card-inactive';
  };
useEffect(() => {
  const articlesData = [
    { id: 1, title: 'Что такое инвестиции?', module: 'Модуль 1 — Основы инвестиций' },
    { id: 2, title: 'Виды активов', module: 'Модуль 1 — Основы инвестиций' },
    { id: 3, title: 'Акции', module: 'Модуль 2 — Инвестиционные инструменты' },
    { id: 4, title: 'Облигации', module: 'Модуль 2 — Инвестиционные инструменты' },
    { id: 5, title: 'ETF и фонды', module: 'Модуль 2 — Инвестиционные инструменты' },
    { id: 6, title: 'Инвестиционный портфель', module: 'Модуль 3 — Принципы инвестирования' },
    { id: 7, title: 'Горизонт инвестирования', module: 'Модуль 3 — Принципы инвестирования' }
  ];

  const savedProgress = localStorage.getItem('articleProgress');
  if (savedProgress) {
    const progress = JSON.parse(savedProgress);
    for (let i = 1; i <= 7; i++) {
      if (!progress[i] || progress[i] < 100) {
        const article = articlesData.find(a => a.id === i);
        if (article) {
          setCurrentArticle({
            ...article,
            progress: progress[i] || 0
          });
        }
        break;
      }
    }
  }
}, []);
  return (
    <div className="calculator-layout">
      {/* Центральный блок */}
      <div className="calculator-main">
        {/* Карточка 1: Калькулятор */}
        <div className="module-card calculator-card">
          <div className="calculator-header">
            <div className="calculator-icon">
<div className="yellow-circle-icon">
  <Invest width={20} height={20} style={{ color: '#1a1a1a', opacity: 1 }} 
  />
</div>
            </div>
            <div className="calculator-info">
              <h1 className="calculator-title">Калькулятор доходности</h1>
              <p className="calculator-description">Рассчитайте потенциальную доходность ваших инвестиций</p>
            </div>
          </div>

          {/* Форма калькулятора */}
          <div className="calculator-form">
            {/* Левая колонка */}
            <div className="form-left">
<div className="form-field">
  <label className="field-label">Начальная сумма</label>
  <input
    type="text"
    className="field-value-input"
    value={initialAmount}
    onChange={(e) => {
      const value = e.target.value.replace(/[^0-9]/g, '');
      setInitialAmount(value ? Number(value) : 0);
    }}
  />
</div>

<div className="form-field">
  <label className="field-label">Ежемесячное пополнение</label>
  <input
    type="text"
    className="field-value-input"
    value={monthlyContribution}
    onChange={(e) => {
      const value = e.target.value.replace(/[^0-9]/g, '');
      setMonthlyContribution(value ? Number(value) : 0);
    }}
  />
</div>

<div className="form-field range-field">
  <div className="range-header">
    <label className="field-label">Процентная ставка (годовых)</label>
    <div className="range-value">{interestRate}%</div>
  </div>
  <div className="range-slider-container">
    <div className="range-track-bg"></div>
    <div 
      className="range-track-fill" 
      style={{ width: `${((interestRate - 1) / 29) * 100}%` }}
    ></div>
    <input
  type="range"
  min="1"
  max="30"
  step="1"
  value={interestRate}
  onChange={(e) => {
    const newValue = Number(e.target.value);
    setInterestRate(newValue);
    // Принудительно обновляем состояние для re-render
    setInterestRate(newValue);
  }}
  className="range-input"
/>
  </div>
  <div className="range-labels">
    <span>1%</span>
    <span>30%</span>
  </div>
</div>
<div className="form-field range-field">
  <div className="range-header">
    <div className="range-label-group">
      <label className="field-label">Срок инвестирования</label>
      <div className="unit-toggle">
        <button
          className={`unit-btn ${durationUnit === 'year' ? 'active' : ''}`}
          onClick={() => handleDurationUnitChange('year')}
        >
          ГОД
        </button>
        <button
          className={`unit-btn ${durationUnit === 'month' ? 'active' : ''}`}
          onClick={() => handleDurationUnitChange('month')}
        >
          МЕСЯЦ
        </button>
      </div>
    </div>
    <div className="range-value">{durationValueLabel}</div>
  </div>
  <div className="range-slider-container">
    <div className="range-track-bg"></div>
    <div 
      className="range-track-fill" 
      style={{ width: `${((duration - durationMin) / (durationMax - durationMin)) * 100}%` }}
    ></div>
    <input
      type="range"
      min={durationMin}
      max={durationMax}
      step="1"
      value={duration}
      onChange={(e) => setDuration(Number(e.target.value))}
      className="range-input"
    />
  </div>
  <div className="range-labels">
    <span>{durationUnit === 'year' ? '1 год' : '1 мес'}</span>
    <span>{durationUnit === 'year' ? '50 лет' : '600 мес'}</span>
  </div>
</div>
            </div>

            {/* Правая колонка */}
            <div className="form-right">
              <div className="form-section">
                <label className="section-label">Капитализация</label>
                <div className="capitalization-buttons">
                  {capitalizationOptions.map((option) => (
                    <button
                      key={option}
                      className={`cap-btn ${capitalization === option ? 'active' : ''}`}
                      onClick={() => setCapitalization(option)}
                    >
                      <span className={`cap-dot ${capitalization === option ? 'active' : ''}`}></span>
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <label className="section-label">Доп. настройки</label>
                
                <div className="setting-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={inflationEnabled}
                      onChange={(e) => setInflationEnabled(e.target.checked)}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="setting-text">Инфляция</span>
                  </label>
                  <div className="setting-input">
                    <input
                      type="text"
                      value={`${inflationRate}%`}
                      onChange={(e) => {
                        const val = parseInt(e.target.value.replace(/[^\d]/g, ''));
                        if (!isNaN(val)) setInflationRate(val);
                      }}
                      disabled={!inflationEnabled}
                      className="small-input"
                    />
                  </div>
                </div>

                <div className="setting-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={taxEnabled}
                      onChange={(e) => setTaxEnabled(e.target.checked)}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="setting-text">Налог</span>
                  </label>
                  <div className="setting-input">
                    <input
                      type="text"
                      value={taxEnabled ? `${taxRate}%` : ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value.replace(/[^\d]/g, ''));
                        if (!isNaN(val)) setTaxRate(val);
                      }}
                      disabled={!taxEnabled}
                      className="small-input"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <label className="section-label">Метод инвестирования</label>
                <select
                  value={investmentMethod}
                  onChange={(e) => setInvestmentMethod(e.target.value)}
                  className="method-select"
                >
                  {investmentMethods.map((method) => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Кнопка рассчитать */}
          <div className="calculator-action">
            <button className="calculate-btn" onClick={handleCalculate}>
              Рассчитать
            </button>
          </div>
        </div>

        {/* Карточка 2: Результаты расчета */}
        <div className="module-card results-card-block">
          <div className="results-section">
            <h2 className="results-section-title">Результаты расчета</h2>
            <div className="results-card">
              <div className="result-main">
                <div className="result-icon">
                  <img src={cupIcon} alt="invest" width={20} height={20} className="invest-icon-inactive" />
                  
                </div>
                <div className="result-main-content">
                  <span className="result-main-label">Итог через {duration} {durationUnit === 'year' ? 'лет' : 'мес'}</span>
                  <output className="result-main-value">{results.finalAmount}</output>
                </div>
              </div>
              <div className="result-divider"></div>
              <dl className="result-summary">
                {summaryRows.map((row, index) => (
                  <div
                    key={`${row.label}-${index}`}
                    className={`result-row ${row.bordered ? 'bordered' : ''}`}
                  >
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>


{/* Правый сайдбар - список калькуляторов */}
{/* Правый сайдбар */}
<div className="calculator-sidebar">
  <div className="sidebar-calculators">
    <div className="calculators-header">
      <h3 className="calculators-title">ВЫБЕРИТЕ КАЛЬКУЛЯТОР</h3>
    </div>
    <div className="calculators-list">
      {calculators.map((calculator) => (
        <button
          key={calculator.id}
          className={getCalculatorCardClass(calculator.id)}
          onClick={() => setSelectedCalculator(calculator.id)}
        >
          <div className="calculator-card-content">
            <div className="calculator-card-icon">
              {selectedCalculator === calculator.id ? (
                <div className="active-icon-wrapper">
                  <img src={investIcon} alt="invest" width={20} height={20} className="invest-icon-active" />
                </div>
              ) : (
                <div className="inactive-icon-wrapper">
                  <img src={investIcon} alt="invest" width={20} height={20} className="invest-icon-inactive" />
                </div>
              )}
            </div>
            <div className="calculator-card-info">
              <h4 className="calculator-card-title">{calculator.title}</h4>
              <p className="calculator-card-description">{calculator.description}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  </div>

  {/* 🔥 Блок "Продолжить" — такой же как на главной */}
  {currentArticle && (
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
          onClick={() => navigate(`/article/${currentArticle.id}`)}
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

export default CalculatorPage;