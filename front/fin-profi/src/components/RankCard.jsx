import React from 'react'
import { Crown, ProfileCircle } from '../assets/icons'
import clsx from 'clsx'
import './RankCard.css'
import { COLORS } from '../constants'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function RankCard({ index, user, highlight, delay }) {
  const animation = {
    initial: { scale: 0.8 },
    animate: { scale: 1 },
    transition: { delay: 0.33 + (delay ?? 0) }
  }

  return (
    <motion.div
      className={clsx("rank-card", highlight)}
      {...animation}
    >
      <span className="body rank-number">{index}</span>

      <ProfileCircle width={28} height={28} />

      <div className="user-data">
        <Link to={`/profile/${user.id}`} >
          <span className="body username">
            {user.name}
          </span>
        </Link>
        <span
          style={{ color: COLORS.MID_GRAY }}
          className="small score"
        >{user.points} очков</span>
      </div>

      {highlight == "leader" && <Crown width={14} height={14} />}

      {highlight == "you" && <span style={{ color: COLORS.PRIMARY_YELLOW }} className="small">Вы</span>}
    </motion.div>
  )
}