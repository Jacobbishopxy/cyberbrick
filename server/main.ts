/**
 * Created by Jacob Xie on 10/26/2020.
 */

import { NestFactory } from "@nestjs/core"
import { NestExpressApplication } from "@nestjs/platform-express"
import { AppModule } from "./app.module"

const port = 7999

async function bootstrap(): Promise<string> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.setGlobalPrefix("api")
  await app.listen(port)
  return `App listening on port ${ port }`
}

bootstrap()
  .then(res => console.log(res))
  .catch(err => console.log(err))
