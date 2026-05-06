import clsx from 'clsx'
import React from 'react'
import './Section.css'

export default function NamedSection({ children, icon, text, dark, shrink, padding, gap, className }) {
  return (
    <section
        className={clsx("named", { shrink, dark }, className)}
        style={{
            padding: padding ?? "24px",
            gap: gap ?? "16px"
        }}
    >
        <div className="header">
            <div className="icon">{icon}</div>
            <span className="label">{text}</span>
        </div>

        <div className="content">
            {children}
        </div>
    </section>
  )
}