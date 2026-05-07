import clsx from 'clsx'
import React from 'react'
import { animate, motion } from 'framer-motion'
import { COLORS } from '../../constants'

export default function ProgressCircle({ value, text, large, style }) {
  const animation = {
    initial: { background: `conic-gradient(var(--primary-yellow) ${0}%, var(--surface-light) ${0}%)` },
    animate: { background: `conic-gradient(var(--primary-yellow) ${value}%, var(--surface-light) ${value}%)` },
    transition: { delay: 0.33 }
  }

  return (
    <motion.div
      className={clsx("progress-circle", { large })}
      style={style}
      {...animation}
    >
      <div className="progress">
        <span>{text}</span>
      </div>
    </motion.div>
  )
}