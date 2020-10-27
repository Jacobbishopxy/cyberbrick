/**
 * Created by Jacob Xie on 8/27/2020.
 */

import express from "express"

import { galleryConnect } from "./orm"
import * as homeController from "./collection/home.controller"
import * as miscController from "./collection/misc.controller"
import * as fmController from "./collection/file.controller"

import { connDevGallery, connProdGallery } from "./resources/config"

// Create Express server
const app = express()

// Express configuration
app.set("port", process.env.PORT || 7999)
app.set("env", process.env.NODE_ENV === 'production' ? "prod" : "dev")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API routes
app.get("/api/homeLogo", homeController.getHomeLogo)
app.post("/api/login/account", homeController.loginAccount)
app.get("/api/currentUserAvatar", homeController.getCurrentUserAvatar)
app.get("/api/currentUser", homeController.getCurrentUser)

app.get("/api/misc/document/gallery", miscController.getDocumentPng("GalleryDataStructure.svg"))
app.get("/api/misc/new-rocket", miscController.getDocumentPng("NewRocket.png"))

app.post("/api/fm/extractXlsxFile", fmController.extractXlsxFile)

// API (Database) routes, wrapped in async function
async function connectionsAwaitGallery() {
  const galleryConnOptions = app.get("ene") === "prod" ?
    connProdGallery : connDevGallery

  await galleryConnect(app, galleryConnOptions)

  const connInfo = JSON.stringify(galleryConnOptions, null, 2)
  console.log(`Connected to ${ connInfo }`)
}

export { app, connectionsAwaitGallery }
