// src/components/PageTransition.js
import React from 'react';
import { motion } from 'framer-motion';

const pageAnimation = {
  initial: { y: "50%", opacity: 0, scale: 0.95 },
  animate: { y: 0, opacity: 1, scale: 1 },
  exit: { y: "-50%", opacity: 0, scale: 0.95, transition: { duration: 0.33, delay: 0.1 } },
  transition: { type: "spring", duration: 0.66, delay: 0.1 }
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      className="page-transition"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageAnimation}
      transition={pageAnimation.transition}
      style={{ width: '100%', height: '100%', flex: 1 }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;