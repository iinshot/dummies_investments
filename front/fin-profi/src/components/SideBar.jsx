import React from 'react'
import { motion } from 'framer-motion'
import './SideBar.css'

export default function SideBar({ children, animationProp }) {
  const animation = {
    initial: { y: "50%", opacity: 0, scale: 0.95, ...animationProp?.initial },
    animate: { y: 0, opacity: 1, scale: 1, ...animationProp?.animate },
    exit: { y: "-50%", opacity: 0, scale: 0.95, transition: { duration: 0.33, delay: 0.2 }, ...animationProp?.exit },
    transition: { type: "spring", duration: 0.66, delay: 0.2, ...animationProp?.transition },
  }

  return (
    <motion.div
      className="sidebar-container"
      {...animation}
    >
      {children}
    </motion.div>
  )
}
