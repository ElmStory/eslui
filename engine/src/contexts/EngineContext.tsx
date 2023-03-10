import { cloneDeep } from 'lodash'

import React, { createContext, useMemo, useReducer } from 'react'

import { ElementId, EngineLiveEventData, WorldId, StudioId } from '../types'

interface EngineState {
  currentLiveEvent: ElementId | undefined
  devTools: {
    highlightCharacters: boolean
    highlightExpressions: boolean
    blockedChoicesVisible: boolean
    muted: boolean
    reset: boolean
    xrayVisible: boolean
  }
  liveEventsInStream: EngineLiveEventData[]
  installed: boolean
  installId: string | undefined
  isComposer: boolean
  worldInfo?: {
    copyright?: string
    description?: string
    designer: string
    id: WorldId
    studioId: StudioId
    studioTitle: string
    title: string
    updated: number
    version: string
    website?: string
  }
  playing: boolean
  errorNotification: {
    message: string | undefined
    showing: boolean
  }
  updating: boolean
  visible: boolean
}

export enum ENGINE_ACTION_TYPE {
  APPEND_LIVE_EVENTS_TO_STREAM = 'APPEND_EVENTS_TO_STREAM',
  CLEAR_EVENT_STREAM = 'CLEAR_EVENT_STREAM',
  SET_WORLD_INFO = 'SET_GAME_INFO',
  HIDE_ERROR_NOTIFICATION = 'HIDE_ERROR_NOTIFICATION',
  PLAY = 'PLAY', // sets currentEvent
  SET_INSTALLED = 'SET_INSTALLED',
  SET_INSTALL_ID = 'SET_INSTALL_ID',
  SET_IS_COMPOSER = 'SET_COMPOSER',
  SET_CURRENT_LIVE_EVENT = 'SET_CURRENT_EVENT',
  SET_UPDATE_WORLD = 'SET_UPDATE_WORLD',
  SET_VISIBLE = 'SET_VISIBLE',
  STOP = 'STOP',
  SHOW_ERROR_NOTIFICATION = 'SHOW_ERROR_NOTIFICATION',
  TOGGLE_DEVTOOLS_EXPRESSIONS = 'TOGGLE_DEVTOOLS_EXPRESSIONS',
  TOGGLE_DEVTOOLS_CHARACTERS = 'TOGGLE_DEVTOOLS_CHARACTERS',
  TOGGLE_DEVTOOLS_BLOCKED_CHOICES = 'TOGGLE_DEVTOOLS_BLOCKED_CHOICES',
  TOGGLE_DEVTOOLS_MUTED = 'TOGGLE_DEVTOOLS_MUTED',
  DEVTOOLS_MUTE = 'DEVTOOLS_MUTE',
  TOGGLE_DEVTOOLS_XRAY = 'TOGGLE_DEVTOOLS_XRAY',
  DEVTOOLS_RESET = 'DEVTOOLS_RESET',
  UPDATE_LIVE_EVENT_IN_STREAM = 'UPDATE_EVENT_IN_STREAM'
}

type EngineActionType =
  | { type: ENGINE_ACTION_TYPE.SET_INSTALLED; installed: boolean }
  | { type: ENGINE_ACTION_TYPE.SET_INSTALL_ID; id?: string }
  | { type: ENGINE_ACTION_TYPE.SET_IS_COMPOSER }
  | {
      type: ENGINE_ACTION_TYPE.SET_CURRENT_LIVE_EVENT
      id?: ElementId
    }
  | { type: ENGINE_ACTION_TYPE.CLEAR_EVENT_STREAM }
  | {
      type: ENGINE_ACTION_TYPE.APPEND_LIVE_EVENTS_TO_STREAM
      liveEvents: EngineLiveEventData[]
      reset?: boolean
    }
  | {
      type: ENGINE_ACTION_TYPE.UPDATE_LIVE_EVENT_IN_STREAM
      liveEvent: EngineLiveEventData
    }
  | {
      type: ENGINE_ACTION_TYPE.SET_WORLD_INFO
      gameInfo?: {
        copyright?: string
        description?: string
        designer: string
        id: WorldId
        studioId: StudioId
        studioTitle: string
        title: string
        updated: number
        version: string
        website?: string
      }
    }
  | { type: ENGINE_ACTION_TYPE.SET_UPDATE_WORLD; updating: boolean }
  | { type: ENGINE_ACTION_TYPE.SET_VISIBLE; visible: boolean }
  | { type: ENGINE_ACTION_TYPE.PLAY; fromEvent: ElementId | undefined }
  | { type: ENGINE_ACTION_TYPE.STOP }
  | { type: ENGINE_ACTION_TYPE.HIDE_ERROR_NOTIFICATION }
  | { type: ENGINE_ACTION_TYPE.SHOW_ERROR_NOTIFICATION; message: string }
  | { type: ENGINE_ACTION_TYPE.TOGGLE_DEVTOOLS_BLOCKED_CHOICES }
  | { type: ENGINE_ACTION_TYPE.TOGGLE_DEVTOOLS_CHARACTERS }
  | { type: ENGINE_ACTION_TYPE.TOGGLE_DEVTOOLS_EXPRESSIONS }
  | { type: ENGINE_ACTION_TYPE.TOGGLE_DEVTOOLS_XRAY }
  | { type: ENGINE_ACTION_TYPE.TOGGLE_DEVTOOLS_MUTED }
  | { type: ENGINE_ACTION_TYPE.DEVTOOLS_MUTE }
  | {
      type: ENGINE_ACTION_TYPE.DEVTOOLS_RESET
      reset: boolean
    }

const engineReducer = (
  state: EngineState,
  action: EngineActionType
): EngineState => {
  switch (action.type) {
    case ENGINE_ACTION_TYPE.SET_INSTALLED:
      return {
        ...state,
        installed: action.installed
      }
    case ENGINE_ACTION_TYPE.SET_INSTALL_ID:
      return {
        ...state,
        installId: action.id
      }
    case ENGINE_ACTION_TYPE.SET_IS_COMPOSER:
      return {
        ...state,
        isComposer: true
      }
    case ENGINE_ACTION_TYPE.SET_CURRENT_LIVE_EVENT:
      return {
        ...state,
        currentLiveEvent: action.id
      }
    case ENGINE_ACTION_TYPE.CLEAR_EVENT_STREAM:
      return {
        ...state,
        liveEventsInStream: []
      }
    case ENGINE_ACTION_TYPE.APPEND_LIVE_EVENTS_TO_STREAM:
      if (!action.reset) {
        return {
          ...state,
          liveEventsInStream: [
            ...action.liveEvents,
            ...state.liveEventsInStream
          ]
        }
      } else {
        return {
          ...state,
          liveEventsInStream: action.liveEvents
        }
      }
    case ENGINE_ACTION_TYPE.UPDATE_LIVE_EVENT_IN_STREAM:
      const foundEventIndex = state.liveEventsInStream.findIndex(
        (event) => event.id === action.liveEvent.id
      )

      if (foundEventIndex !== -1) {
        const clonedEvents = cloneDeep(state.liveEventsInStream)

        clonedEvents[foundEventIndex] = action.liveEvent

        return { ...state, liveEventsInStream: clonedEvents }
      } else {
        return state
      }
    case ENGINE_ACTION_TYPE.SET_WORLD_INFO:
      return {
        ...state,
        worldInfo: action.gameInfo
      }
    case ENGINE_ACTION_TYPE.PLAY:
      return {
        ...state,
        currentLiveEvent: action.fromEvent,
        playing: true
      }
    case ENGINE_ACTION_TYPE.STOP:
      return {
        ...state,
        liveEventsInStream: [],
        playing: false
      }
    case ENGINE_ACTION_TYPE.HIDE_ERROR_NOTIFICATION:
      return {
        ...state,
        errorNotification: { message: undefined, showing: false }
      }
    case ENGINE_ACTION_TYPE.SHOW_ERROR_NOTIFICATION:
      return {
        ...state,
        errorNotification: { message: action.message, showing: true }
      }
    case ENGINE_ACTION_TYPE.SET_UPDATE_WORLD:
      return {
        ...state,
        updating: action.updating
      }
    case ENGINE_ACTION_TYPE.SET_VISIBLE:
      return {
        ...state,
        visible: action.visible
      }
    case ENGINE_ACTION_TYPE.TOGGLE_DEVTOOLS_BLOCKED_CHOICES:
      return {
        ...state,
        devTools: {
          ...state.devTools,
          blockedChoicesVisible: !state.devTools.blockedChoicesVisible
        }
      }
    case ENGINE_ACTION_TYPE.TOGGLE_DEVTOOLS_CHARACTERS:
      return {
        ...state,
        devTools: {
          ...state.devTools,
          highlightCharacters: !state.devTools.highlightCharacters
        }
      }
    case ENGINE_ACTION_TYPE.TOGGLE_DEVTOOLS_EXPRESSIONS:
      return {
        ...state,
        devTools: {
          ...state.devTools,
          highlightExpressions: !state.devTools.highlightExpressions
        }
      }
    case ENGINE_ACTION_TYPE.TOGGLE_DEVTOOLS_XRAY:
      return {
        ...state,
        devTools: {
          ...state.devTools,
          xrayVisible: !state.devTools.xrayVisible
        }
      }
    case ENGINE_ACTION_TYPE.TOGGLE_DEVTOOLS_MUTED:
      return {
        ...state,
        devTools: {
          ...state.devTools,
          muted: !state.devTools.muted
        }
      }
    case ENGINE_ACTION_TYPE.DEVTOOLS_MUTE:
      return {
        ...state,
        devTools: {
          ...state.devTools,
          muted: true
        }
      }
    case ENGINE_ACTION_TYPE.DEVTOOLS_RESET:
      return {
        ...state,
        devTools: {
          ...state.devTools,
          reset: action.reset
        }
      }
    default:
      return state
  }
}

interface EngineContextType {
  engine: EngineState
  engineDispatch: (action: EngineActionType) => void
}

const defaultEngineState: EngineState = {
  currentLiveEvent: undefined,
  devTools: {
    highlightCharacters: false,
    blockedChoicesVisible: false,
    highlightExpressions: false,
    muted: true,
    xrayVisible: false,
    reset: false
  },
  liveEventsInStream: [],
  installed: false,
  installId: undefined,
  isComposer: false,
  worldInfo: undefined,
  playing: false,
  errorNotification: {
    message: undefined,
    showing: false
  },
  updating: false,
  visible: false
}

export const EngineContext = createContext<EngineContextType>({
  engine: defaultEngineState,
  engineDispatch: () => null
})

EngineContext.displayName = 'Context'

const EngineProvider: React.FC = ({ children }) => {
  const [engine, engineDispatch] = useReducer(engineReducer, defaultEngineState)

  return (
    <EngineContext.Provider
      value={useMemo(() => ({ engine, engineDispatch }), [
        engine,
        engineDispatch
      ])}
    >
      {children}
    </EngineContext.Provider>
  )
}

EngineProvider.displayName = 'EngineProvider'

export default EngineProvider
