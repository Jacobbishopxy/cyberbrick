/**
 * Created by Jacob Xie on 12/17/2019.
 */

import express from "express";
import path from "path";
// import fetch from 'node-fetch';
// import config from '../resources/config.json';
// import { JSONType } from './data';


// const { backendUrl } = config;

// const commonPostParam = (data: JSONType) => ({
//   method: 'post',
//   body: JSON.stringify(data),
//   headers: { 'Content-Type': 'application/json' }
// })
//
// const fetchGet = (url: string) =>
//   fetch(url).then(res => res.text());
//
// const fetchPost = (url: string, jsonData: JSONType) =>
//   fetch(url, commonPostParam(jsonData)).then(res => res.text());


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

const port = 7999;
app.listen(port, () => console.log(`App listening on port ${ port }`));
