/**
 * Created by Jacob Xie on 8/14/2020.
 */

import { postGetAllAction } from "./controller/PostGetAllAction";
import { postGetByIdAction } from "./controller/PostGetByIdAction";
import { postSaveAction } from "./controller/PostSaveAction";

export const PostRoutes = [
  {
    path: "/posts",
    method: "get",
    action: postGetAllAction
  },
  {
    path: "/posts/:id",
    method: "get",
    action: postGetByIdAction
  },
  {
    path: "/posts",
    method: "post",
    action: postSaveAction
  }
];
