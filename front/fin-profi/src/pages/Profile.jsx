import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks'
import { AUTH } from '../constants'
import { Content, Section, NamedSection, SideBar, ContinueSection } from '../components'
import { Cup, Invest, Play, Star } from '../assets/icons'

export default function Profile() {
  const [auth, setAuth] = useAuth()

  return (
    <>
      <Content>
        <Section padding="32px 40px" shrink>

        </Section>

        <Section padding="170px 200px" shrink>

        </Section>

        <NamedSection
          icon={<Invest />}
          text="Недавняя активность"
          padding="32px 40px"
          gap="24px"
        >
          <div style={{ height: "500px" }}>Activity</div>
        </NamedSection>
      </Content>

      <SideBar>
        <NamedSection
          icon={<Cup height={14} width={14} />}
          text="Рейтинг"
          gap="12px"
        >

        </NamedSection>

        <NamedSection
          icon={<Star />}
          text="До следующего места"
          gap="8px"
          shrink

        >
          
        </NamedSection>

        <ContinueSection
          name="Название статьи"
          id={2}
          module="Название модуля"
          progress={80}
        />
      </SideBar>
    </>
  )
}