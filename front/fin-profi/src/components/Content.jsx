import React from 'react'
import { motion } from 'framer-motion'
import './Content.css'

export default function Content({ children, style, animationProp }) {
  const animation = {
    initial: { y: "50%", opacity: 0, scale: 0.95, ...animationProp?.initial },
    animate: { y: 0, opacity: 1, scale: 1, ...animationProp?.animate },
    exit: { y: "-50%", opacity: 0, scale: 0.95, transition: { duration: 0.33 }, ...animationProp?.exit },
    transition: { type: "spring", duration: 0.66, ...animationProp?.transition }
  }

  return (
    <motion.div
      className="content-container"
      {...animation}
      style={style}
    >
      {children}
    </motion.div>
  )
}
