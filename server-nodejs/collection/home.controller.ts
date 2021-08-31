/**
 * Created by Jacob Xie on 8/27/2020.
 */
import {Controller, Get, Res} from '@nestjs/common'
import {Response} from "express"

import {CollectionService} from "./collection.service"


@Controller()
export class HomeController {
  constructor(private readonly service: CollectionService) {}

  @Get("homeLogo")
  async getHomeLogo(@Res() res: Response) {
    return res.sendFile(this.service.getUnicorn("048-origami.svg"))
  }

  @Get("currentUserAvatar")
  async getCurrentUserAvatar(@Res() res: Response) {
    return res.sendFile(this.service.getFavicon())
  }

  // @Get("currentUser")
  // async currentUser() {
  //   return {
  //     name: 'Jacob Xie',
  //     avatar: '/api/misc/random-unicorn',
  //     userid: '00000001',
  //     email: 'jacobbishopxy@gmail.com',
  //     signature: 'Who drives me forward like fate? The myself striding on my back.',
  //     title: 'data scientist, full-stack engineer',
  //     group: 'equity investment',
  //     access: 'admin'
  //   }
  // }

  // @Get("login/account")
  // async loginAccount(@Body("type") type: string) {
  //   return {
  //     status: 'ok',
  //     type,
  //     currentAuthority: 'admin',
  //   }
  // }
}
