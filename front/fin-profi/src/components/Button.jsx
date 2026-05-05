import React from 'react'
import './Button.css'
import { Link, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { motion } from 'framer-motion'

export default function Button({ left, text, right, to, replace, className }) {
  const navigate = useNavigate()
  const animation = {
    initial: { scale: 0.8 },
    whileInView: { scale: 1, transition: { delay: 0.33 } },
    whileHover: { scale: 1.05 }
  }

  return (
    <motion.button
      className={clsx("button", className)}
      onClick={() => navigate(to, { replace })}
      {...animation}
    >
      {left}
      <span>{text}</span>
      {right}
    </motion.button>
  )
}