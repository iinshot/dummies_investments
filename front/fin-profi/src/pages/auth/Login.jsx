import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks'
import { AUTH } from '../../constants'


export default function Login() {
  const [auth, setAuth] = useAuth()

  return (
    <Link
      onClick={() => setAuth(AUTH.AUTHORIZED)} to="/"
    >
      Войти
    </Link>
  )
}