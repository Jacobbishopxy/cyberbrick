/**
 * Created by Jacob Xie on 8/14/2020.
 */
import {
  postGetAllAction,
  postGetByIdAction,
  postSaveAction
} from "../controllers/PostActions"
import {
  categoryGetAllAction,
  categoryGetByName,
  categorySaveAction,
  categoryDeleteAction
} from "../controllers/CategoryActions"


export const postCategoryRoutes = [
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
  },
  {
    path: "/categories",
    method: "get",
    action: categoryGetAllAction,
  },
  {
    path: "/categories/:name",
    method: "get",
    action: categoryGetByName,
  },
  {
    path: "/categories",
    method: "post",
    action: categorySaveAction
  },
  {
    path: "/category-delete/:name",
    method: "get",
    action: categoryDeleteAction
  }
]

