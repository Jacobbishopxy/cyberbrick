/**
 * Created by Jacob Xie on 10/22/2020.
 */

import {Connection, ConnectionOptions, createConnection, getConnection} from "typeorm"
import _ from "lodash"

import {Storage} from "../entity"


export class DynamicConnections {

  private connections: Connection[] = []

  private genConnOption = (conn: Storage): ConnectionOptions => ({
    ...conn,
    name: conn.id
  } as ConnectionOptions)

  private findConn(id: string) {
    return _.find(this.connections, c => c.options.name === id)
  }

  private async databaseConnect(conn: Storage): Promise<boolean> {
    const res = await createConnection(this.genConnOption(conn))
    if (res.isConnected) {
      this.connections.push(res)
      return true
    } else {
      return false
    }
  }

  private async databaseDisconnect(id: string): Promise<boolean> {
    const conn = this.findConn(id)
    if (conn) {
      await conn.close()
      const isConnect = await getConnection(id)
      if (isConnect) {
        this.connections = _.filter(this.connections, c => c.options.name !== id)
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  async newConnection(conn: Storage): Promise<boolean> {
    const targetConn = this.findConn(conn.id)
    if (!targetConn)
      return this.databaseConnect(conn)
    else
      return false
  }

  async removeConnection(id: string): Promise<boolean> {
    const targetConn = this.findConn(id)
    if (targetConn)
      return this.databaseDisconnect(id)
    else
      return false
  }

  async updateConnection(conn: Storage): Promise<boolean> {
    const resRmv = await this.removeConnection(conn.id)
    if (resRmv)
      return this.newConnection(conn)
    else
      return false
  }

  async loadConnection(conn: Storage): Promise<boolean> {
    const targetConn = this.findConn(conn.id)
    if (!targetConn)
      return this.newConnection(conn)
    else
      return false
  }

  showConnections = () => this.connections

}

