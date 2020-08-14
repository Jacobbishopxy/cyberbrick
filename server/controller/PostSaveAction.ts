/**
 * Created by Jacob Xie on 8/14/2020.
 */

import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Post } from "../entity/Post";

export async function postSaveAction(req: Request, res: Response) {

  const postRepository = getManager().getRepository(Post);

  const newPost = postRepository.create(req.body);

  await postRepository.save(newPost);

  res.send(newPost);
}

