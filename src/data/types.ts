export enum COMPONENT_TYPE {
  STUDIO = 'STUDIO',
  GAME = 'GAME',
  CHAPTER = 'CHAPTER',
  SCENE = 'SCENE',
  ROUTE = 'ROUTE',
  PASSAGE = 'PASSAGE',
  CHOICE = 'CHOICE',
  CONDITION = 'CONDITION',
  EFFECT = 'EFFECT',
  VARIABLE = 'VARIABLE'
}

export enum GAME_TEMPLATE {
  ADVENTURE = 'ADVENTURE',
  OPEN_WORLD = 'OPEN_WORLD'
}

export enum VARIABLE_TYPE {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  IMAGE = 'IMAGE',
  URL = 'URL'
}

export enum COMPARE_OPERATOR {
  EQ = '===', // equal to
  NE = '!==', // not equal to
  GTE = '>=', // greater than or equal to
  GT = '>', // greater than
  LT = '<', // less than
  LTE = '<=', // less than or equal to
  EX = '!== undefined', // exits
  NX = '=== undefined' // does not exist
}

export enum SET_OPERATOR {
  ASSIGN = '=',
  ADD = '+',
  SUBTRACT = '-',
  DIVIDE = '/'
}

export type StudioId = string
export type GameId = string
export type ComponentId = string

type VariableId = string

export interface Component {
  id?: ComponentId | VariableId
  title: string
  tags: string[] | []
  updated?: number // UTC timestamp
}

export interface Studio extends Component {
  id?: StudioId
  games: GameId[] // references by ID
}

export interface Editor extends Component {}

export interface Game extends Component {
  id?: GameId
  template: GAME_TEMPLATE
  director: string
  version: string
  engine: string
  chapters: ComponentId[]
}

export interface Chapter extends Component {
  gameId: GameId
  scenes: ComponentId[]
}

export interface Scene extends Component {
  gameId: GameId
  chapterId: ComponentId
  passages: ComponentId[]
  editor?: {
    componentEditorTransformX?: number
    componentEditorTransformY?: number
    componentEditorTransformZoom?: number
  }
}

export interface Route extends Component {
  gameId: GameId
  sceneId: ComponentId
  originId: ComponentId
  choiceId?: ComponentId
  originType: COMPONENT_TYPE
  destinationId: ComponentId
  destinationType: COMPONENT_TYPE
}

export interface Passage extends Component {
  gameId: GameId
  sceneId: ComponentId
  choices: ComponentId[]
  content: string
  editor?: {
    componentEditorPosX?: number
    componentEditorPosY?: number
  }
}

export interface Choice extends Component {
  gameId: GameId
  passageId: ComponentId
  goto:
    | [
        COMPONENT_TYPE.CHAPTER | COMPONENT_TYPE.SCENE | COMPONENT_TYPE.PASSAGE,
        ComponentId
      ]
    | []
  conditions: Condition[] | string[]
}

export interface Condition extends Component {
  compare: [VariableId, COMPARE_OPERATOR, VariableId | string]
}

export interface Effect extends Component {
  set: [VariableId, SET_OPERATOR, VariableId | string]
}

export interface Variable extends Component {
  gameId: GameId
  type: VARIABLE_TYPE
  defaultValue: string
}
