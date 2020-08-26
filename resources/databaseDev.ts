import {ConnectionOptions} from "typeorm"

export default {
  "name": "default",
  "type": "sqlite",
  "database": "./cache/database.sqlite",
  "synchronize": true,
  "logging": false,
  "entities": [
    `./server/literature/entities/*.ts`
  ]
} as ConnectionOptions
