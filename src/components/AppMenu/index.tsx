import { ipcRenderer } from 'electron'
import React, { useContext } from 'react'

import { WINDOW_EVENT_TYPE } from '../../lib/events'

import { useSelectedProfile } from '../../hooks/useProfiles'

import { AppContext, APP_ACTION_TYPE } from '../../contexts/AppContext'
import { ModalContext, MODAL_ACTION_TYPE } from '../../contexts/AppModalContext'

import Transition, { TRANSITION_TYPE } from '../Transition'
import Button, { ButtonProps } from '../Button'

import styles from './styles.module.scss'

import ProfileModalLayout, {
  PROFILE_MODAL_LAYOUT_TYPE
} from '../../layouts/ProfileModal'

interface AppMenuRowProps extends ButtonProps {
  title: string
}

const MenuButton: React.FC<AppMenuRowProps> = ({
  title,
  onClick,
  destroy = false,
  disabled = false
}) => {
  return (
    <Button
      className={styles.row}
      onClick={onClick}
      destroy={destroy}
      disabled={disabled}
    >
      {title}
    </Button>
  )
}

const MenuVerticalSpacer: React.FC = () => {
  return <div className={styles.spacer} />
}

const AppMenu: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { app, appDispatch } = useContext(AppContext)
  const { modalDispatch } = useContext(ModalContext)
  const [selectedProfile] = useSelectedProfile()

  return (
    <>
      {/* Blocks interaction to elements below; closes menu. */}
      <Transition in={app.menuOpen} type={TRANSITION_TYPE.SNAP}>
        <div
          className={`${styles.blocker} ${app.menuOpen && styles.blocking}`}
          onMouseDown={() => appDispatch({ type: APP_ACTION_TYPE.MENU_CLOSE })}
        />
      </Transition>

      <Transition in={app.menuOpen} type={TRANSITION_TYPE.FADE}>
        <div
          className={`${styles.appMenu} ${
            app.fullscreen ? styles.fullscreen : styles.floating
          } ${className}`}
        >
          <MenuButton
            title="Create Profile..."
            onClick={() => {
              appDispatch({ type: APP_ACTION_TYPE.MENU_CLOSE })

              modalDispatch({
                type: MODAL_ACTION_TYPE.LAYOUT,
                layout: (
                  <ProfileModalLayout type={PROFILE_MODAL_LAYOUT_TYPE.CREATE} />
                )
              })

              modalDispatch({ type: MODAL_ACTION_TYPE.OPEN })
            }}
          />
          {selectedProfile && selectedProfile.name && (
            <MenuButton
              title={`Selected profile: ${selectedProfile?.name}`}
              onClick={() => {
                appDispatch({ type: APP_ACTION_TYPE.MENU_CLOSE })

                modalDispatch({
                  type: MODAL_ACTION_TYPE.LAYOUT,
                  layout: (
                    <ProfileModalLayout
                      type={PROFILE_MODAL_LAYOUT_TYPE.EDIT}
                      profile={selectedProfile}
                    />
                  )
                })

                modalDispatch({ type: MODAL_ACTION_TYPE.OPEN })
              }}
            />
          )}

          <MenuVerticalSpacer />

          <MenuButton title="Create Game..." disabled={!selectedProfile} />

          <MenuVerticalSpacer />

          <MenuButton
            title="Quit"
            destroy
            onClick={() => ipcRenderer.send(WINDOW_EVENT_TYPE.QUIT)}
          />
        </div>
      </Transition>
    </>
  )
}

export default AppMenu
