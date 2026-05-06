import React from 'react'
import './Button.css'
import { Link, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { motion } from 'framer-motion'

export default function Button({ left, text, right, to, replace, className }) {
  const navigate = useNavigate()
  const animation = {
    initial: { opacity: 0, scale: 0.5 },
    whileInView: { opacity: 1, scale: 1 },
    whileHover: { scale: 0.96 },
    transition: { type: "ease" }
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