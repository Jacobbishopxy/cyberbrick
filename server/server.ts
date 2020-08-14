/**
 * Created by Jacob Xie on 8/12/2020.
 */

import "reflect-metadata";
import express, { Request, Response } from "express";
import path from "path";
import bodyParser from "body-parser";
import { createConnection, ConnectionOptions } from "typeorm";
import { PostRoutes } from "./routes";


const connectionOptions: ConnectionOptions = {
  "type": "sqlite",
  "database": `./cache/database.sqlite`,
  "synchronize": true,
  "logging": false,
  "entities": [
    `${ __dirname }/entity/*.ts`
  ],
}

const connect = (app: express.Express) =>
  createConnection(connectionOptions)
    .then(async conn =>
      PostRoutes
        .forEach(route =>
          app[route.method](route.path, (req: Request, res: Response, next: Function) =>
            route.action(req, res)
              .then(() => next)
              .catch(err => next(err))
          )
        )
    )


// ---------------------------------------------------------------------------------------------------------------------

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())

// ---------------------------------------------------------------------------------------------------------------------

app.post('/api/login/account', (req, res) => {
  // const {password, userName, type} = req.body;
  const { type } = req.body;

  res.send({
    status: 'ok',
    type,
    currentAuthority: 'admin',
  });
});

app.get('/api/currentUserAvatar', (req, res) => {
  res.sendFile(path.join(__dirname, '/assets', 'favicon.ico'))
});

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
});

// ---------------------------------------------------------------------------------------------------------------------

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static('dist'));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

connect(app)

const port = 7999;
app.listen(port, () => console.log(`App listening on port ${ port }`));
