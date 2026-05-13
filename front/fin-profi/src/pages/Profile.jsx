import React, { useEffect, useId, useRef, useState } from 'react'
import { useAuth } from '../hooks'
import { AUTH, BASE_URL, COLORS, POINTS_PER_ARTICLE, POINTS_PER_QUIZ } from '../constants'
import { Content, Section, NamedSection, SideBar, ContinueSection, ProgressBar, RankCard, ExpandButton, ProgressCircle, StatisticsCard, ActivityCard } from '../components'
import { Cup, Invest, Pencil, Play, ProfileCircle, Star, Share, Check, X, CheckCircle, Article, Energy, Exit } from '../assets/icons'
import "./Profile.css"
import clsx from 'clsx'
import { delay } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import ArrowRightIcon from '../assets/icons/arrow_right.svg';

export default function Profile() {
  const [auth, setAuth] = useAuth()
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [credentials, setCredentials] = useState({})
  const [activity, setActivity] = useState(null)
  const [totalUsers, setTotalUsers] = useState(0)
  const [userPoints, setUserPoints] = useState(0)
  const [quizPoints, setQuizPoints] = useState(0)
  const [currentArticle, setCurrentArticle] = useState(null);
  const [statistics, setStatistics] = useState({
    articles: {
      user_progress: 0,
      all_count: 0
    },
    quizzes: {
      user_progress: 0,
      all_count: 0
    }
  })
  const [rating, setRating] = useState(null)
  const scrollRef = useRef(null)

  const activityContainerRef = useRef(null)
  const [shouldShrink, setShouldShrink] = useState(false)

  const { userId } = useParams()
  const currentUserId = localStorage.getItem("id")
  const navigate = useNavigate()

  const nextUser = rating?.at(-2)
  const user = rating?.at(-1)
  const ratingUser = {}
  async function loadCredentials(id) {
    try {
      const response = await fetch(`/api/users/${id}`)
      const data = await response.json()
      setCredentials(data)
    } catch (e) {
      console.error(e)
    }
  }

  async function updateCredentials(id) {
    const urlParams = new URLSearchParams(credentials).toString()

    try {
      const response = await fetch(`/api/users/${id}?${urlParams}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        }
      })
    } catch (e) {
      console.error(e)
    }
  }
  async function loadActivity(id) {
    try {
      const response = await fetch(`/api/users/${id}/activity`)
      const data = await response.json()
      // Показываем только завершенные статьи и викторины
      const filtered = data.filter(item => {
        if (item.type === 'article') return item.created_at != null && item.name != null;
        if (item.type === 'quiz') return item.created_at != null;
        return false;
      });
      setActivity(filtered)
    } catch (e) {
      console.error(e)
    }
  }

  async function loadStatistics(id) {
    try {
      const [statsRes, userRes] = await Promise.all([
        fetch(`/api/users/${id}/statistics`),
        fetch(`/api/users/${id}`)
      ]);
      const data = await statsRes.json();
      const userData = await userRes.json();

      setStatistics(data);

      // 🔥 Очки ТОЛЬКО из quiz_rating и statistics (НЕ суммируем с user.points)
      const quizPointsFromQR = userData.quiz_rating?.totalPoints ||
        userData.quiz_rating?.points ||
        data.quizzes.user_progress;

      const articlePoints = data.articles.user_progress * POINTS_PER_ARTICLE;

      setUserPoints(articlePoints + quizPointsFromQR);
      setQuizPoints(quizPointsFromQR);

      // 🔥 НЕ обновляем БД здесь — это вызывает бесконечный рост
    } catch (e) {
      console.error(e);
    }
  }

  async function loadRating(id) {
    try {
      const response = await fetch(`/api/users/${id}/rating`)
      const data = await response.json()

      const r = await Promise.all(data.map(async (dataObj, index) => {
        const response_1 = await fetch(`/api/users/${dataObj.id_user}/statistics`)
        const data_1 = await response_1.json()

        return {
          id: dataObj.id_user,
          name: dataObj.name,
          points: dataObj.total_points
        }
      }))

      r.sort((a, b) => b.total_points - a.total_points)

      setRating(r)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    const id = userId || currentUserId;

    if (!id || id === 'undefined' || id === 'null') {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          loadCredentials(payload.id_user);
          loadActivity(payload.id_user);
          loadStatistics(payload.id_user);
          loadRating(payload.id_user);
        } catch (e) { }
      }
      return;
    }

    // Только загружаем данные, без синхронизации
    loadCredentials(id);
    loadActivity(id);
    loadStatistics(id);
    loadRating(id);
  }, [userId, currentUserId]);

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
            setCurrentArticle({ ...article, progress: progress[i] || 0 });
          }
          break;
        }
      }
    }
  }, []);
  useEffect(() => {
    fetch('/api/users/users_count')
      .then(r => r.json())
      .then(d => setTotalUsers(d.count))
  }, [])
  // В Profile.jsx добавьте этот useEffect:
  useEffect(() => {
    const handleFocus = () => {
      const id = userId || currentUserId || localStorage.getItem('id')
      if (id) {
        loadStatistics(id)
        loadActivity(id)
        loadRating(id)
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [userId, currentUserId])
  useEffect(() => {
    if (!rating) return

    setTimeout(() => {
      const container = scrollRef.current

      container?.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth"
      })
    }, 333)
  }, [rating])

  useEffect(() => {
    if (!activity) return

    const { scrollHeight, clientHeight } = activityContainerRef.current

    setShouldShrink(scrollHeight > clientHeight)
  }, [activity])

  useEffect(() => {
    if (isEditing == false) return

    const handleEnterKey = async (event) => {
      if (event.key === "Enter") {
        await updateCredentials(currentUserId)
        setIsEditing(false)
      }
    }

    window.addEventListener('keydown', handleEnterKey)

    return () => window.removeEventListener('keydown', handleEnterKey)
  }, [isEditing, credentials])
  console.log('📊 userPoints:', userPoints, 'quizPoints:', quizPoints,
    'articles:', statistics.articles.user_progress,
    'sum:', (userPoints || 0) + (quizPoints || 0));
  return (
    <>
      <Content>
        <Section
          padding="32px 40px"
          shrink
          className="user-info"
        >
          <ProfileCircle width={96} height={96} />

          <div className="user-credentials">
            <div className="username">
              <input
                name="username"
                type="text"
                value={credentials.name ?? ""}
                className="h1"
                readOnly={!isEditing}
                onChange={(e) => setCredentials(prevCredentials => (
                  { ...prevCredentials, name: e.target.value }
                ))}
              />
            </div>

            <div className="email">
              <input
                name="email"
                type="text"
                value={credentials.email ?? ""}
                className="body"
                readOnly={!isEditing}
                onChange={(e) => setCredentials(prevCredentials => (
                  { ...prevCredentials, email: e.target.value }
                ))}
              />
            </div>
          </div>

          {isEditing ?
            <div className="expand-button-group">
              <ExpandButton
                icon={<X />}
                text="Отменить"
                onClick={async () => {
                  await loadCredentials(user.id)
                  setIsEditing(false)
                }}
              />

              <ExpandButton
                icon={<Check />}
                text="Принять"
                primary
                onClick={async () => {
                  await updateCredentials(currentUserId)
                  setIsEditing(false)
                }}
              />
            </div>
            :
            <div className="expand-button-group">
              {userId == currentUserId || (!userId && currentUserId) && <ExpandButton
                icon={<Exit />}
                text="Выйти"
                onClick={() => {
                  localStorage.clear()
                  setAuth(AUTH.GUEST)
                  navigate("/")
                }}
              />}

              <ExpandButton
                icon={copied ? <Check /> : <Share />}
                text={copied ? "Скопировано" : "Поделиться"}
                delay={0.1}
                onClick={async () => {
                  await navigator.clipboard.writeText(`${BASE_URL}/profile/${userId}`)

                  setCopied(true)

                  setTimeout(() => setCopied(false), 1000)
                }}
              />

              <ExpandButton
                icon={<Pencil />}
                text="Редактировать"
                delay={0.2}
                onClick={() => setIsEditing(true)}
                primary
              />
            </div>
          }
        </Section>

        <Section
          padding="0"
          className="statistics"
          shrink
        >
          <StatisticsCard
            sectionProps={{
              text: "Общий прогресс",
              icon: <Energy height={10} width={10} />,
              className: "quizes"
            }}
            progress={(statistics.articles.user_progress + statistics.quizzes.user_progress) / (7 + 13) * 100}
            value={statistics.articles.user_progress + statistics.quizzes.user_progress}
            data={[
              {
                text: "Всего очков",
                value: credentials.total_points
              }
            ]}
            dark
          />

          <StatisticsCard
            sectionProps={{
              text: "Статьи",
              icon: <Article height={10} width={10} />,
              className: "articles"
            }}
            progress={statistics.articles.user_progress / statistics.articles.all_count * 100}
            value={statistics.articles.user_progress}
            data={[
              {
                text: "Прочитано статей",
                value: statistics.articles.user_progress
              },
              {
                text: "Осталось статей",
                value: statistics.articles.all_count - statistics.articles.user_progress
              },
              {
                text: "Получено очков",
                value: statistics.articles.user_progress * POINTS_PER_ARTICLE
              }
            ]}
          />

          <StatisticsCard
            sectionProps={{
              text: "Викторины",
              icon: <CheckCircle height={10} width={10} />,
              className: "quizes"
            }}
            progress={statistics.quizzes.user_progress / 13 * 100}  // ← всего 13 викторин
            value={statistics.quizzes.user_progress}
            data={[
              {
                text: "Пройдено викторин",
                value: statistics.quizzes.user_progress
              },
              {
                text: "Осталось викторин",
                value: 13 - statistics.quizzes.user_progress  // ← 13 вместо statistics.quizzes.all_count
              },
              {
                text: "Получено очков",
                value: credentials.points
              }
            ]}
          />
        </Section>

        <NamedSection
          icon={<Invest />}
          text="Недавняя активность"
          padding="32px 40px"
          gap="24px"
          className="activity"
          ref={activityContainerRef}
          shrink={shouldShrink}
        >
          {activity && activity.map((activityObj, index) => (
            <ActivityCard
              key={index}
              {...activityObj}
              delay={0.05 * index}
            />
          ))}
        </NamedSection>
      </Content>

      <SideBar>
        <NamedSection
          icon={<Cup height={14} width={14} />}
          text="Рейтинг"
          gap="12px"
          className="ranking"
          ref={scrollRef}
        >
          <div className="rank-list">
            {rating && rating.slice(0, 8).map((user, index) => (
              <RankCard
                key={user.id}
                highlight={
                  clsx(
                    index === 0 && "leader",
                    String(user.id) === String(currentUserId) && "you"  // ← СРАВНИВАЕМ ID
                  )
                }
                index={index + 1}
                user={user}
                delay={0.025 * index}
              />
            ))}

            {rating && rating.length > 8 && <>
              <div className="divider">
                <div className="dashed-line"></div>
                <span style={{ color: COLORS.BACKGROUND }} className="label">•••</span>
                <div className="dashed-line"></div>
              </div>

              <RankCard
                key={nextUser.id}
                index={rating.length - 1}
                user={nextUser}
                delay={0.025 * 8}
              />

              <RankCard
                key={user.id}
                index={rating.length}
                highlight="you"
                user={user}
                delay={0.025 * 9}
              />
            </>}
          </div>
        </NamedSection>
{/* 
        {rating && rating[0].id != currentUserId && rating.length > 1 && <NamedSection
          icon={<Star />}
          text="До следующего места"
          gap="8px"
          shrink
          className="next-rank"
        >
          <div className="content-header">
            <div className="points">
              <span
                style={{ color: COLORS.TEXT }}
                className="digits"
              >{nextUser.points - user.points}</span>

              <span
                style={{ color: COLORS.MID_GRAY }}
                className="small"
              >очков осталось</span>
            </div>

            <div className="user">
              <span
                style={{ color: COLORS.TEXT }}
                className="body"
              >{rating.length - 1}-е место</span>

              <span
                style={{ color: COLORS.MID_GRAY }}
                className="small"
              >{nextUser.name}</span>
            </div>
          </div>

          <ProgressBar
            value={user.points / nextUser.points * 100}
            height={8}
          />

          <span
            style={{
              color: COLORS.MID_GRAY,
              textAlign: "center"
            }}
            className="small"
          >{user.points} / {nextUser.points} очков</span>
        </NamedSection>} */}

        {currentArticle && (
          <div className="continue-block" style={{ marginTop: 0 }}>
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
      </SideBar>
    </>
  )
}