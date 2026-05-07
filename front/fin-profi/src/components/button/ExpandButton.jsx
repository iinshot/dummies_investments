import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'

export default function ExpandButton({ icon, text, primary, delay, onClick }) {
  const [expanded, setExpanded] = useState(false)

  const animation = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1, transition: { delay: 0.2 + (delay ?? 0) } },
    transition: { delay: 0.2 },
    whileHover: { padding: "10px 16px" }
  }

  const textAnimation = {
    initial: { opacity: 0, width: 0, marginRight: 0 },
    animate: { opacity: 1, width: "auto", marginRight: 5 },
    exit: { opacity: 0, width: 0, marginRight: 0 }
  }

  return (
    <motion.div
      className={clsx("expand-button", { primary })}
      onHoverStart={() => setExpanded(true)}
      onHoverEnd={() => {
        setTimeout(() => {
          setExpanded(false)
        }, 200)
      }}
      onClick={onClick}
      {...animation}
    >
      <AnimatePresence>
        {text && expanded && (
          <motion.span
            className="text"
            {...textAnimation}
          >{text}</motion.span>
        )}
      </AnimatePresence>
      {icon}
    </motion.div>
  )
}