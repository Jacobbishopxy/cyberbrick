/**
 * Created by Jacob Xie on 8/19/2020.
 */

import { Request, Response } from "express"
import { getConnection } from "typeorm"

import * as common from "../common"
import * as utils from "../../utils"
import { Author } from "../entity/Author"


const authorRepo = () => getConnection(common.db).getRepository(Author)

const authorRelations = { relations: [common.articles] }

export async function getAllAuthors(req: Request, res: Response) {
  const authors = await authorRepo().find()

  res.send(authors)
}

export async function getAuthorsByNames(req: Request, res: Response) {

  if (utils.expressErrorsBreak(req, res)) return

  const ans = await authorRepo()
    .find({
      ...authorRelations,
      ...utils.whereNamesIn(req.query.names as string)
    })

  res.send(ans)
}

export async function saveAuthor(req: Request, res: Response) {
  const ar = authorRepo()
  const newAuthor = ar.create(req.body)
  await ar.save(newAuthor)

  res.send(newAuthor)
}

export async function deleteAuthor(req: Request, res: Response) {

  if (utils.expressErrorsBreak(req, res)) return

  const ans = await authorRepo().delete(req.query.name as string)

  res.send(ans)
}
