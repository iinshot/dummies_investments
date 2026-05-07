import React from 'react'
import NamedSection from './section/NamedSection'
import ProgressCircle from './progress/ProgressCircle'

export default function StatisticsCard({ progress, value, sectionProps, data, dark }) {
  return (
    <NamedSection
      padding="24px"
      gap="12px"
      {...sectionProps}
      grayscale={!dark}
      dark={dark}
    >
      <div className="progress">
        <ProgressCircle
          text={value}
          value={progress}
          style={{
            marginBottom: "10px"
          }}
          large={dark}
        />
      </div>

      <div className="divider"></div>

      {data?.map(dataObj => (
        <div className="row">
          <span className={dark ? "h3" : "body"}>{dataObj.text}</span>
          <span className={dark ? "h3" : "body"}>{dataObj.value}</span>
        </div>
      ))}
    </NamedSection>
  )
}