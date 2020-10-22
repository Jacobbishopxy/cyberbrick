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
import { DynamicConnections } from "./DynamicConnections"


// todo: inject service by `@nestjs/typeorm`
@EventSubscriber()
export class StorageSubscriber implements EntitySubscriberInterface<Storage> {

  dynamicConnections: DynamicConnections

  constructor() {
    this.dynamicConnections = new DynamicConnections()
  }

  listenTo = () => Storage

  afterInsert = (event: InsertEvent<Storage>) =>
    this.dynamicConnections.newConnection(event.entity).finally()

  afterUpdate = (event: UpdateEvent<Storage>) =>
    this.dynamicConnections.updateConnection(event.entity).finally()

  afterRemove = (event: RemoveEvent<Storage>) =>
    this.dynamicConnections.removeConnection(event.entityId).finally()

  afterLoad = (entity: Storage) =>
    this.dynamicConnections.loadConnection(entity).finally()

}

