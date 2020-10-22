/**
 * Created by Jacob Xie on 10/22/2020.
 */


import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from "typeorm"

import { Storage } from "../entity/Storage"

@EventSubscriber()
export class StorageSubscriber implements EntitySubscriberInterface<Storage> {

  listenTo() {
    return Storage
  }

  beforeInsert(event: InsertEvent<Storage>) {
    console.log(`BEFORE ENTITY INSERTED: `, event.entity)
  }

  beforeUpdate(event: UpdateEvent<Storage>) {
    console.log(`BEFORE ENTITY UPDATED: `, event.entity)
  }

  beforeRemove(event: RemoveEvent<Storage>) {
    console.log(`BEFORE ENTITY WITH ID ${event.entityId} REMOVED: `, event.entity)
  }

  afterInsert(event: InsertEvent<Storage>) {
    console.log(`AFTER ENTITY INSERTED: `, event.entity)
  }

  afterUpdate(event: UpdateEvent<Storage>) {
    console.log(`AFTER ENTITY UPDATED: `, event.entity)
  }

  afterRemove(event: RemoveEvent<Storage>) {
    console.log(`AFTER ENTITY WITH ID ${event.entityId} REMOVED: `, event.entity)
  }

  afterLoad(entity: Storage) {
    console.log(`AFTER ENTITY LOADED: `, entity)
  }
}
