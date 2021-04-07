import React from 'react'

import { ComponentId, StudioId } from '../../../data/types'

import { useChoice } from '../../../hooks'

import ComponentTitle from '../ComponentTitle'

import styles from '../styles.module.less'

import api from '../../../api'

const ChoiceDetails: React.FC<{
  studioId: StudioId
  choiceId: ComponentId
}> = ({ studioId, choiceId }) => {
  const choice = useChoice(studioId, choiceId, [choiceId])

  return (
    <>
      {choice && (
        <div className={styles.componentDetailViewContent}>
          <ComponentTitle
            title={choice.title}
            onUpdate={async (title) => {
              if (choice.id) {
                await api().choices.saveChoice(studioId, {
                  ...(await api().choices.getChoice(studioId, choice.id)),
                  title
                })
              }
            }}
          />
          <div className={styles.componentId}>{choice.id}</div>
        </div>
      )}
    </>
  )
}

export default ChoiceDetails