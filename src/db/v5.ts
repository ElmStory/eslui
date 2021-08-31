// #271

import Dexie from 'dexie'

import { PASSAGE_TYPE } from '../data/types'
import { DB_NAME, LIBRARY_TABLE } from '.'

export default (database: Dexie) => {
  // UID is added to base library database name
  if (database.name.includes(DB_NAME.LIBRARY)) {
    database
      .version(5)
      .stores({
        inputs: '&id,gameId,passageId,title,*tags,updated'
      })
      .upgrade(async (tx) => {
        try {
          const passagesTable = tx.table(LIBRARY_TABLE.PASSAGES)

          await passagesTable.toCollection().modify((passage) => {
            passage.input = undefined
            passage.type = PASSAGE_TYPE.CHOICE
          })
        } catch (error) {}
      })
  }
}
