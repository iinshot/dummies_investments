import React from 'react'
import "./ProgressBar.css"
import { motion } from 'framer-motion'

export default function ProgressBar({ value, width, height }) {
  const animation = {
    initial: { width: 0 },
    animate: { width: `${value}%`, transition: { delay: 0.33 } }
  }

  return (
    <div
      style={{
        height: `${height}px`,
        width: `${width}px`,
        borderRadius: `${height / 2}px`
      }}
      className="progress-bar"
    >
      <motion.div
        className="progress"
        {...animation}
      ></motion.div>
    </div>
  )
}