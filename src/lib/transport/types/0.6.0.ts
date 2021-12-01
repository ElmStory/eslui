export enum ELEMENT_TYPE {
  STUDIO = 'STUDIO',
  GAME = 'GAME',
  JUMP = 'JUMP',
  FOLDER = 'FOLDER',
  SCENE = 'SCENE',
  PATH = 'PATH',
  EVENT = 'EVENT',
  CHOICE = 'CHOICE',
  INPUT = 'INPUT',
  CONDITION = 'CONDITION',
  EFFECT = 'EFFECT',
  VARIABLE = 'VARIABLE',
  WORLD = 'WORLD'
}

export enum COMPARE_OPERATOR_TYPE {
  EQ = '=',
  NE = '!=',
  GTE = '>=',
  GT = '>',
  LT = '<',
  LTE = '<='
}

export enum SET_OPERATOR_TYPE {
  ASSIGN = '=',
  ADD = '+',
  SUBTRACT = '-',
  MULTIPLY = '*',
  DIVIDE = '/'
}

export enum EVENT_TYPE {
  CHOICE = 'CHOICE',
  INPUT = 'INPUT'
}

export enum VARIABLE_TYPE {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  IMAGE = 'IMAGE',
  URL = 'URL'
}

export type StudioId = string
export type GameId = string
export type ElementId = string

export type GameChildRefs = Array<
  [ELEMENT_TYPE.FOLDER | ELEMENT_TYPE.SCENE, ElementId]
>

export type FolderParentRef = [
  ELEMENT_TYPE.GAME | ELEMENT_TYPE.FOLDER,
  ElementId | null
]

export type FolderChildRefs = Array<
  [ELEMENT_TYPE.FOLDER | ELEMENT_TYPE.SCENE, ElementId]
>

export type SceneParentRef = [
  ELEMENT_TYPE.GAME | ELEMENT_TYPE.FOLDER,
  ElementId | null
]

export type SceneChildRefs = Array<[ELEMENT_TYPE.EVENT, ElementId]>

export interface RootData {
  children: GameChildRefs
  copyright?: string
  description?: string
  designer: string
  engine: string
  id: string
  jump: string | null
  schema: string
  studioId: StudioId
  studioTitle: string
  tags: string[]
  title: string
  updated: number
  version: string
  website?: string
}

export interface ChoiceData {
  id: ElementId
  eventId: ElementId
  tags: string[]
  title: string
  updated: number
}

export interface ChoiceCollection {
  [choiceId: string]: ChoiceData
}

export interface ConditionData {
  compare: [ElementId, COMPARE_OPERATOR_TYPE, string]
  id: ElementId
  pathId: ElementId
  tags: string[]
  title: string
  updated: number
  variableId: ElementId
}

export interface ConditionCollection {
  [conditionId: string]: ConditionData
}

export interface EffectData {
  id: ElementId
  pathId: ElementId
  set: [ElementId, SET_OPERATOR_TYPE, string]
  tags: string[]
  title: string
  updated: number
  variableId: string
}

export interface EffectCollection {
  [effectId: string]: EffectData
}

export interface FolderData {
  children: FolderChildRefs
  id: ElementId
  parent: FolderParentRef
  tags: string[]
  title: string
  updated: number
}

export interface FolderCollection {
  [folderId: string]: FolderData
}

export interface InputData {
  id: ElementId
  eventId: ElementId
  tags: string[]
  title: string
  updated: number
  variableId?: ElementId
}

export interface InputCollection {
  [choiceId: string]: InputData
}

export interface JumpData {
  editor?: {
    componentEditorPosX?: number
    componentEditorPosY?: number
  }
  id: ElementId
  path: [ElementId?, ElementId?]
  sceneId?: ElementId
  tags: string[]
  title: string
  updated: number
}

export interface JumpCollection {
  [jumpId: string]: JumpData
}

export interface PassageData {
  choices: ElementId[]
  content: string
  editor?: {
    componentEditorPosX?: number
    componentEditorPosY?: number
  }
  gameOver: boolean
  id: ElementId
  input?: ElementId // variable ID
  sceneId: ElementId
  tags: string[]
  title: string
  type: EVENT_TYPE
  updated: number
}

export interface PassageCollection {
  [eventId: string]: PassageData
}

export interface PathData {
  choiceId?: ElementId
  destinationId: ElementId
  destinationType: ELEMENT_TYPE
  id: ElementId
  inputId?: ElementId
  originId: ElementId
  originType: ELEMENT_TYPE | EVENT_TYPE
  sceneId: ElementId
  tags: string[]
  title: string
  updated: number
}

export interface PathCollection {
  [pathId: string]: PathData
}

export interface SceneData {
  children: SceneChildRefs
  editor?: {
    componentEditorTransformX?: number
    componentEditorTransformY?: number
    componentEditorTransformZoom?: number
  }
  id: ElementId
  jumps: ElementId[]
  parent: SceneParentRef
  tags: string[]
  title: string
  updated: number
}

export interface SceneCollection {
  [sceneId: string]: SceneData
}

export interface VariableData {
  id: ElementId
  initialValue: string
  tags: string[]
  title: string
  type: VARIABLE_TYPE
  updated: number
}

export interface VariableCollection {
  [variableId: string]: VariableData
}

export interface GameDataJSON {
  _: RootData
  choices: ChoiceCollection
  conditions: ConditionCollection
  effects: EffectCollection
  folders: FolderCollection
  inputs: InputCollection
  jumps: JumpCollection
  passages: PassageCollection
  paths: PathCollection
  scenes: SceneCollection
  variables: VariableCollection
}

export enum ENGINE_THEME {
  BOOK = 'BOOK',
  CONSOLE = 'CONSOLE'
}

export enum ENGINE_DEVTOOLS_EVENT_TYPE {
  OPEN_PASSAGE = 'OPEN_PASSAGE',
  RESET = 'RESET',
  TOGGLE_EXPRESSIONS = 'TOGGLE_EXPRESSIONS',
  TOGGLE_BLOCKED_CHOICES = 'TOGGLE_BLOCKED_CHOICES',
  TOGGLE_XRAY = 'TOGGLE_XRAY'
}

export enum ENGINE_DEVTOOLS_EVENTS {
  EDITOR_TO_ENGINE = 'editor:engine:devtools:event',
  ENGINE_TO_EDITOR = 'engine:editor:devtools:event'
}

export interface EngineDevToolsEvent {
  eventType: ENGINE_DEVTOOLS_EVENT_TYPE
  eventId?: ElementId
}

export interface EngineBookmarkData {
  gameId: GameId
  id: string // or AUTO_ENGINE_BOOKMARK_KEY
  title: string
  event: ElementId | undefined // event
  updated: number
  version: string
}

export interface EngineBookmarkCollection {
  [bookmarkId: ElementId | '___auto___']: EngineBookmarkData
}

export interface EngineChoiceData {
  gameId: GameId
  id: ElementId
  eventId: ElementId
  title: string
}

export interface EngineChoiceCollection {
  [choiceId: ElementId]: EngineChoiceData
}

export interface EngineConditionData {
  compare: [ElementId, COMPARE_OPERATOR_TYPE, string]
  gameId: GameId
  id: ElementId
  pathId: ElementId
  variableId: ElementId
}

export interface EngineConditionCollection {
  [conditionId: ElementId]: EngineConditionData
}

export interface EngineEffectData {
  gameId: GameId
  id: ElementId
  pathId: ElementId
  set: [ElementId, SET_OPERATOR_TYPE, string]
  variableId: ElementId
}

export interface EngineEffectCollection {
  [effectId: ElementId]: EngineEffectData
}

export interface EngineEventStateData {
  gameId: GameId
  title: string
  type: VARIABLE_TYPE
  value: string
}

export interface EngineEventStateCollection {
  [variableId: ElementId]: EngineEventStateData
}

export type EngineEventLocationData = [ElementId?, ElementId?] // scene, passage

export enum ENGINE_EVENT_TYPE {
  GAME_OVER = 'GAME_OVER',
  CHOICE = 'CHOICE',
  CHOICE_LOOPBACK = 'CHOICE_LOOPBACK',
  INITIAL = 'INITIAL',
  INPUT = 'INPUT',
  INPUT_LOOPBACK = 'INPUT_LOOPBACK',
  RESTART = 'RESTART'
}

export type EngineEventResult = {
  id?: ElementId
  value: string
}

export interface EngineEventData {
  gameId: GameId
  // TODO: may need to change to tuple with id and type
  id: ElementId // or INITIAL_ENGINE_EVENT_ORIGIN_KEY
  destination: ElementId // passage ID
  next?: ElementId // event ID
  origin?: ElementId // passage ID or INITIAL_ENGINE_EVENT_ORIGIN_KEY
  prev?: ElementId // event ID
  result?: EngineEventResult
  state: EngineEventStateCollection
  type: ENGINE_EVENT_TYPE
  updated: number
  version: string
}

export interface EngineEventCollection {
  [eventId: ElementId | '___initial___']: EngineEventData
}

export interface EngineGameMeta {
  studioId: StudioId
  gameId: GameId
}

export interface EngineGameData {
  children: GameChildRefs
  copyright?: string
  description?: string
  designer: string
  engine: string
  id: GameId
  jump: ElementId
  schema: string
  studioId: StudioId
  studioTitle: string
  tags?: []
  title: string
  updated: number
  version: string
  website?: string
}

export interface EngineGameCollection {
  [gameId: GameId]: EngineGameData
}

export interface EngineInputData {
  gameId: GameId
  id: ElementId
  eventId: ElementId
  variableId?: ElementId
}

export interface EngineInputCollection {
  [inputId: ElementId]: EngineInputData
}

export interface EngineJumpData {
  gameId: GameId
  id: ElementId
  path: [ElementId?, ElementId?]
  sceneId?: ElementId
}

export interface EngineJumpCollection {
  [jumpId: ElementId]: EngineJumpData
}

export interface EnginePassageData {
  choices: ElementId[]
  content: string
  gameId: GameId
  gameOver: boolean
  id: ElementId
  input?: ElementId
  sceneId: ElementId
  type: EVENT_TYPE
}

export interface EnginePassageCollection {
  [eventId: ElementId]: EnginePassageData
}

export interface EngineRouteData {
  choiceId?: ElementId
  destinationId: ElementId
  destinationType: ELEMENT_TYPE
  gameId: GameId
  id: ElementId
  inputId?: ElementId
  originId: ElementId
  originType: ELEMENT_TYPE | EVENT_TYPE
  sceneId: ElementId
}

export interface EngineRouteCollection {
  [pathId: string]: EngineRouteData
}

export interface EngineSceneData {
  children: SceneChildRefs
  gameId: GameId
  id: ElementId
  jumps: ElementId[]
}

export interface EngineSceneCollection {
  [sceneId: ElementId]: EngineSceneData
}

export interface EngineSettingsData {
  gameId: GameId
  id: string // or DEFAULT_ENGINE_SETTINGS_KEY
  theme: ENGINE_THEME
}

export interface EngineSettingsCollection {
  [settingsId: ElementId]: EngineSettingsData
}

export interface EngineVariableData {
  gameId: GameId
  id: ElementId
  initialValue: string
  title: string
  type: VARIABLE_TYPE
}

export interface EngineVariableCollection {
  [variableId: ElementId]: EngineVariableData
}

export interface ESGEngineCollectionData {
  _: EngineGameData
  choices: EngineChoiceCollection
  conditions: EngineConditionCollection
  effects: EngineEffectCollection
  games: EngineGameCollection
  inputs: EngineInputCollection
  jumps: EngineJumpCollection
  passages: EnginePassageCollection
  paths: EngineRouteCollection
  scenes: EngineSceneCollection
  variables: EngineVariableCollection
}
