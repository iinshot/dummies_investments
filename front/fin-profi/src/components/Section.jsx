import React from 'react'
import './Section.css'

export default function Section({ children, style }) {
  return (
    <section style={style}>
      { children }
    </section>
  )
}
