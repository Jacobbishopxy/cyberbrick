/**
 * Created by Jacob Xie on 10/22/2020.
 */


import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from "typeorm"
import { Injectable } from "@nestjs/common"
import { InjectConnection } from "@nestjs/typeorm"

import { Storage } from "../entity"
import { DynamicConnections } from "./DynamicConnections"
import { db } from "../common"

@Injectable()
@EventSubscriber()
export class StorageSubscriber implements EntitySubscriberInterface<Storage> {

  dynamicConnections: DynamicConnections

  constructor(@InjectConnection(db) readonly connection: Connection) {
    connection.subscribers.push(this)
    this.dynamicConnections = new DynamicConnections()

    // initialize connections stored in Storage
    connection.getRepository(Storage).find().then(res => {
      res.forEach(con => this.dynamicConnections.loadConnection(con).finally())
    })
  }

  listenTo = () => Storage

  afterInsert = (event: InsertEvent<Storage>) =>
    this.dynamicConnections.newConnection(event.entity).finally()

  afterUpdate = (event: UpdateEvent<Storage>) =>
    this.dynamicConnections.updateConnection(event.entity as Storage).finally()

  afterRemove = (event: RemoveEvent<Storage>) =>
    this.dynamicConnections.removeConnection(event.entityId).finally()

}

