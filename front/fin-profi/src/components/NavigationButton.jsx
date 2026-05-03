import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx'
import { COLORS } from '../constants';

export default function NavigationButton({ to, text, icon, style }) {
  const location = useLocation();
  const isActive = location.pathname === `/${to}`

  return (
    <Link style={style} to={to}>
      <div
        className={clsx("nav-button", isActive ? "active" : "")}
      >
        <icon.type {...icon.props} fill={COLORS.TEXT}/>
        <span>{text}</span>
      </div>
    </Link>
  )
}