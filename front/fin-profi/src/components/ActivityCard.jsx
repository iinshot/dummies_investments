import React from 'react'
import { Article, CheckCircle, Energy } from '../assets/icons'
import { clsx } from 'clsx'
import { COLORS, POINTS_PER_ARTICLE, POINTS_PER_QUIZ } from '../constants'
import { motion } from 'framer-motion'

export default function ActivityCard({ type, name, created_at, delay }) {
  const animation = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { delay: 0.33 + (delay ?? 0) }
  }

  const date = new Date(created_at)
  date.setHours(0, 0, 0, 0)  // ← ИСПРАВЛЕНО: data → date

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const days_ago = Math.round((today - date) / (1000 * 60 * 60 * 24))

  return (
    <motion.div
      className={clsx("activity-card", type)}
      {...animation}
    >
      {type === "quiz" ?
        <CheckCircle width={14} height={14} />
        :
        <Article width={16} height={16} />
      }

      <h4 style={{ flex: 1 }} >
        {type === "quiz" ? "Пройдена викторина" : "Прочитана статья"} «{name}»
      </h4>



      <span
        className="body"
        style={{ color: COLORS.MID_GRAY }}
      >
        {days_ago} дн. назад
      </span>
    </motion.div>
  )
}