import React, { useEffect, useId, useRef, useState } from 'react'
import { useAuth } from '../hooks'
import { AUTH, BASE_URL, COLORS, POINTS_PER_ARTICLE, POINTS_PER_QUIZ } from '../constants'
import { Content, Section, NamedSection, SideBar, ContinueSection, ProgressBar, RankCard, ExpandButton, ProgressCircle, StatisticsCard, ActivityCard } from '../components'
import { Cup, Invest, Pencil, Play, ProfileCircle, Star, Share, Check, X, CheckCircle, Article, Energy, Exit } from '../assets/icons'
import "./Profile.css"
import clsx from 'clsx'
import { delay } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'

export default function Profile() {
  const [auth, setAuth] = useAuth()
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [credentials, setCredentials] = useState({})
  const [activity, setActivity] = useState(null)
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

  async function loadCredentials(id) {
    try {
      const response = await fetch(`${BASE_URL}/api/users/${id}`)
      const data = await response.json()

      setCredentials(data)
    } catch (e) {
      console.error(e)
    }
  }

  async function updateCredentials(id) {
    try {
      const params = new URLSearchParams(credentials).toString()
      const response = await fetch(`${BASE_URL}/api/users/${id}?${params}`, {
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
      const response = await fetch(`${BASE_URL}/api/users/${id}/activity`)
      const data = await response.json()

      setActivity(data)
    } catch (e) {
      console.error(e)
    }
  }

  async function loadStatistics(id) {
    try {
      const response = await fetch(`${BASE_URL}/api/users/${id}/statistics`)
      const data = await response.json()

      setStatistics(data)
    } catch (e) {
      console.error(e)
    }
  }

  async function loadRating(id) {
    try {
      const response = await fetch( `${BASE_URL}/api/users/${id}/rating`)
      const data = await response.json()

      setRating(data.map((dataObj, index) => {
        return {
          id: dataObj.id_user,
          name: dataObj.name,
          points: dataObj.points
        }
      }))
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadCredentials(userId)
    loadActivity(userId)
    loadStatistics(userId)
    loadRating(currentUserId)

    console.log(currentUserId)
  }, [])

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

            {userId == currentUserId && <div className="email">
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
            </div>}
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
                  await updateCredentials(2)
                  setIsEditing(false)
                }}
              />
            </div>
            :
            <div className="expand-button-group">
              {userId == currentUserId && <ExpandButton
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

              {userId == currentUserId && <ExpandButton
                icon={<Pencil />}
                text="Редактировать"
                delay={0.2}
                onClick={() => setIsEditing(true)}
                primary
              />}
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
            progress={(statistics.articles.user_progress + statistics.quizzes.user_progress) / (statistics.articles.all_count + statistics.quizzes.all_count) * 100}
            value={statistics.articles.user_progress + statistics.quizzes.user_progress}
            data={[
              {
                text: "Всего очков",
                value: statistics.articles.user_progress * POINTS_PER_ARTICLE + statistics.quizzes.user_progress * POINTS_PER_QUIZ
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
            progress={statistics.quizzes.user_progress / statistics.quizzes.all_count * 100}
            value={statistics.quizzes.user_progress}
            data={[
              {
                text: "Пройдено викторин",
                value: statistics.quizzes.user_progress
              },
              {
                text: "Осталось викторин",
                value: statistics.quizzes.all_count - statistics.quizzes.user_progress
              },
              {
                text: "Получено очков",
                value: statistics.quizzes.user_progress * POINTS_PER_QUIZ
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
                    index === rating.length - 1 && "you"
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

          <div className="rank-info">
            <span
              style={{ color: COLORS.TEXT }}
              className="body"
            >Вы на {rating && rating.length}-м месте</span>
            <span
              style={{ color: COLORS.MID_GRAY }}
              className="small"
            >из 1 847 участников</span>
          </div>
        </NamedSection>

        {rating && rating.length > 1 && <NamedSection
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
        </NamedSection>}

        <ContinueSection
          name="Название статьи"
          id={2}
          module="Название модуля"
          progress={80}
        />
      </SideBar>
    </>
  )
}