import { ipcRenderer } from 'electron'
import React, { useEffect, useRef, useContext } from 'react'

import { WINDOW_EVENT_TYPE } from '../../lib/events'

import {
  AppContext,
  APP_ACTION_TYPE,
  APP_LOCATION
} from '../../contexts/AppContext'

import styles from './styles.module.less'
import { useLocation } from 'react-router-dom'

enum TITLE_BAR_BUTTON_TYPE {
  QUIT = 'QUIT',
  MINIMIZE = 'MINIMIZE',
  FULLSCREEN = 'FULLSCREEN',
  FLOATING = 'FLOATING',
  MENU = 'MENU'
}

interface TitleBarButtonProps extends React.HTMLProps<HTMLDivElement> {
  type: TITLE_BAR_BUTTON_TYPE
}

const TitleBarButton: React.FC<TitleBarButtonProps> = ({ onClick, type }) => {
  let buttonStyle, buttonTitle

  switch (type) {
    case TITLE_BAR_BUTTON_TYPE.QUIT:
      buttonStyle = styles.quitButton
      buttonTitle = 'Quit'
      break
    case TITLE_BAR_BUTTON_TYPE.MINIMIZE:
      buttonStyle = styles.minimizeButton
      buttonTitle = 'Minimize'
      break
    case TITLE_BAR_BUTTON_TYPE.FULLSCREEN:
      buttonStyle = styles.fullscreenButton
      buttonTitle = 'Enter Fullscreen'
      break
    case TITLE_BAR_BUTTON_TYPE.FLOATING:
      buttonStyle = styles.floatingButton
      buttonTitle = 'Exit Fullscreen'
      break
    case TITLE_BAR_BUTTON_TYPE.MENU:
      buttonStyle = styles.menuButton
      buttonTitle = 'Menu'
      break
    default:
      throw new Error('Unable to generate TitleBarButton. Missing type.')
  }

  return (
    <div
      className={`${styles.titleBarButton} ${buttonStyle}`}
      title={buttonTitle}
      onClick={onClick}
    />
  )
}

const TitleBar: React.FC = () => {
  const { pathname } = useLocation()
  const { app, appDispatch } = useContext(AppContext)
  /**
   * TODO: this is used to prevent toggling out of full screen
   * on development reload
   */
  const isFirstRun = useRef(true)

  useEffect(() => {
    ipcRenderer.on(WINDOW_EVENT_TYPE.FULLSCREEN, () =>
      appDispatch({ type: APP_ACTION_TYPE.FULLSCREEN })
    )
    ipcRenderer.on(WINDOW_EVENT_TYPE.FLOAT, () =>
      appDispatch({ type: APP_ACTION_TYPE.FLOATING })
    )
  }, [])

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
    } else {
      ipcRenderer.send(WINDOW_EVENT_TYPE.TOGGLE_FULLSCREEN, app.fullscreen)
    }
  }, [app.fullscreen])

  useEffect(() => {
    switch (pathname) {
      case APP_LOCATION.DASHBOARD:
        appDispatch({ type: APP_ACTION_TYPE.HEADER, header: 'DASHBOARD' })
        break
      case APP_LOCATION.EDITOR:
        appDispatch({ type: APP_ACTION_TYPE.HEADER, header: 'EDITOR' })
        break
      default:
        break
    }
  }, [pathname])

  return (
    <div className={styles.titleBar}>
      <div className={styles.titleBarButtonsContainer}>
        <TitleBarButton
          type={TITLE_BAR_BUTTON_TYPE.QUIT}
          onClick={() => ipcRenderer.send(WINDOW_EVENT_TYPE.QUIT)}
        />
        {!app.fullscreen && (
          <TitleBarButton
            type={TITLE_BAR_BUTTON_TYPE.MINIMIZE}
            onClick={() => ipcRenderer.send(WINDOW_EVENT_TYPE.MINIMIZE)}
          />
        )}
        <TitleBarButton
          type={
            app.fullscreen
              ? TITLE_BAR_BUTTON_TYPE.FLOATING
              : TITLE_BAR_BUTTON_TYPE.FULLSCREEN
          }
          onClick={() =>
            appDispatch({
              type: app.fullscreen
                ? APP_ACTION_TYPE.FLOATING
                : APP_ACTION_TYPE.FULLSCREEN
            })
          }
        />
        {/* #137 */}
        {/* <TitleBarButton
          type={TITLE_BAR_BUTTON_TYPE.MENU}
          onClick={() =>
            appDispatch({
              type: app.menuOpen
                ? APP_ACTION_TYPE.MENU_CLOSE
                : APP_ACTION_TYPE.MENU_OPEN
            })
          }
        /> */}
      </div>

      <header>{app.header}</header>
    </div>
  )
}

export default TitleBar
