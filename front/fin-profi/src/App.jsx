import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import NavigationBar from './components/NavigationBar'
import { Main, Calculators, Quizes, Profile } from './pages'
import { AuthLayout, Login, Register } from './pages/auth'
import { useAuth } from './hooks'
import { AUTH } from './constants'
import { AnimatePresence } from 'framer-motion'
import './App.css'

export default function App() {
  const location = useLocation()
  const show = !["/login", "/register"].includes(location.pathname)

  return (
    <div className="container">
      <AnimatePresence>
        {show && <NavigationBar />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <main key={show ? location.pathname : "no-animate"}>
          <Routes location={location}>
            <Route path="/" element={<Main />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/quizes" element={<Quizes />} />
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </AnimatePresence>
    </div>
  )
}
