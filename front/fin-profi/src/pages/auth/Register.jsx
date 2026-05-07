import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks'
import { AUTH } from '../../constants'

export default function Register() {
  const [auth, setAuth] = useAuth()

  return (
    <Link
      onClick={() => {
        localStorage.setItem("id", 2)
        setAuth(AUTH.AUTHORIZED)
      }}
      to="/"
    >Зарегистрироваться</Link>
  )
}
