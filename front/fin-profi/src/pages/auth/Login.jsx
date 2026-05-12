import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks'
import { AUTH } from '../../constants'


export default function Login() {
  const [auth, setAuth] = useAuth()

  return (
    <Link
      onClick={() => {
        localStorage.setItem("id", 10)
        setAuth(AUTH.AUTHORIZED)
      }} to="/"
    >
      Войти
    </Link>
  )
}