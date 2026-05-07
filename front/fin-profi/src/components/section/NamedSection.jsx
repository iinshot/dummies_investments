import clsx from 'clsx'
import React from 'react'
import './Section.css'

export default function NamedSection(props) {
  return (
    <section
      className={
        clsx("named", {
          shrink: props.shrink,
          dark: props.dark,
          grayscale: props.grayscale
        }, props.className)
      }
      style={{
        padding: props.padding ?? "24px",
        gap: props.gap ?? "16px"
      }}
    >
      <div className="header">
        <div className="icon">{props.icon}</div>
        <span className="label">{props.text}</span>
      </div>

      <div className="content" ref={props.ref} >
        {props.children}
      </div>
    </section>
  )
}