import React from 'react'
import './Section.css'
import clsx from 'clsx'

export default function Section({ children, shrink, padding }) {
  return (
    <section
      className={clsx({shrink})}
      style={{ padding: padding ?? "32px 120px" }}
    >
      { children }
    </section>
  )
}
