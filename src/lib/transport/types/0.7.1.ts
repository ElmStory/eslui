export enum ELEMENT_TYPE {
  CHARACTER = 'CHARACTER',
  CHOICE = 'CHOICE',
  CONDITION = 'CONDITION',
  EFFECT = 'EFFECT',
  EVENT = 'EVENT',
  FOLDER = 'FOLDER',
  INPUT = 'INPUT',
  JUMP = 'JUMP',
  PATH = 'PATH',
  SCENE = 'SCENE',
  STUDIO = 'STUDIO',
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
  INPUT = 'INPUT',
  JUMP = 'JUMP'
}

export enum VARIABLE_TYPE {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  IMAGE = 'IMAGE',
  URL = 'URL'
}

export type StudioId = string
export type WorldId = string
export type ElementId = string

export type WorldChildRefs = Array<
  [ELEMENT_TYPE.FOLDER | ELEMENT_TYPE.SCENE, ElementId]
>

export type FolderParentRef = [
  ELEMENT_TYPE.WORLD | ELEMENT_TYPE.FOLDER,
  ElementId | null
]

export type FolderChildRefs = Array<
  [ELEMENT_TYPE.FOLDER | ELEMENT_TYPE.SCENE, ElementId]
>

export type SceneParentRef = [
  ELEMENT_TYPE.WORLD | ELEMENT_TYPE.FOLDER,
  ElementId | null
]

export type SceneChildRefs = Array<
  [ELEMENT_TYPE.EVENT | ELEMENT_TYPE.JUMP, ElementId]
>

export interface RootData {
  children: WorldChildRefs
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

export enum CHARACTER_MASK_TYPE {
  // max(d,e)
  EXCITED = 'EXCITED', // [+1.00, +1.00]
  TENSE = 'TENSE', // [-1.00, +1.00]
  LIVELY = 'LIVELY', // [+0.75, +0.75]
  NERVOUS = 'NERVOUS', // [-0.75, +0.75]
  CHEERFUL = 'CHEERFUL', // [+0.50, +0.50]
  IRRITATED = 'IRRITATED', // [-0.50, +0.50]
  HAPPY = 'HAPPY', // [+0.25, +0.25]
  ANNOYED = 'ANNOYED', // [-0.25, +0.25]

  NEUTRAL = 'NEUTRAL', // [ 0.00,  0.00]

  RELAXED = 'RELAXED', // [+0.25, -0.25]
  BORED = 'BORED', // [-0.25, -0.25]
  CAREFREE = 'CAREFREE', // [+0.50, -0.50]
  WEARY = 'WEARY', // [-0.50, -0.50]
  CALM = 'CALM', // [+0.75, -0.75]
  GLOOMY = 'GLOOMY', // [-0.75, -0.75]
  SERENE = 'SERENE', // [+1.00, -1.00]
  SAD = 'SAD' // [-1.00, -1.00]
  // min(d,e)
}

export enum CHARACTER_PRONOUN_TYPES {
  SHE = 'SHE',
  HER = 'HER',
  HERS = 'HERS',
  HERSELF = 'HERSELF',
  HE = 'HE',
  HIM = 'HIM',
  HIS = 'HIS',
  HIMSELF = 'HIMSELF',
  THEY = 'THEY',
  THEM = 'THEM',
  THEIRS = 'THEIRS',
  THEMSELF = 'THEMSELF',
  ZE = 'ZE',
  HIR = 'HIR',
  ZIR = 'ZIR',
  HIRS = 'HIRS',
  ZIRS = 'ZIRS',
  HIRSELF = 'HIRSELF',
  ZIRSELF = 'ZIRSELF'
}

export interface CharacterMask {
  active: boolean
  assetId?: string // the location will change, but keep asset ID consistent
  type: CHARACTER_MASK_TYPE
}

// tuple: [uuid, ...]
export type CharacterRef = [string, string | CHARACTER_PRONOUN_TYPES]

export type CharacterRefs = Array<CharacterRef>

export interface CharacterData {
  description?: string
  id: ElementId
  masks: CharacterMask[]
  refs: CharacterRefs
  tags: string[]
  title: string
  updated: number
}

export interface CharacterCollection {
  [characterId: string]: CharacterData
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
  compare: [ElementId, COMPARE_OPERATOR_TYPE, string, VARIABLE_TYPE]
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
  set: [ElementId, SET_OPERATOR_TYPE, string, VARIABLE_TYPE]
  tags: string[]
  title: string
  updated: number
  variableId: string
}

export interface EffectCollection {
  [effectId: string]: EffectData
}

export type EventCharacterPersona = [
  ElementId,
  CHARACTER_MASK_TYPE,
  string | undefined
] // [characterId, mask, reference ID]

export interface EventData {
  audio?: AudioProfile
  characters: ElementId[]
  choices: ElementId[]
  content: string
  composer?: {
    sceneMapPosX?: number
    sceneMapPosY?: number
  }
  ending: boolean
  id: ElementId
  images: string[] // asset id
  input?: ElementId // variable ID
  persona?: EventCharacterPersona
  sceneId: ElementId
  tags: string[]
  title: string
  type: EVENT_TYPE
  updated: number
}

export interface EventCollection {
  [eventId: string]: EventData
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
  eventId: ElementId
  id: ElementId
  tags: string[]
  title: string
  updated: number
  variableId?: ElementId
}

export interface InputCollection {
  [choiceId: string]: InputData
}

export interface JumpData {
  composer?: {
    sceneMapPosX?: number
    sceneMapPosY?: number
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

export enum PATH_CONDITIONS_TYPE {
  ALL = 'ALL',
  ANY = 'ANY'
}

export interface PathData {
  choiceId?: ElementId
  conditionsType: PATH_CONDITIONS_TYPE
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

export type AudioProfile = [string, boolean] // asset_id, looping

export interface SceneData {
  audio?: AudioProfile
  children: SceneChildRefs
  composer?: {
    sceneMapTransformX?: number
    sceneMapTransformY?: number
    sceneMapTransformZoom?: number
  }
  id: ElementId
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

// TODO: following duped from Storyteller

export interface WorldDataJSON {
  _: RootData
  characters: CharacterCollection
  choices: ChoiceCollection
  conditions: ConditionCollection
  effects: EffectCollection
  events: EventCollection
  folders: FolderCollection
  inputs: InputCollection
  jumps: JumpCollection
  paths: PathCollection
  scenes: SceneCollection
  variables: VariableCollection
}

export enum ENGINE_THEME {
  BOOK = 'BOOK',
  CONSOLE = 'CONSOLE'
}

export enum ENGINE_FONT {
  SANS = 'SANS',
  SERIF = 'SERIF'
}

export enum ENGINE_SIZE {
  DEFAULT = 'DEFAULT',
  LARGE = 'LARGE'
}

export enum ENGINE_MOTION {
  FULL = 'FULL',
  REDUCED = 'REDUCED'
}

export enum ENGINE_DEVTOOLS_LIVE_EVENT_TYPE {
  OPEN_EVENT = 'OPEN_EVENT',
  OPEN_SCENE = 'OPEN_SCENE',
  RESET = 'RESET',
  TOGGLE_CHARACTERS = 'TOGGLE_CHARACTERS',
  TOGGLE_EXPRESSIONS = 'TOGGLE_EXPRESSIONS',
  TOGGLE_BLOCKED_CHOICES = 'TOGGLE_BLOCKED_CHOICES',
  TOGGLE_XRAY = 'TOGGLE_XRAY',
  TOGGLE_MUTED = 'TOGGLE_MUTED',
  MUTE = 'MUTE',
  GET_ASSET_URL = 'GET_ASSET_URL',
  RETURN_ASSET_URL = 'RETURN_ASSET_URL',
  GET_EVENT_DATA = 'GET_EVENT_DATA',
  RETURN_EVENT_DATA = 'RETURN_EVENT_DATA'
}

export enum ENGINE_DEVTOOLS_LIVE_EVENTS {
  COMPOSER_TO_ENGINE = 'composer:engine:devtools:event',
  ENGINE_TO_COMPOSER = 'engine:composer:devtools:event'
}

export interface EngineDevToolsLiveEvent {
  eventType: ENGINE_DEVTOOLS_LIVE_EVENT_TYPE
  eventId?: ElementId
  scene?: {
    id?: ElementId
    title?: string
  }
  event?: {
    title?: string
    sceneId?: ElementId
    sceneTitle?: string
  }
  muteFrom?: 'DEVTOOLS' | 'AUDIO_PROFILE'
  asset?: {
    id?: string
    for?: 'SCENE' | 'EVENT'
    url?: string
    exists?: boolean
    ext?: 'jpeg' | 'webp' | 'mp3'
  }
}

export interface EngineBookmarkData {
  id: string // or AUTO_ENGINE_BOOKMARK_KEY
  title: string
  liveEventId: ElementId | undefined
  updated: number
  version: string
  worldId: WorldId
}

export interface EngineBookmarkCollection {
  [bookmarkId: ElementId | '___auto___']: EngineBookmarkData
}

export interface EngineCharacterData {
  id: ElementId
  masks: CharacterMask[]
  refs: CharacterRefs
  title: string
  worldId: WorldId
}

export interface EngineCharacterCollection {
  [characterId: ElementId]: EngineCharacterData
}

export interface EngineChoiceData {
  id: ElementId
  eventId: ElementId
  title: string
  worldId: WorldId
}

export interface EngineChoiceCollection {
  [choiceId: ElementId]: EngineChoiceData
}

export interface EngineConditionData {
  compare: [ElementId, COMPARE_OPERATOR_TYPE, string, VARIABLE_TYPE]
  id: ElementId
  pathId: ElementId
  variableId: ElementId
  worldId: WorldId
}

export interface EngineConditionCollection {
  [conditionId: ElementId]: EngineConditionData
}

export interface EngineEffectData {
  id: ElementId
  pathId: ElementId
  set: [ElementId, SET_OPERATOR_TYPE, string, VARIABLE_TYPE]
  variableId: ElementId
  worldId: WorldId
}

export interface EngineEffectCollection {
  [effectId: ElementId]: EngineEffectData
}

export interface EngineEventData {
  choices: ElementId[]
  content: string
  ending: boolean
  id: ElementId
  input?: ElementId
  persona?: EventCharacterPersona
  sceneId: ElementId
  type: EVENT_TYPE
  worldId: WorldId
}

export interface EngineEventCollection {
  [eventId: ElementId]: EngineEventData
}

export interface EngineLiveEventStateData {
  title: string
  type: VARIABLE_TYPE
  value: string
  worldId: WorldId
}

export interface EngineLiveEventStateCollection {
  [variableId: ElementId]: EngineLiveEventStateData
}

export type EngineLiveEventLocationData = [ElementId?, ElementId?] // scene, passage

export enum ENGINE_LIVE_EVENT_TYPE {
  GAME_OVER = 'GAME_OVER',
  CHOICE = 'CHOICE',
  CHOICE_LOOPBACK = 'CHOICE_LOOPBACK',
  INITIAL = 'INITIAL',
  INPUT = 'INPUT',
  INPUT_LOOPBACK = 'INPUT_LOOPBACK',
  RESTART = 'RESTART'
}

export type EngineLiveEventResult = {
  id?: ElementId
  value: string
}

export interface EngineLiveEventData {
  // TODO: may need to change to tuple with id and type
  id: ElementId // or INITIAL_ENGINE_EVENT_ORIGIN_KEY
  destination: ElementId // passage ID
  next?: ElementId // event ID
  origin?: ElementId // passage ID or INITIAL_ENGINE_EVENT_ORIGIN_KEY
  prev?: ElementId // event ID
  result?: EngineLiveEventResult
  state: EngineLiveEventStateCollection
  type: ENGINE_LIVE_EVENT_TYPE
  updated: number
  version: string
  worldId: WorldId
}

export interface EngineLiveEventCollection {
  [liveEventId: ElementId | '___initial___']: EngineLiveEventData
}

export interface EngineInputData {
  id: ElementId
  eventId: ElementId
  variableId?: ElementId
  worldId: WorldId
}

export interface EngineInputCollection {
  [inputId: ElementId]: EngineInputData
}

export interface EngineJumpData {
  id: ElementId
  path: [ElementId?, ElementId?]
  sceneId?: ElementId
  worldId: WorldId
}

export interface EngineJumpCollection {
  [jumpId: ElementId]: EngineJumpData
}

export interface EnginePathData {
  choiceId?: ElementId
  destinationId: ElementId
  destinationType: ELEMENT_TYPE
  id: ElementId
  inputId?: ElementId
  originId: ElementId
  originType: ELEMENT_TYPE | EVENT_TYPE
  sceneId: ElementId
  worldId: WorldId
}

export interface EnginePathCollection {
  [pathId: string]: EnginePathData
}

export interface EngineSceneData {
  children: SceneChildRefs
  id: ElementId
  worldId: WorldId
}

export interface EngineSceneCollection {
  [sceneId: ElementId]: EngineSceneData
}

export interface EngineSettingsData {
  id: string // or DEFAULT_ENGINE_SETTINGS_KEY
  theme: ENGINE_THEME
  font: ENGINE_FONT
  size: ENGINE_SIZE
  motion: ENGINE_MOTION
  muted: boolean
  worldId: WorldId
}

export interface EngineSettingsCollection {
  [settingsId: ElementId]: EngineSettingsData
}

export interface EngineVariableData {
  id: ElementId
  initialValue: string
  title: string
  type: VARIABLE_TYPE
  worldId: WorldId
}

export interface EngineVariableCollection {
  [variableId: ElementId]: EngineVariableData
}

export interface EngineWorldMeta {
  studioId: StudioId
  worldId: WorldId
}

export interface EngineWorldData {
  children: WorldChildRefs
  copyright?: string
  description?: string
  designer: string
  engine: string
  id: WorldId
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

export interface EngineWorldCollection {
  [worldId: WorldId]: EngineWorldData
}

export interface ESGEngineCollectionData {
  _: EngineWorldData
  characters: EngineCharacterCollection
  choices: EngineChoiceCollection
  conditions: EngineConditionCollection
  effects: EngineEffectCollection
  events: EngineEventCollection
  inputs: EngineInputCollection
  jumps: EngineJumpCollection
  paths: EnginePathCollection
  scenes: EngineSceneCollection
  variables: EngineVariableCollection
  worlds: EngineWorldCollection
}
