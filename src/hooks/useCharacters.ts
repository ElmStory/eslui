import { LibraryDatabase } from '../db'
import { useLiveQuery } from 'dexie-react-hooks'

import { WorldId, StudioId, Character, ElementId, Event } from '../data/types'

const useCharacters = (
  studioId: StudioId,
  worldId: WorldId,
  deps?: any[]
): Character[] | undefined => {
  const characters = useLiveQuery(
    () => new LibraryDatabase(studioId).characters.where({ worldId }).toArray(),
    deps || [],
    undefined
  )

  if (characters) characters.sort((a, b) => (a.title > b.title ? 1 : -1))

  return characters
}

const useCharacter = (
  studioId: StudioId,
  characterId: ElementId | undefined | null,
  deps?: any[]
): Character | undefined =>
  useLiveQuery(
    () => new LibraryDatabase(studioId).characters.get(characterId || ''),
    deps || [],
    undefined
  )

const useCharacterEvents = (
  studioId: StudioId,
  characterId: ElementId | undefined | null,
  deps?: any[]
): Event[] | undefined =>
  useLiveQuery(
    () =>
      new LibraryDatabase(studioId).events
        .where('persona')
        .equals(characterId || '')
        .toArray(),
    deps || [],
    undefined
  )

export { useCharacter, useCharacterEvents }

export default useCharacters