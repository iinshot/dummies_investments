import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks'
import { AUTH } from '../../constants'

export default function Register() {
  const [auth, setAuth] = useAuth()

  return (
    <Link
      onClick={() => setAuth(AUTH.AUTHORIZED)}
      to="/"
    >Зарегистрироваться</Link>
  )
}
