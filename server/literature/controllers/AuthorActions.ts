/**
 * Created by Jacob Xie on 8/19/2020.
 */

import { Request, Response } from "express"
import { getRepository } from "typeorm"
// import _ from "lodash"
//
// import { QueryStr, author, article } from "../common"
import { Author } from "../entities/Author"


const repo = () => getRepository(Author)

export async function getAllAuthors(req: Request, res: Response) {
  const authors = await repo().find()

  res.send(authors)
}

// export async function getArticleIdsByAuthorNames(req: Request, res: Response) {
//   const names = req.query.names as QueryStr
//   if (names === undefined) {
//     res.status(400)
//     res.send("names is required, `?names=N1,N2,N3`")
//     return
//   }
//
//   const namesArr = names.split(",")
//   const cats = await repo()
//     .createQueryBuilder()
//     .leftJoinAndSelect(`${article}.${author}`, author)
//     .select([`${author}.name`, `${article}.id`])
//     .where(`${article}.${author} IN (:...names)`, {names: namesArr})
//     .orderBy({
//       "article.date": "DESC",
//       "author.name": "ASC"
//     })
//     .getMany()
//
//   const idsArr = cats.map(i => i.articles.map(j => j.id))
//   const ans = _.reduce(idsArr, (acc, arr) => _.union(acc, arr))
//
//   res.send(ans)
//
// }
