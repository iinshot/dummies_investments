import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks'
import { AUTH } from '../constants'
import { Content, Section, SideBar } from '../components'

export default function Profile() {
  const [auth, setAuth] = useAuth()

  return (
    <>
      <Content>
        <Section style={{ height: "500px" }}>Main</Section>
        <Section style={{ height: "500px" }}>Main</Section>
        <Section style={{ height: "500px" }}>Main</Section>
        <Section style={{ height: "500px" }}>Main</Section>
      </Content>

      <SideBar>
        <Section style={{ height: "300px" }}>
          <Link
            to="/"
            onClick={() => setAuth(AUTH.GUEST)}
          >
            Выйти
          </Link>
        </Section>
        <Section style={{ flex: 1 }}>SideBar</Section>
      </SideBar>
    </>
  )
}
