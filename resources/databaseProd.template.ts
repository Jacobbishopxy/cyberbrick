import {ConnectionOptions} from "typeorm"

export default {
  "name": "default",
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
