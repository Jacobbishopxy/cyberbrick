/**
 * Created by Jacob Xie on 8/14/2020.
 */

import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Post } from "../entity/Post";

export async function postGetByIdAction(req: Request, res: Response) {

  const postRepository = getManager().getRepository(Post);

  const post = await postRepository.findOne(req.params.id);

  if (!post) {
    res.status(404)
    res.send()
    return;
  }

  res.send(post)
}

