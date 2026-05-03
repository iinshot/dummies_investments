import { Link } from 'react-router-dom';
import { useAuth } from '../hooks';
import { AUTH } from '../constants';
import Logo from "../assets/logo.svg?react"
import NavigationButton from './NavigationButton';
import { Calc, Home, Login, Profile, Quiz } from '../assets/icons';
import { motion } from 'framer-motion';
import './Navigation.css'

export default function NavigationBar({ animationProp, key }) {
  const [auth, setAuth] = useAuth()

  const animation = {
    initial: { y: "50%", opacity: 0, scale: 0.95, ...animationProp?.initial },
    animate: { y: 0, opacity: 1, scale: 1, ...animationProp?.animate },
    exit: { y: "-50%", opacity: 0, scale: 0.95, transition: { duration: 0.33, delay: 0.1 }, ...animationProp?.exit },
    transition: { type: "spring", duration: 0.66, delay: 0.1, ...animationProp?.transition }
  }

  return (
    <motion.div
      key={key}
      className="navbar-container"
      {...animation}
    >
      <div className="navbar">
        <Logo />

        <div className="divider"></div>

        <nav>
          <div className="nav-button-group">
            <NavigationButton
              to=""
              icon={<Home />}
              text="Главная"
            />

            <NavigationButton
              to="calculators"
              icon={<Calc />}
              text="Калькуляторы"
            />

            <NavigationButton
              to="quizes"
              icon={<Quiz />}
              text="Викторины"
            />
          </div>

          {auth === AUTH.GUEST ?
            <NavigationButton
              to="login"
              icon={<Login />}
              text="Войти"
            /> :
            <NavigationButton
              to="profile"
              icon={<Profile />}
              text="Профиль"
            />
          }
        </nav>
      </div>
    </motion.div>
  );
}