import { Descendant } from 'slate'

export enum PLATFORM_TYPE {
  WINDOWS = 'win32',
  MACOS = 'darwin',
  LINUX = 'linux'
}

export enum COMPONENT_TYPE {
  CHARACTER = 'CHARACTER',
  CHOICE = 'CHOICE',
  CONDITION = 'CONDITION',
  EFFECT = 'EFFECT',
  FOLDER = 'FOLDER',
  GAME = 'GAME',
  INPUT = 'INPUT',
  JUMP = 'JUMP',
  PASSAGE = 'PASSAGE',
  ROUTE = 'ROUTE',
  SCENE = 'SCENE',
  STUDIO = 'STUDIO',
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

export enum COMPARE_OPERATOR_TYPE {
  EQ = '=', // equal to
  NE = '!=', // not equal to
  GTE = '>=', // greater than or equal to
  GT = '>', // greater than
  LT = '<', // less than
  LTE = '<=' // less than or equal to
}

export enum SET_OPERATOR_TYPE {
  ASSIGN = '=',
  ADD = '+',
  SUBTRACT = '-',
  MULTIPLY = '*',
  DIVIDE = '/'
}

export const DEFAULT_PASSAGE_CONTENT: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }]
  }
]

export type StudioId = string
export type GameId = string
export type ComponentId = string

export interface GameState {
  [variableId: string]: {
    title: string
    type: VARIABLE_TYPE
    initialValue: string
    currentValue: string
  }
}

export interface Component {
  id?: ComponentId
  title: string
  tags: string[] | []
  updated?: number // UTC timestamp
  editor?: {
    // SceneView transform
    componentEditorTransformX?: number
    componentEditorTransformY?: number
    componentEditorTransformZoom?: number
    // SceneView->Passage,Jump position
    componentEditorPosX?: number
    componentEditorPosY?: number
  }
}

export interface Studio extends Component {
  id?: StudioId
  games: GameId[] // references by ID
}

export interface Editor extends Component {}

export enum CHARACTER_MOOD_TYPE {
  ANNOYED = 'ANNOYED',
  BORED = 'BORED',
  CALM = 'CALM', // default
  CAREFREE = 'CAREFREE',
  CHEERFUL = 'CHEERFUL',
  EXCITED = 'EXCITED',
  GLOOMY = 'GLOOMY',
  HAPPY = 'HAPPY',
  IRRITATED = 'IRRITATED',
  LIVELY = 'LIVELY',
  NERVOUS = 'NERVOUS',
  RELAXED = 'RELAXED',
  SAD = 'SAD',
  SERENE = 'SERENE',
  TENSE = 'TENSE',
  WEARY = 'WEARY'
}

export type CharacterRefs = Array<[string, string]> // 0 = uuid, 1 = nick

export interface CharacterPortrait {
  imageId: string // the location will change, but keep asset ID consistent
  mood: CHARACTER_MOOD_TYPE
}

export interface Character extends Component {
  defaultPortrait: CharacterPortrait
  description: string
  portraits: CharacterPortrait[]
  refs: CharacterRefs
}

export type GameChildRefs = Array<
  [COMPONENT_TYPE.FOLDER | COMPONENT_TYPE.SCENE, ComponentId]
>

export interface Game extends Component {
  children: GameChildRefs
  copyright?: string
  description?: string
  designer: string
  engine: string
  id?: GameId
  jump: ComponentId | null // Jump
  template: GAME_TEMPLATE
  version: string
  website?: string
}

// To reduce dupe, set null when parent is of type GAME
export type FolderParentRef = [
  COMPONENT_TYPE.GAME | COMPONENT_TYPE.FOLDER,
  ComponentId | null
]
export type FolderChildRefs = Array<
  [COMPONENT_TYPE.FOLDER | COMPONENT_TYPE.SCENE, ComponentId]
>

export interface Folder extends Component {
  children: FolderChildRefs
  gameId: GameId
  parent: FolderParentRef
}

export type JumpRoute = [ComponentId?, ComponentId?] // [sceneId, passageId]

export interface Jump extends Component {
  gameId: GameId
  sceneId?: ComponentId
  route: JumpRoute
}

// To reduce dupe, set null when parent is of type GAME
export type SceneParentRef = [
  COMPONENT_TYPE.GAME | COMPONENT_TYPE.FOLDER,
  ComponentId | null
]
export type SceneChildRefs = Array<[COMPONENT_TYPE.PASSAGE, ComponentId]>

export interface Scene extends Component {
  children: SceneChildRefs
  gameId: GameId
  parent: SceneParentRef
  jumps: ComponentId[]
}

export interface Route extends Component {
  gameId: GameId
  sceneId: ComponentId
  originId: ComponentId
  choiceId?: ComponentId
  inputId?: ComponentId
  originType: COMPONENT_TYPE | PASSAGE_TYPE
  destinationId: ComponentId
  destinationType: COMPONENT_TYPE
}

// Route Condition
export interface Condition extends Component {
  gameId: GameId
  routeId: ComponentId
  variableId: ComponentId
  compare: [ComponentId, COMPARE_OPERATOR_TYPE, string, VARIABLE_TYPE] // variable ref
}

// Route Condition
export interface Effect extends Component {
  gameId: GameId
  routeId: ComponentId
  variableId: ComponentId
  set: [ComponentId, SET_OPERATOR_TYPE, string] // variable ref
}

export enum PASSAGE_TYPE {
  CHOICE = 'CHOICE',
  INPUT = 'INPUT'
}

export interface Passage extends Component {
  gameOver: boolean // game end
  gameId: GameId
  sceneId: ComponentId
  choices: ComponentId[]
  content: string
  input?: ComponentId // input ref
  type: PASSAGE_TYPE
}

export interface Choice extends Component {
  gameId: GameId
  passageId: ComponentId
}

export interface Input extends Component {
  gameId: GameId
  passageId: ComponentId
  variableId?: ComponentId
}

export interface Variable extends Component {
  gameId: GameId
  type: VARIABLE_TYPE
  initialValue: string
}
