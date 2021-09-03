# Resources

All files under this folder are used for normal configuration such as database connection info, or docker configuration such as version number, volume and etc.

- config.json

- docker.server.env

- docker.web.env

- go.env

- lura.env

- mongo.connection.env

- ua.auth.env

- ua.gateway.env

**CAUTION!!!**

1. Please make sure all the template env file (xxx.template.env) has been copied as regular env file (xxx.env).

1. In `ua.auth.env`, make sure `DATABASE_URL` is your database connection string. If the database is also running in docker and shares the same network with auth-server container, rename the hostname to the database's container name. Make sure `INVITATION_PAGE` is the link of cyberbrick frontend link (hostname is localhost in dev mode and the IP-address of server in production mode).
