/**
 * Created by Jacob Xie on 8/27/2020.
 */

import express from "express"
import path from "path"
import { ConnectionOptions } from "typeorm"

import { postCategoryConnect } from "./orm"
import * as homeController from "./controllers/home"
import conProd from "../resources/databaseProd"
import conDev from "../resources/databaseDev"

// Create Express server
const app = express()

// Express configuration
app.set("port", process.env.PORT || 7999)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API routes
app.get("/api/homeLogo", homeController.getHomeLogo)
app.post("/api/login/account", homeController.loginAccount)
app.get("/api/currentUserAvatar", homeController.getCurrentUserAvatar)
app.get("/api/currentUser", homeController.getCurrentUser)

// API (Database) routes
let connectionOptions: ConnectionOptions

if (process.env.NODE_ENV === 'production') {
  connectionOptions = conProd

  app.use('/', express.static('dist'))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  })
} else {
  connectionOptions = conDev
}

postCategoryConnect(app, connectionOptions)
  .then(() => console.log(`Connected to ${ JSON.stringify(connectionOptions, null, 2) }`))

export default app
