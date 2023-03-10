import logger from '../../lib/logger'

import React, { useContext, useEffect, useState } from 'react'

import {
  ElementId,
  ELEMENT_TYPE,
  WorldId,
  Event,
  Scene,
  StudioId
} from '../../data/types'

import { useJump, useEventsBySceneRef, useScenes } from '../../hooks'

import {
  ComposerContext,
  COMPOSER_ACTION_TYPE
} from '../../contexts/ComposerContext'

import { Button, Divider, Select } from 'antd'
import {
  AlignLeftOutlined,
  PartitionOutlined,
  RollbackOutlined
} from '@ant-design/icons'

import styles from './styles.module.less'

import api from '../../api'

const JumpSelect: React.FC<{
  studioId: StudioId
  worldId?: WorldId
  sceneId?: ElementId
  selectedId: ElementId | undefined
  width?: number // elmstorygames/feedback#202
  onChangePathPart: (
    componentType: ELEMENT_TYPE,
    componentId: ElementId | null
  ) => Promise<void>
}> = ({ studioId, worldId, sceneId, selectedId, width, onChangePathPart }) => {
  let scenes: Scene[] | undefined = worldId
      ? useScenes(studioId, worldId, [worldId])
      : undefined,
    events: Event[] | undefined = sceneId
      ? useEventsBySceneRef(studioId, sceneId, [sceneId])
      : undefined

  const [selectedSceneId, setSelectedSceneId] = useState<ElementId | undefined>(
      undefined
    ),
    [selectedEventId, setSelectedEventId] = useState<ElementId | undefined>(
      undefined
    )

  async function onChange(componentId: string) {
    worldId && (await onChangePathPart(ELEMENT_TYPE.SCENE, componentId))

    sceneId && (await onChangePathPart(ELEMENT_TYPE.EVENT, componentId))
  }

  useEffect(() => {
    logger.info(`JumpSelect->scenes->useEffect`)

    scenes &&
      setSelectedSceneId(scenes.find((scene) => scene.id === selectedId)?.id)
  }, [scenes, selectedId])

  useEffect(() => {
    logger.info(`JumpSelect->events->useEffect`)

    events &&
      setSelectedEventId(events.find((event) => event.id === selectedId)?.id)
  }, [events, selectedId])

  // TODO: abstract
  return (
    <div className={styles.JumpSelect}>
      {scenes && scenes.length > 0 && (
        <>
          <Divider>
            <h2>
              <PartitionOutlined /> Scene
            </h2>
          </Divider>

          <div
            className={`${styles.selectWrapper} nodrag`}
            style={{ gridTemplateColumns: `${width ? width : 224}px 32px` }}
          >
            {selectedSceneId && (
              <>
                <Select value={selectedSceneId} onChange={onChange}>
                  {scenes.map(
                    (scene) =>
                      scene.id && (
                        <Select.Option value={scene.id} key={scene.id}>
                          {scene.title}
                        </Select.Option>
                      )
                  )}
                </Select>

                <Button className={styles.rollBackBtn}>
                  <RollbackOutlined
                    onClick={() => onChangePathPart(ELEMENT_TYPE.SCENE, null)}
                  />
                </Button>
              </>
            )}
          </div>
        </>
      )}

      {events && events.length > 0 && (
        <>
          <Divider>
            <h2>
              <AlignLeftOutlined /> Event
            </h2>
          </Divider>

          <div
            className={`${styles.selectWrapper} ${
              !selectedEventId ? styles.fullWidth : ''
            } nodrag`}
            style={{ gridTemplateColumns: `${width ? width : 224}px 32px` }}
          >
            {selectedEventId && (
              <>
                <Select
                  value={selectedEventId}
                  onChange={onChange}
                  className="jumpEventSelect"
                >
                  {events.map(
                    (event) =>
                      event.id && (
                        <Select.Option value={event.id} key={event.id}>
                          {event.title}
                        </Select.Option>
                      )
                  )}
                </Select>

                <Button className={styles.rollBackBtn}>
                  <RollbackOutlined
                    onClick={() => onChangePathPart(ELEMENT_TYPE.EVENT, null)}
                  />
                </Button>
              </>
            )}

            {!selectedEventId && (
              <Button
                onClick={async () => {
                  if (events) {
                    const scene = await api().scenes.getScene(
                      studioId,
                      events[0].sceneId
                    )

                    const firstEventFound = scene.children.find(
                      (child) => child[0] === ELEMENT_TYPE.EVENT
                    )

                    firstEventFound && onChange(firstEventFound[1])
                  }
                }}
                className={`${styles.jumpToBtn} nodrag`}
              >
                Jump to Event
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

const JumpTo: React.FC<{
  studioId: StudioId
  jumpId: ElementId
  width?: number
  onRemove?: (jumpId: ElementId) => Promise<void>
}> = ({ studioId, jumpId, width, onRemove }) => {
  const jump = useJump(studioId, jumpId, [studioId, jumpId])

  const { composer, composerDispatch } = useContext(ComposerContext)

  async function onChangePathPart(
    componentType: ELEMENT_TYPE,
    componentId: ElementId | null
  ) {
    if (jump?.id) {
      switch (componentType) {
        case ELEMENT_TYPE.SCENE:
          componentId &&
            (await api().jumps.saveJumpPath(studioId, jump.id, [componentId]))

          if (!componentId) {
            if (composer.selectedSceneMapJump) {
              composerDispatch({
                type: COMPOSER_ACTION_TYPE.SCENE_MAP_TOTAL_SELECTED_JUMPS,
                totalSceneMapSelectedJumps: 0
              })

              composerDispatch({
                type: COMPOSER_ACTION_TYPE.SCENE_MAP_SELECT_JUMP,
                selectedSceneMapJump: null
              })
            }

            await api().worlds.saveJumpRefToWorld(studioId, jump.worldId, null)

            await api().jumps.removeJump(studioId, jump.id)

            onRemove && (await onRemove(jumpId))
          }
          break
        case ELEMENT_TYPE.EVENT:
          await api().jumps.saveJumpPath(
            studioId,
            jump.id,
            componentId ? [jump.path[0], componentId] : [jump.path[0]]
          )
          break
        default:
          break
      }
    }
  }

  return (
    <div className={styles.JumpTo}>
      {jump && (
        <>
          {/* Scene */}
          {jump.path[0] && (
            <JumpSelect
              studioId={studioId}
              worldId={jump.worldId}
              width={width}
              selectedId={jump.path[0]}
              onChangePathPart={onChangePathPart}
            />
          )}

          {/* Event */}
          {jump.path[0] && (
            <JumpSelect
              studioId={studioId}
              sceneId={jump.path[0]}
              width={width}
              selectedId={jump.path[1]}
              onChangePathPart={onChangePathPart}
            />
          )}
        </>
      )}
    </div>
  )
}

export default JumpTo
