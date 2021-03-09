import { LibraryDatabase, LIBRARY_TABLE } from '../db'
import { v4 as uuid } from 'uuid'

import { Passage, ComponentId, StudioId, GameId } from '../data/types'

export async function savePassage(
  studioId: StudioId,
  passage: Passage
): Promise<ComponentId> {
  if (!passage.id) passage.id = uuid()

  passage.updated = Date.now()

  try {
    return await new LibraryDatabase(studioId).savePassage(passage)
  } catch (error) {
    throw new Error(error)
  }
}

export async function removePassage(
  studioId: StudioId,
  passageId: ComponentId
) {
  try {
    await new LibraryDatabase(studioId).removePassage(passageId)
  } catch (error) {
    throw new Error(error)
  }
}

export async function getPassagesByGameId(
  studioId: StudioId,
  gameId: GameId
): Promise<Passage[]> {
  try {
    return await new LibraryDatabase(studioId).getPassagesByGameId(gameId)
  } catch (error) {
    throw new Error(error)
  }
}

export async function savePassageTitle(
  studioId: StudioId,
  passageId: ComponentId,
  title: string
) {
  try {
    return await new LibraryDatabase(studioId).saveComponentTitle(
      passageId,
      LIBRARY_TABLE.PASSAGES,
      title
    )
  } catch (error) {
    throw new Error(error)
  }
}
