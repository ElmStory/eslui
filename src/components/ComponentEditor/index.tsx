import React, { useRef, useState, useContext, useEffect } from 'react'
import { cloneDeep } from 'lodash'

import { ComponentId, COMPONENT_TYPE, StudioId } from '../../data/types'

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

import ChapterTabContent from './ChapterTabContent'
import SceneTabContent from './SceneTabContent'

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

const ComponentEditor: React.FC<{ studioId: StudioId }> = ({ studioId }) => {
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
              // panel is closing
              clonedPanels.findIndex(
                (clonedPanel) => clonedTabs[index].panelId === clonedPanel.id
              ) === -1
            ) {
              const firstPanel = clonedPanels[0],
                activeTab = clonedTabs.find(
                  (tab) => tab.data.id === firstPanel.activeId
                )

              // TODO: closest ccw panel, not the first
              setActivePanelId(firstPanel.id)

              editorDispatch({
                type: EDITOR_ACTION_TYPE.GAME_OUTLINE_SELECT,
                selectedGameOutlineComponent: {
                  id: activeTab?.data.id,
                  type: activeTab?.type,
                  title: activeTab?.data.title as string,
                  expanded: true
                }
              })
            }

            clonedTabs.splice(index, 1)
          } else {
            // TODO: select correct component
            // panel is not closing
          }
        })
      } else {
        if (editor.selectedGameOutlineComponent.id !== changingTabId) {
          const activeTab = clonedTabs.find(
            (tab) => tab.data.id === changingTabId
          )

          editorDispatch({
            type: EDITOR_ACTION_TYPE.GAME_OUTLINE_SELECT,
            selectedGameOutlineComponent: {
              id: changingTabId,
              type: activeTab?.type,
              title: activeTab?.data.title as string,
              expanded: true
            }
          })
        }
      }

      clonedPanels.map((panel) => {
        clonedTabs.map((tab) => {
          if (tab.panelId === panel.id) {
            tab.active = panel.activeId === tab.data.id
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

      // TODO: passage type -> open scene tab -> select scene tab -> zoom passage node
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
              content: () => {
                switch (type) {
                  case COMPONENT_TYPE.CHAPTER:
                    return (
                      <ChapterTabContent studioId={studioId} chapterId={id} />
                    )
                  case COMPONENT_TYPE.SCENE:
                    return <SceneTabContent studioId={studioId} sceneId={id} />
                  default:
                    return <EditorContent title={title} />
                }
              }
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

      // TODO: when setting activeId, check first if tab still exists
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
    } else {
      setLayoutData(createBaseLayoutData())
    }
  }, [tabs])

  useEffect(() => {
    const clonedTabs = cloneDeep(tabs),
      tabToRename = clonedTabs.find(
        (clonedTab) => clonedTab.data.id === editor.renamedComponent.id
      )

    if (tabToRename && editor.renamedComponent.newTitle) {
      tabToRename.data.title = editor.renamedComponent.newTitle
    }

    setTabs(clonedTabs)
  }, [editor.renamedComponent])

  useEffect(() => {
    logger.info('ComponentEditor -> editor.removedComponent Effect')
    // TODO: find panel with component to remove -> closest available tab to make active
    // -> remove tab -> set tabs
    // TODO: if the component being removed is a chapter or scene, must also recursively
    // close the children if they are open
    const clonedLayoutData = cloneDeep(layoutData),
      clonedPanels = getPanels(
        getBoxes(clonedLayoutData.dockbox)
      ) as PanelData[],
      clonedTabs = cloneDeep(tabs),
      tabToRemoveIndex = clonedTabs.findIndex(
        (clonedTab) => clonedTab.data.id === editor.removedComponent.id
      ),
      tabToRemove = clonedTabs.find(
        (clonedTab) => clonedTab.data.id === editor.removedComponent.id
      ),
      clonedPanelWithTab = clonedPanels.find(
        (clonedPanel) => clonedPanel.id === tabToRemove?.panelId
      )

    if (clonedPanels.length === 1) {
      // only 1 panel
      if (clonedPanelWithTab?.tabs.length === 1) {
        // only 1 tab
        setTabs([])
      } else {
        // more than 1 tab

        clonedTabs.splice(tabToRemoveIndex, 1)

        setTabs(clonedTabs)
      }
    } else {
      // more than 1 panel
    }

    console.log(tabToRemove)
    console.log(clonedPanelWithTab)
  }, [editor.removedComponent])

  useEffect(() => {
    logger.info(`Set active panel ID: ${activePanelId}`)
  }, [activePanelId])

  useEffect(() => {
    logger.info('layoutData effect')
    console.log(layoutData)

    const clonedLayoutData = cloneDeep(layoutData),
      clonedPanels = getPanels(
        getBoxes(clonedLayoutData.dockbox)
      ) as PanelData[]

    if (clonedPanels.length === 1) {
      setActivePanelId(clonedPanels[0].id)

      if (clonedPanels[0].tabs.length === 0) {
        editorDispatch({
          type: EDITOR_ACTION_TYPE.GAME_OUTLINE_SELECT,
          selectedGameOutlineComponent: {}
        })
      }
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
