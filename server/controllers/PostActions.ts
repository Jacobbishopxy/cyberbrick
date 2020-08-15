/**
 * Created by Jacob Xie on 8/15/2020.
 */

import { Request, Response } from "express"
import { getRepository } from "typeorm"
import { Post } from "../entities/Post"

const postRelations = { relations: ["categories"] }

export async function postGetAllAction(req: Request, res: Response) {
  const postRepo = getRepository(Post)
  const posts = await postRepo.find(postRelations)

  res.send(posts)
}

export async function postGetByIdAction(req: Request, res: Response) {
  const postRepo = getRepository(Post)
  const post = await postRepo.findOne(req.params.id, postRelations)

  if (!post) {
    res.status(404)
    res.send()
    return
  }
  res.send(post)
}

export async function postSaveAction(req: Request, res: Response) {
  const postRepo = getRepository(Post)
  const newPost = postRepo.create(req.body)
  await postRepo.save(newPost)

  res.send(newPost)
}

