import React, { useEffect, useState, useContext } from 'react'

import { EventPersona, WorldId, StudioId } from '../../../data/types'

import { useCharacter } from '../../../hooks'

import {
  ComposerContext,
  COMPOSER_ACTION_TYPE
} from '../../../contexts/ComposerContext'

import CharacterMask from '../../CharacterManager/CharacterMask'

import styles from './styles.module.less'

const EventPersonaPane: React.FC<{
  studioId: StudioId
  worldId: WorldId
  persona?: EventPersona
}> = ({ studioId, worldId, persona }) => {
  const character = useCharacter(studioId, persona?.[0], [persona?.[0]])

  const { composerDispatch } = useContext(ComposerContext)

  const [maskAssetId, setMaskAssetId] = useState<string | undefined>(undefined),
    [refValue, setRefValue] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (persona && character) {
      const foundMask = character.masks.find((mask) => mask.type === persona[1])

      setMaskAssetId(foundMask?.assetId)

      const foundRef = character.refs.find(
        (ref) =>
          (ref[0] && ref[0] === persona[2]) ||
          (!ref[0] && ref[1] === persona[2])
      )

      setRefValue(foundRef?.[1])
    } else {
      setMaskAssetId(undefined)
    }
  }, [persona, character])

  return (
    <>
      {persona && (
        <div className={styles.EventPersona}>
          {character?.id && (
            <>
              <div className={styles.maskWrapper}>
                <CharacterMask
                  studioId={studioId}
                  worldId={worldId}
                  characterId={character.id}
                  type={persona[1]}
                  width="80px"
                  active
                  assetId={maskAssetId}
                  fill
                />

                <div className={styles.maskType}>{persona[1]}</div>
              </div>

              <div className={styles.info}>
                <h2>Character</h2>
                <p
                  className={`${styles.title} nodrag`}
                  onClick={() =>
                    character.id &&
                    composerDispatch({
                      type: COMPOSER_ACTION_TYPE.OPEN_CHARACTER_MODAL,
                      characterId: character.id
                    })
                  }
                >
                  {character.title}
                </p>

                <h2>Reference</h2>
                <p>
                  {refValue ? (
                    refValue
                  ) : (
                    <span style={{ textTransform: 'uppercase' }}>
                      {' '}
                      {character.title}
                    </span>
                  )}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

EventPersonaPane.displayName = 'EventPersonaPane'

export default EventPersonaPane
