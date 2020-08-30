import { ConnectionOptions } from "typeorm"

const connProdLiterature = {
  "name": "literature",
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "admin",
  "password": "admin",
  "database": "dev",
  "synchronize": true,
  "logging": false,
  "entities": [
    `./server/literature/entities/*.ts`
  ]
} as ConnectionOptions

const connProdGallery = {
  "name": "gallery",
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "admin",
  "password": "admin",
  "database": "dev",
  "synchronize": true,
  "logging": false,
  "entities": [
    `./server/gallery/entities/*.ts`
  ]
} as ConnectionOptions

export { connProdLiterature, connProdGallery }

