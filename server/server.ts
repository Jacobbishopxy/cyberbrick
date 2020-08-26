/**
 * Created by Jacob Xie on 8/12/2020.
 */

import express from "express"
import path from "path"
import { ConnectionOptions } from "typeorm"

import { postCategoryConnect } from "./orm"
import conDev from "../resources/databaseDev.json"
import conProd from "../resources/databaseProd.json"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ---------------------------------------------------------------------------------------------------------------------

app.post('/api/login/account', (req, res) => {
  // const { password, userName, type } = req.body
  const { type } = req.body

  res.send({
    status: 'ok',
    type,
    currentAuthority: 'admin',
  })
})

app.get('/api/currentUserAvatar', (req, res) => {
  res.sendFile(path.join(__dirname, '/assets', 'favicon.ico'))
})

app.get('/api/currentUser', (req, res) => {
  res.send({
    name: 'Jacob Xie',
    avatar: '/api/currentUserAvatar',
    userid: '00000001',
    email: 'xieyu@infore.com',
    signature: 'Who drives me forward like fate? The myself striding on my back.',
    title: 'data scientist, full-stack engineer',
    group: 'equity investment',
    access: 'admin'
  })
})

// ---------------------------------------------------------------------------------------------------------------------

let connectionOptions: ConnectionOptions
const connectionOptionsEntity = {
  "entities": [
    `${ __dirname }/literature/entities/*.ts`
  ]
}

if (process.env.NODE_ENV === 'production') {

  connectionOptions = {
    ...conDev,
    ...connectionOptionsEntity
  }


  app.use('/', express.static('dist'))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  })
} else {
  connectionOptions = {
    ...conProd,
    ...connectionOptionsEntity
  }
}

postCategoryConnect(app, connectionOptions).then(res => console.log(res))

const port = 7999
app.listen(port, () => console.log(`App listening on port ${ port }`))
