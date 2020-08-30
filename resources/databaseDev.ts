import { ConnectionOptions } from "typeorm"

const connDevLiterature = {
  "name": "literature",
  "type": "sqlite",
  "database": "./cache/literature.sqlite",
  "synchronize": true,
  "logging": false,
  "entities": [
    `./server/literature/entities/*.ts`
  ]
} as ConnectionOptions

const connDevGallery = {
  "name": "gallery",
  "type": "sqlite",
  "database": "./cache/gallery.sqlite",
  "synchronize": true,
  "logging": false,
  "entities": [
    `./server/gallery/entities/*.ts`
  ]
} as ConnectionOptions

export { connDevLiterature, connDevGallery }

