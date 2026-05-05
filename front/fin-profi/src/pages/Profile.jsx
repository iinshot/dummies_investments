import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks'
import { AUTH } from '../constants'
import { Content, Section, NamedSection, SideBar } from '../components'
import { Star } from '../assets/icons'

export default function Profile() {
  const [auth, setAuth] = useAuth()

  return (
    <>
      <Content>
        <Section shrink>Main</Section>
        <Section>Main</Section>
        <Section>Main</Section>
        <Section>Main</Section>
      </Content>

      <SideBar>
        <Section style={{ flex: 1 }}>
          <Link
            to="/"
            onClick={() => setAuth(AUTH.GUEST)}
          >
            Выйти
          </Link>
        </Section>

        <NamedSection>
          SideBar
        </NamedSection>
      </SideBar>
    </>
  )
}