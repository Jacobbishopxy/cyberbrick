# MongoDB

## Mongo client

[Download Robo 3T](https://robomongo.org/download), Studio 3T is charged and unnecessary.

## Getting start

1. `docker exec -it mongodb bash`
2. `mongo -u root -p root`
3. create user:

   ```txt
   db.createUser(
     {
       user: "dev",
       pwd: "dev",
       roles: [ { role: "readWrite", db: "dev" } ]
     }
   )
   ```
