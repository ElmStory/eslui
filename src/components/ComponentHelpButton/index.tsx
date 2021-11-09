import { ipcRenderer } from 'electron'

import React from 'react'

import { WINDOW_EVENT_TYPE } from '../../lib/events'
import { COMPONENT_TYPE } from '../../data/types'

import { QuestionCircleFilled } from '@ant-design/icons'

import styles from './styles.module.less'

const ComponentHelpButton: React.FC<{ type: COMPONENT_TYPE }> = ({ type }) => {
  const openHelp = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()

    let helpUrl =
      'https://docs.elmstory.com/guides/production/editor/components'

    switch (type) {
      case COMPONENT_TYPE.CHARACTER:
        helpUrl = `${helpUrl}/character-component/`
        break
      case COMPONENT_TYPE.CHOICE:
        helpUrl = `${helpUrl}/choice-component/`
        break
      case COMPONENT_TYPE.CONDITION:
        helpUrl = `${helpUrl}/condition-component/`
        break
      case COMPONENT_TYPE.EFFECT:
        helpUrl = `${helpUrl}/effect-component/`
        break
      case COMPONENT_TYPE.FOLDER:
        helpUrl = `${helpUrl}/folder-component/`
        break
      case COMPONENT_TYPE.GAME:
        helpUrl = `${helpUrl}/game-root-component/`
        break
      case COMPONENT_TYPE.JUMP:
        helpUrl = `${helpUrl}/jump-component/`
        break
      case COMPONENT_TYPE.PASSAGE:
        helpUrl = `${helpUrl}/passage-component/`
        break
      case COMPONENT_TYPE.ROUTE:
        helpUrl = `${helpUrl}/route-component/`
        break
      case COMPONENT_TYPE.SCENE:
        helpUrl = `${helpUrl}/scene-component/`
        break
      case COMPONENT_TYPE.VARIABLE:
        helpUrl = `${helpUrl}/variable-component/`
        break
      default:
        helpUrl = 'https://docs.elmstory.com/'
        break
    }

    ipcRenderer.send(WINDOW_EVENT_TYPE.OPEN_EXTERNAL_LINK, [helpUrl])
  }

  return (
    <div className={styles.HelpButton} onClick={openHelp}>
      <QuestionCircleFilled />
    </div>
  )
}

ComponentHelpButton.displayName = 'ComponentHelpButton'

export default ComponentHelpButton
