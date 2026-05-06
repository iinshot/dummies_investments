import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks'
import { AUTH, COLORS } from '../constants'
import { Content, Section, NamedSection, SideBar, ContinueSection, ProgressBar, RankCard } from '../components'
import { Cup, Invest, Play, Star } from '../assets/icons'
import { ranking } from "../assets/data"
import "./Profile.css"
import clsx from 'clsx'
import { delay } from 'framer-motion'

export default function Profile() {
  const [auth, setAuth] = useAuth()
  const nextUser = ranking.at(-2)
  const user = ranking.at(-1)

  const scrollRef = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      const container = scrollRef.current

      container?.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth"
      })
    }, 333)
  }, [])

  return (
    <>
      <Content>
        <Section padding="32px 40px" shrink>

        </Section>

        <Section padding="170px 200px" shrink>

        </Section>

        <NamedSection
          icon={<Invest />}
          text="Недавняя активность"
          padding="32px 40px"
          gap="24px"
        >
          <div style={{ height: "500px" }}>Activity</div>
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
            {ranking.slice(0, 8).map((user, index) => (
              <RankCard
                key={user.id}
                highlight={
                  clsx(
                    index === 0 && "leader", 
                    index === ranking.length - 1 && "you"
                  )
                }
                index={index + 1}
                user={user}
                delay={0.025 * index}
              />
            ))}

            {ranking.length > 8 && <>
              <div className="divider">
                <div className="dashed-line"></div>
                <span style={{ color: COLORS.BACKGROUND }} className="label">•••</span>
                <div className="dashed-line"></div>
              </div>

              <RankCard
                key={nextUser.id}
                index={ranking.length - 1}
                user={nextUser}
                delay={0.025 * 8}
              />

              <RankCard
                key={user.id}
                index={ranking.length}
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
            >Вы на {ranking.length}-м месте</span>
            <span
              style={{ color: COLORS.MID_GRAY }}
              className="small"
            >из 1 847 участников</span>
          </div>
        </NamedSection>

        {ranking.length > 1 && <NamedSection
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
              >{nextUser.score - user.score}</span>

              <span
                style={{ color: COLORS.MID_GRAY }}
                className="small"
              >очков осталось</span>
            </div>

            <div className="user">
              <span
                style={{ color: COLORS.TEXT }}
                className="body"
              >{ranking.length - 1}-е место</span>

              <span
                style={{ color: COLORS.MID_GRAY }}
                className="small"
              >{nextUser.name}</span>
            </div>
          </div>

          <ProgressBar
            value={user.score / nextUser.score * 100}
            height={8}
          />

          <span
            style={{
              color: COLORS.MID_GRAY,
              textAlign: "center"
            }}
            className="small"
          >{user.score} / {nextUser.score} очков</span>
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