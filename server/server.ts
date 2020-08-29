/**
 * Created by Jacob Xie on 8/12/2020.
 */

import express from "express"
import path from "path"

import { app, connectionsAwait } from "./app"


async function start() {
  await connectionsAwait()

  if (process.env.NODE_ENV === "production") {
    app.use("/", express.static(path.join(__dirname, '../dist')))

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../dist', 'index.html'))
    })
  }

  const port = app.get("port")
  app.listen(port, () => console.log(`App listening on port ${ port }`))
}

const server = start()

export default server
