/**
 * Created by Jacob Xie on 10/26/2020.
 */

import {NestFactory} from "@nestjs/core"
import {NestExpressApplication} from "@nestjs/platform-express"
import {BadRequestException, ValidationError, ValidationPipe} from "@nestjs/common"
import {json} from "body-parser"

import {AppModule} from "./app.module"


const port = 8030

async function bootstrap(): Promise<string> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(validationErrors)
      },
    })
  )
  app.use(json({limit: "50mb"}))
  await app.listen(port)
  return `App listening on port ${port}`
}

bootstrap()
  .then(res => console.log(res))
  .catch(err => console.log(err))
