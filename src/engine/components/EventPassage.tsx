import React, { useCallback, useContext, useRef } from 'react'
import useResizeObserver from '@react-hook/resize-observer'

import { findDestinationPassage, getEventInitial, getPassage } from '../lib/api'

import { ENGINE_GAME_OVER_RESULT_VALUE } from '../lib'
import {
  ComponentId,
  COMPONENT_TYPE,
  PASSAGE_TYPE,
  EngineEventData,
  EngineEventStateCollection,
  EnginePassageData,
  EngineRouteData
} from '../types/0.5.0'
import { NextEventProcessor } from './Event'

import { EngineContext } from '../contexts/EngineContext'

import EventPassageContent from './EventPassageContent'
import EventPassageChoices from './EventPassageChoices'
import EventPassageInput from './EventPassageInput'
import { useSpring } from '@react-spring/core'
import { animated } from '@react-spring/web'
import { useLiveQuery } from 'dexie-react-hooks'
import { LibraryDatabase } from '../lib/db'

export type RouteProcessor = ({
  originId: origin,
  result,
  route,
  state
}: {
  originId?: ComponentId
  result: string
  route?: EngineRouteData
  state?: EngineEventStateCollection
}) => Promise<void>

export const EventPassage: React.FC<{
  passageId: ComponentId
  event: EngineEventData
  onRouteFound: NextEventProcessor
}> = React.memo(({ passageId, event, onRouteFound }) => {
  const { engine } = useContext(EngineContext)

  if (!engine.gameInfo) return null

  const passageRef = useRef<HTMLDivElement>(null)

  const { studioId, id: gameId } = engine.gameInfo

  const passage = useLiveQuery(
    () => new LibraryDatabase(studioId).passages.get(passageId),
    [passageId]
  )

  const processRoute: RouteProcessor = useCallback(
    async ({ originId, result, route, state }) => {
      try {
        let foundPassage: EnginePassageData | undefined

        if (route) {
          foundPassage = await getPassage(
            studioId,
            await findDestinationPassage(
              studioId,
              route.destinationId,
              route.destinationType
            )
          )
        }

        if (!route) {
          if (result !== ENGINE_GAME_OVER_RESULT_VALUE && originId) {
            foundPassage = await getPassage(studioId, originId)
          }

          if (result === ENGINE_GAME_OVER_RESULT_VALUE) {
            const initialEvent = await getEventInitial(studioId, gameId)

            if (initialEvent) {
              foundPassage = await getPassage(
                studioId,
                initialEvent.destination
              )
            }
          }
        }

        if (foundPassage) {
          onRouteFound({
            destinationId: foundPassage.id,
            eventResult: result,
            originId:
              route?.destinationType === COMPONENT_TYPE.PASSAGE
                ? originId || event.destination
                : undefined,
            passageType: foundPassage.type,
            routeId: route?.id,
            state
          })
        } else {
          throw 'Unable to process route. Could not find passage.'
        }
      } catch (error) {
        throw error
      }
    },
    [passage, event]
  )

  const [styles, api] = useSpring(() => ({
    height: 0,
    overflow: 'hidden'
  }))

  useResizeObserver(passageRef, () => {
    passage &&
      passageRef.current &&
      api.start({ height: passageRef.current.getBoundingClientRect().height })
  })

  return (
    <animated.div style={styles}>
      <div className="event-passage" ref={passageRef}>
        {passage && (
          <>
            <EventPassageContent
              content={passage.content}
              state={event.state}
            />

            {passage.type === PASSAGE_TYPE.CHOICE && (
              <EventPassageChoices
                passage={passage}
                event={event}
                onSubmitRoute={processRoute}
              />
            )}

            {passage.type === PASSAGE_TYPE.INPUT && (
              <EventPassageInput
                passage={passage}
                event={event}
                onSubmitRoute={processRoute}
              />
            )}
          </>
        )}
      </div>
    </animated.div>
  )
})

EventPassage.displayName = 'EventPassage'

export default EventPassage
