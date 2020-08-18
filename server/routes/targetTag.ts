/**
 * Created by Jacob Xie on 8/14/2020.
 */
import * as targetActions from "../controllers/TargetActions"
import * as tagActions from "../controllers/TagActions"


export const targetTagRoutes = [
  {
    path: "/api/tt/targets",
    method: "get",
    action: targetActions.targetGetAllAction
  },
  {
    path: "/api/tt/target",
    method: "get",
    action: targetActions.targetGetByIdAction
  },
  {
    path: "/api/tt/target",
    method: "post",
    action: targetActions.targetSaveAction
  },
  {
    path: "/api/tt/target",
    method: "delete",
    action: targetActions.targetDeleteAction
  },
  {
    path: "/api/tt/tags",
    method: "get",
    action: tagActions.tagGetAllAction,
  },
  {
    path: "/api/tt/tag",
    method: "get",
    action: tagActions.tagGetByName,
  },
  {
    path: "/api/tt/tag",
    method: "post",
    action: tagActions.tagSaveAction
  },
  {
    path: "/api/tt/tag",
    method: "delete",
    action: tagActions.tagDeleteAction
  },
  {
    path: "/api/tt/tags-by-names",
    method: "get",
    action: tagActions.getTargetIdsByTagNames
  }
]

