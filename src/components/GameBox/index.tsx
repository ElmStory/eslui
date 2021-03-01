import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { ComponentId, GameDocument } from '../../data/types'

import {
  AppContext,
  APP_ACTION_TYPE,
  APP_LOCATION
} from '../../contexts/AppContext'

import { Card, Button, Tooltip } from 'antd'
import { FormOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'

import { SaveGameModal, RemoveGameModal } from '../Modal'

import styles from './styles.module.less'

interface GameBoxProps {
  studioId: ComponentId
  game?: GameDocument
}

const GameBox: React.FC<GameBoxProps> = ({ studioId, game }) => {
  const { appDispatch } = useContext(AppContext)

  const [saveGameModalVisible, setSaveGameModalVisible] = useState(false),
    [removeGameModalVisible, setRemoveGameModalVisible] = useState(false)

  const { Meta } = Card

  const history = useHistory()

  return (
    <>
      {/* MODALS */}
      {!game && studioId && (
        <SaveGameModal
          visible={saveGameModalVisible}
          onCancel={() => setSaveGameModalVisible(false)}
          afterClose={() => setSaveGameModalVisible(false)}
          studioId={studioId}
        />
      )}

      {game && (
        <RemoveGameModal
          visible={removeGameModalVisible}
          onCancel={() => setRemoveGameModalVisible(false)}
          afterClose={() => setRemoveGameModalVisible(false)}
          studioId={studioId}
          game={game}
        />
      )}

      {/* CONTENT */}
      <Card
        className={styles.gameBox}
        title={game?.title || undefined}
        hoverable
        actions={
          !game
            ? []
            : [
                <Tooltip title="Remove game from library." mouseEnterDelay={1}>
                  <DeleteOutlined
                    key="delete"
                    onClick={(event) => {
                      event.stopPropagation()

                      setRemoveGameModalVisible(true)
                    }}
                  />
                </Tooltip>,
                <Tooltip title="Open game in editor." mouseEnterDelay={1}>
                  <FormOutlined key="edit" />
                </Tooltip>
              ]
        }
        onClick={() => {
          if (game) {
            appDispatch({
              type: APP_ACTION_TYPE.GAME_SELECT,
              selectedGameId: game.id
            })

            history.push(APP_LOCATION.EDITOR)
          } else {
            setSaveGameModalVisible(true)
          }
        }}
      >
        {!game && (
          <Tooltip title="Add game to library." mouseEnterDelay={1}>
            <Button className={styles.addGameButton}>
              <PlusOutlined />
            </Button>
          </Tooltip>
        )}

        {game && (
          <>
            <Meta title="directed by" description={game.director} />
          </>
        )}
      </Card>
    </>
  )
}

export default GameBox