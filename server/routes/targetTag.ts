/**
 * Created by Jacob Xie on 8/14/2020.
 */
import {
  targetGetAllAction,
  targetGetByIdAction,
  targetSaveAction,
  targetDeleteAction
} from "../controllers/TargetActions"
import {
  tagGetAllAction,
  tagGetByName,
  tagSaveAction,
  tagDeleteAction
} from "../controllers/TagActions"


export const targetTagRoutes = [
  {
    path: "/targets",
    method: "get",
    action: targetGetAllAction
  },
  {
    path: "/target",
    method: "get",
    action: targetGetByIdAction
  },
  {
    path: "/target",
    method: "post",
    action: targetSaveAction
  },
  {
    path: "/target",
    method: "delete",
    action: targetDeleteAction
  },
  {
    path: "/tags",
    method: "get",
    action: tagGetAllAction,
  },
  {
    path: "/tag",
    method: "get",
    action: tagGetByName,
  },
  {
    path: "/tag",
    method: "post",
    action: tagSaveAction
  },
  {
    path: "/tag",
    method: "delete",
    action: tagDeleteAction
  }
]

