import React, { createContext, useMemo, useReducer } from 'react'

import { ComponentId, COMPONENT_TYPE } from '../data/types'

interface EditorState {
  renamedComponent: {
    id?: ComponentId
    type?: COMPONENT_TYPE
    newTitle?: string
  }
  removedComponent: {
    id?: ComponentId
    type?: COMPONENT_TYPE
  }
  selectedGameOutlineComponent: {
    id?: ComponentId | undefined
    expanded?: boolean | undefined
    type?: COMPONENT_TYPE | undefined
    title?: string | undefined
  }
  renamingGameOutlineComponent: {
    id: ComponentId | undefined
    renaming: boolean
  }
  expandedGameOutlineComponents: ComponentId[]
}

export enum EDITOR_ACTION_TYPE {
  COMPONENT_RENAME = 'EDITOR_COMPONENT_RENAME',
  COMPONENT_REMOVE = 'EDITOR_COMPONENT_REMOVE',
  GAME_OUTLINE_SELECT = 'GAME_OUTLINE_SELECT',
  GAME_OUTLINE_RENAME = 'GAME_OUTLINE_RENAME',
  GAME_OUTLINE_EXPAND = 'GAME_OUTLINE_EXPAND'
}

type EditorActionType =
  | {
      type: EDITOR_ACTION_TYPE.COMPONENT_RENAME
      renamedComponent: {
        id?: ComponentId
        type?: COMPONENT_TYPE
        newTitle?: string
      }
    }
  | {
      type: EDITOR_ACTION_TYPE.COMPONENT_REMOVE
      removedComponent: {
        id?: ComponentId
        type?: COMPONENT_TYPE
      }
    }
  | {
      type: EDITOR_ACTION_TYPE.GAME_OUTLINE_SELECT
      selectedGameOutlineComponent: {
        id?: ComponentId | undefined
        expanded?: boolean | undefined
        type?: COMPONENT_TYPE | undefined
        title?: string | undefined
      }
    }
  | {
      type: EDITOR_ACTION_TYPE.GAME_OUTLINE_RENAME
      renamingGameOutlineComponent: {
        id: ComponentId | undefined
        renaming: boolean
      }
    }
  | {
      type: EDITOR_ACTION_TYPE.GAME_OUTLINE_EXPAND
      expandedGameOutlineComponents: ComponentId[]
    }

const editorReducer = (
  state: EditorState,
  action: EditorActionType
): EditorState => {
  switch (action.type) {
    case EDITOR_ACTION_TYPE.COMPONENT_RENAME:
      return {
        ...state,
        renamedComponent: action.renamedComponent
      }
    case EDITOR_ACTION_TYPE.COMPONENT_REMOVE:
      return {
        ...state,
        removedComponent: action.removedComponent
      }
    case EDITOR_ACTION_TYPE.GAME_OUTLINE_SELECT:
      return {
        ...state,
        selectedGameOutlineComponent: action.selectedGameOutlineComponent || {}
      }
    case EDITOR_ACTION_TYPE.GAME_OUTLINE_RENAME:
      return {
        ...state,
        renamingGameOutlineComponent: action.renamingGameOutlineComponent
      }
    case EDITOR_ACTION_TYPE.GAME_OUTLINE_EXPAND:
      return {
        ...state,
        expandedGameOutlineComponents: action.expandedGameOutlineComponents
      }
    default:
      return state
  }
}

interface EditorContextType {
  editor: EditorState
  editorDispatch: React.Dispatch<EditorActionType>
}

const defaultEditorState: EditorState = {
  renamedComponent: {
    id: undefined,
    type: undefined,
    newTitle: undefined
  },
  removedComponent: {
    id: undefined,
    type: undefined
  },
  selectedGameOutlineComponent: {
    id: undefined,
    expanded: false,
    type: undefined,
    title: undefined
  },
  renamingGameOutlineComponent: {
    id: undefined,
    renaming: false
  },
  expandedGameOutlineComponents: []
}

export const EditorContext = createContext<EditorContextType>({
  editor: defaultEditorState,
  editorDispatch: () => {}
})

const EditorProvider: React.FC = ({ children }) => {
  const [editor, editorDispatch] = useReducer(editorReducer, defaultEditorState)

  return (
    <EditorContext.Provider
      value={useMemo(() => ({ editor, editorDispatch }), [
        editor,
        editorDispatch
      ])}
    >
      {children}
    </EditorContext.Provider>
  )
}

export default EditorProvider
