import React from 'react'
import { Article, CheckCircle, Energy } from '../assets/icons'
import { clsx } from 'clsx'
import { points } from '../assets/data'
import { COLORS } from '../constants'
import { motion } from 'framer-motion'

export default function ActivityCard({ type, name, days_ago, delay }) {
  const animation = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { delay: 0.33 + (delay ?? 0) }
  }

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

      <div className="points">
        <Energy width={12} height={12} />

        <span
          className="body"
          style={{ color: COLORS.TEXT }}
        >
          +{points[`points_per_${type}`]} очков
        </span>
      </div>

      <span
        className="body"
        style={{ color: COLORS.MID_GRAY }}
      >
        {days_ago} дн. назад
      </span>
    </motion.div>
  )
}