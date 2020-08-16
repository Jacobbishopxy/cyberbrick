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
    path: "/api/tt/targets",
    method: "get",
    action: targetGetAllAction
  },
  {
    path: "/api/tt/target",
    method: "get",
    action: targetGetByIdAction
  },
  {
    path: "/api/tt/target",
    method: "post",
    action: targetSaveAction
  },
  {
    path: "/api/tt/target",
    method: "delete",
    action: targetDeleteAction
  },
  {
    path: "/api/tt/tags",
    method: "get",
    action: tagGetAllAction,
  },
  {
    path: "/api/tt/tag",
    method: "get",
    action: tagGetByName,
  },
  {
    path: "/api/tt/tag",
    method: "post",
    action: tagSaveAction
  },
  {
    path: "/api/tt/tag",
    method: "delete",
    action: tagDeleteAction
  }
]

