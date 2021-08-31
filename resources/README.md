# Resources

**CAUTION!!!**

1. Please make sure all the template env file (xxx.template.env) has been copied as regular env file (xxx.env).

1. In `ua.auth.env`, Make sure `DATABASE_URL` is your database connection string. If the database is also running in docker and shares the same network with auth-server container, rename the hostname to the database's container name. Make sure `INVITATION_PAGE` is the link of cyberbrick frontend link (hostname is localhost in dev mode and the IP-address of server in production mode).

1. `lura.json` needs manually replace "localhost" with the real IP address.
