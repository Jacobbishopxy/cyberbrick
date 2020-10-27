/**
 * Created by Jacob Xie on 10/22/2020.
 */

import { createConnection, ConnectionOptions, Connection } from "typeorm"
import _ from "lodash"

import { Storage } from "../entity"


export class DynamicConnections {

  private connections: Connection[] = []

  private genConnOption = (conn: Storage): ConnectionOptions => ({
    ...conn,
    name: conn.id
  } as ConnectionOptions)

  private findConn(id: string) {
    return _.find(this.connections, c => c.options.name === id)
  }

  private async databaseConnect(conn: Storage) {
    const co = this.genConnOption(conn)

    createConnection(co)
      .then(res => this.connections.push(res))
      .catch(err => console.log(err))
  }

  private async databaseDisconnect(id: string) {
    const conn = this.findConn(id)
    if (conn) {
      conn.close()
        .then(() => {
          this.connections = _.filter(this.connections, c => c.options.name === id)
        })
        .catch(err => console.log(err))
    }
  }

  async newConnection(conn: Storage) {
    const targetConn = this.findConn(conn.id)
    if (!targetConn) {
      return this.databaseConnect(conn)
    }
    return Promise.reject()
  }

  async removeConnection(id: string) {
    const targetConn = this.findConn(id)
    if (targetConn) {
      return this.databaseDisconnect(id)
    }
    return Promise.reject()
  }

  async updateConnection(conn: Storage) {
    const targetConn = this.findConn(conn.id)
    if (targetConn) {
      this.databaseDisconnect(conn.id)
        .then(() => {
          return this.databaseConnect(conn)
        })
        .catch(() => {
          return Promise.reject()
        })

    }
    return Promise.reject()
  }

  async loadConnection(conn: Storage) {
    const targetConn = this.findConn(conn.id)
    if (!targetConn)
      return this.newConnection(conn)
    return Promise.resolve()
  }

  showConnections = () => this.connections

}

