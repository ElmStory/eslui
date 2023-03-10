import React, { useContext } from 'react'

import { Character, WorldId, StudioId, ELEMENT_TYPE } from '../../data/types'

import {
  ComposerContext,
  COMPOSER_ACTION_TYPE
} from '../../contexts/ComposerContext'

import { Tabs } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import CharacterInfo from './CharacterInfo'
import CharacterPersonality from './CharacterPersonality'
import CharacterEvents from './CharacterEvents'

import styles from './styles.module.less'
import api from '../../api'

enum TAB_TYPE {
  INFO = 'INFO',
  PERSONALITY = 'PERSONALITY',
  EVENTS = 'EVENTS'
}

const RemoveCharacterButton: React.FC<{ onRemove: () => void }> = ({
  onRemove
}) => {
  return (
    <div className={styles.RemoveCharacterButton} onClick={onRemove}>
      <DeleteOutlined />
    </div>
  )
}

RemoveCharacterButton.displayName = 'RemoveCharacterButton'

const CharacterManager: React.FC<{
  studioId: StudioId
  worldId: WorldId
  character: Character
}> = ({ studioId, worldId, character }) => {
  const { composerDispatch } = useContext(ComposerContext)

  return (
    <>
      {character && (
        <div className={styles.CharacterManager}>
          <Tabs
            defaultActiveKey={TAB_TYPE.INFO}
            tabBarExtraContent={
              <RemoveCharacterButton
                onRemove={async () => {
                  composerDispatch({
                    type: COMPOSER_ACTION_TYPE.CLOSE_CHARACTER_MODAL
                  })

                  try {
                    if (character.id) {
                      await Promise.all([
                        api().events.removeDeadPersonas(studioId, character.id),
                        api().characters.removeCharacter(studioId, character.id)
                      ])

                      composerDispatch({
                        type: COMPOSER_ACTION_TYPE.ELEMENT_REMOVE,
                        removedElement: {
                          id: character.id,
                          type: ELEMENT_TYPE.CHARACTER
                        }
                      })
                    }
                  } catch (error) {
                    throw error
                  }
                }}
              />
            }
          >
            <Tabs.TabPane tab="Info" key={TAB_TYPE.INFO}>
              <CharacterInfo
                studioId={studioId}
                worldId={worldId}
                character={character}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Personality" key={TAB_TYPE.PERSONALITY}>
              <CharacterPersonality studioId={studioId} character={character} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Events" key={TAB_TYPE.EVENTS}>
              <CharacterEvents
                studioId={studioId}
                worldId={worldId}
                character={character}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
      )}
    </>
  )
}

CharacterManager.displayName = 'CharacterManager'

export default CharacterManager
