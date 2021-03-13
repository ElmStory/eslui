import React, { useRef, useState, useContext, useEffect } from 'react'
import { cloneDeep } from 'lodash'

import { ComponentId, COMPONENT_TYPE } from '../../data/types'

import { EditorContext, EDITOR_ACTION_TYPE } from '../../contexts/EditorContext'

import DockLayout, {
  PanelData,
  TabData,
  TabBase,
  LayoutBase,
  DropDirection,
  PanelBase,
  BoxBase
} from 'rc-dock'
import logger from '../../lib/logger'

interface EditorTab {
  panelId: string
  active: boolean
  type?: COMPONENT_TYPE
  expanded?: boolean
  data: TabData
}

const EditorContent: React.FC<{ title: string }> = ({ title }) => {
  return <div>{title}</div>
}

const createEditorTab = ({
  panelId,
  active,
  type,
  expanded,
  data: { id, title, content, group = 'default' }
}: EditorTab): EditorTab => ({
  panelId,
  active,
  type,
  expanded,
  data: {
    id,
    title,
    content,
    group,
    closable: true
  }
})

const createBaseLayoutData = (): LayoutBase => ({
  dockbox: {
    mode: 'horizontal',
    children: [{ id: '+0', tabs: [] }]
  }
})

const getBoxes = (box: BoxBase): BoxBase[] =>
  [box].concat(...(box.children || []).map((box) => getBoxes(box as BoxBase)))

interface Panel extends BoxBase {
  tabs?: TabData[]
}

const getPanels = (boxes: BoxBase[]): Panel[] =>
  boxes.filter((box) => !box.mode).map((panel) => panel)

const ComponentEditor: React.FC = () => {
  const dockLayout = useRef<DockLayout>(null)

  const { editor, editorDispatch } = useContext(EditorContext)

  const [layoutData, setLayoutData] = useState<LayoutBase>(
      createBaseLayoutData()
    ),
    [panels, setPanels] = useState<PanelBase[]>([]),
    [activePanelId, setActivePanelId] = useState<string | undefined>(undefined),
    [tabs, setTabs] = useState<EditorTab[]>([]),
    [activeTabId, setActiveTabId] = useState<ComponentId | undefined>(undefined)

  function onLayoutChange(
    newLayout: LayoutBase,
    changingTabId?: string | undefined,
    direction?: DropDirection | undefined
  ) {
    setLayoutData(newLayout)

    if (changingTabId) {
      const clonedPanels = cloneDeep(
          getPanels(getBoxes(newLayout.dockbox)) as PanelBase[]
        ),
        activePanel = clonedPanels.find(
          (panel) =>
            panel.tabs.findIndex((tab) => tab.id === changingTabId) !== -1
        ),
        clonedTabs = cloneDeep(tabs)

      if (activePanel && activePanel.id) {
        setActivePanelId(activePanel.id)

        clonedTabs.map((tab) => {
          if (tab.data.id === changingTabId && activePanel.id) {
            tab.panelId = activePanel.id
          }
        })
      }

      if (direction && direction === 'remove') {
        clonedTabs.map((tab, index) => {
          if (tab.data.id === changingTabId) {
            if (
              clonedPanels.findIndex(
                (clonedPanel) => tabs[index].panelId === clonedPanel.id
              ) === -1
            ) {
              // TODO: this should be next to the closest panel (use state 'panels')
              setActivePanelId('+0')
            }

            clonedTabs.splice(index, 1)
          }
        })
      }

      clonedPanels.map((panel) => {
        clonedTabs.map((tab) => {
          if (tab.panelId === panel.id) {
            tab.active = panel.activeId === tab.data.id

            if (editor.selectedGameOutlineComponent.id !== tab.data.id) {
              editorDispatch({
                type: EDITOR_ACTION_TYPE.GAME_OUTLINE_SELECT,
                selectedGameOutlineComponent: {
                  id: panel.activeId,
                  type: tab.type,
                  title: tab.data.title as string,
                  expanded: true
                }
              })
            }
          }
        })
      })

      setPanels(clonedPanels)
      setTabs(clonedTabs)
    }
  }

  function loadTab({ id }: TabBase): TabData {
    return tabs[tabs.findIndex((tab) => tab.data.id === id)].data
  }

  useEffect(() => {
    if (
      editor.selectedGameOutlineComponent.id &&
      editor.selectedGameOutlineComponent.title
    ) {
      const { id, title, type, expanded } = editor.selectedGameOutlineComponent

      if (tabs.findIndex((tab) => tab.data.id === id) === -1 && activePanelId) {
        setTabs([
          ...tabs,
          createEditorTab({
            panelId: activePanelId,
            active: true,
            type,
            expanded,
            data: {
              id,
              title,
              content: <EditorContent title={title} />
            }
          })
        ])
      } else {
        const clonedTabs = cloneDeep(tabs)
        let newActivePanelId: string | undefined

        clonedTabs.map((tab) => {
          if (tab.data.id === id) {
            newActivePanelId = tab.panelId
          }
        })

        if (newActivePanelId) {
          clonedTabs.map((tab) => {
            if (tab.panelId === newActivePanelId) {
              tab.active = tab.data.id === id
            }
          })

          setActivePanelId(newActivePanelId)
        }

        setTabs(clonedTabs)
      }
    }
  }, [editor.selectedGameOutlineComponent])

  useEffect(() => {
    if (tabs.length > 0) {
      const clonedLayoutData = cloneDeep(layoutData),
        panels = getPanels(getBoxes(clonedLayoutData.dockbox)) as PanelData[],
        clonedTabs = cloneDeep(tabs)

      panels.map((panel) => {
        clonedTabs.map((tab) => {
          if (tab.panelId === panel.id && tab.active) {
            panel.activeId = tab.data.id
          }
        })

        panel.tabs = clonedTabs
          .filter((tab) => tab.panelId === panel.id)
          .map((tab) => tab.data)
      })

      setLayoutData(clonedLayoutData)
    }
  }, [tabs])

  useEffect(() => {
    logger.info(`Set active panel ID: ${activePanelId}`)
  }, [activePanelId])

  useEffect(() => {
    console.log(layoutData)

    const clonedBasePanel = cloneDeep(
      layoutData.dockbox.children[0] as PanelData
    )

    if (layoutData.dockbox.children.length === 1) {
      setPanels([clonedBasePanel])
      setActivePanelId(clonedBasePanel.id)
    }

    if (clonedBasePanel.tabs.length === 0) {
      editorDispatch({
        type: EDITOR_ACTION_TYPE.GAME_OUTLINE_SELECT,
        selectedGameOutlineComponent: {}
      })
    }
  }, [layoutData])

  useEffect(() => {
    setPanels([layoutData.dockbox.children[0] as PanelData])
    setActivePanelId(layoutData.dockbox.children[0].id)
  }, [])

  return (
    <>
      {tabs.length > 0 ? (
        <DockLayout
          ref={dockLayout}
          layout={layoutData}
          loadTab={loadTab}
          onLayoutChange={onLayoutChange}
          groups={{
            default: {
              floatable: false,
              animated: false,
              maximizable: true
            }
          }}
          dropMode="edge"
        />
      ) : (
        <div>Select a component to edit...</div>
      )}
    </>
  )
}

export default ComponentEditor
