import React from 'react'
import NamedSection from './NamedSection'
import { ArrowRight, Play } from '../../assets/icons'
import { COLORS } from '../../constants'
import ProgressBar from '../progress/ProgressBar'
import Button from '../Button'

export default function ContinueSection({ name, module, id, progress, articleLink }) {
  return (
    <NamedSection
      icon={<Play className="corner" />}
      text="Продолжить"
      padding="20px"
      shrink
      dark
      className="continue"
    >
      <div className="content-header">
        <h4
        className="truncated"
          style={{ color: COLORS.SURFACE_WHITE }}
        >
          { name }
        </h4>
        <span
          className="body truncated"
          style={{ color: COLORS.MID_GRAY }}
        >
          Модуль { id } — { module }
        </span>
      </div>

      <ProgressBar
        value={progress}
        height={6}
      />

      <span className="body completed">{progress}% завершено</span>

      <Button
        right={<ArrowRight />}
        text="Продолжить"
      />
    </NamedSection>
  )
}
