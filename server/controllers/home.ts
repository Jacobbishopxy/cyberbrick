/**
 * Created by Jacob Xie on 8/27/2020.
 */

import { Request, Response } from "express"
import path from "path"


export const getHomeLogo = (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../assets', 'favicon.ico'))
}

export const loginAccount = (req: Request, res: Response) => {
  // const { password, userName, type } = req.body
  const { type } = req.body

  res.send({
    status: 'ok',
    type,
    currentAuthority: 'admin',
  })
}

export const getCurrentUserAvatar = (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../assets', 'favicon.ico'))
}

export const getCurrentUser = (req: Request, res: Response) => {
  res.send({
    name: 'Jacob Xie',
    avatar: '/api/currentUserAvatar',
    userid: '00000001',
    email: 'jacobbishopxy@gmail.com',
    signature: 'Who drives me forward like fate? The myself striding on my back.',
    title: 'data scientist, full-stack engineer',
    group: 'equity investment',
    access: 'admin'
  })
}

