/**
 * Created by Jacob Xie on 8/14/2020.
 */
import * as articleActions from "./controllers/ArticleActions"
import * as categoryActions from "./controllers/CategoryActions"
// import * as authorActions from "../controllers/AuthorActions"
import * as tagActions from "./controllers/TagActions"

const base = "/api/literature"


export const literature = [
  {
    path: `${base}/targets`,
    method: "get",
    action: articleActions.targetGetAllAction
  },
  {
    path: `${base}/target`,
    method: "get",
    action: articleActions.targetGetByIdAction
  },
  {
    path: `${base}/target`,
    method: "post",
    action: articleActions.targetSaveAction
  },
  {
    path: `${base}/target`,
    method: "delete",
    action: articleActions.targetDeleteAction
  },
  {
    path: `${base}/tags`,
    method: "get",
    action: tagActions.tagGetAllAction,
  },
  {
    path: `${base}/tag`,
    method: "get",
    action: tagActions.tagGetByName,
  },
  {
    path: `${base}/tag`,
    method: "post",
    action: tagActions.tagSaveAction
  },
  {
    path: `${base}/tag`,
    method: "delete",
    action: tagActions.tagDeleteAction
  },
  {
    path: `${base}/getTargetIdsByTagNames`,
    method: "get",
    action: tagActions.getTargetIdsByTagNames
  },
  {
    path: `${base}/getTargetsByIds`,
    method: "get",
    action: articleActions.getTargetsByIds
  },

  {
    path: `${base}/getAllCategories`,
    method: "get",
    action: categoryActions.getAllCategories
  },
  {
    path: `${base}/getCategoriesByNames`,
    method: "get",
    action: categoryActions.getCategoriesByNames
  },
  {
    path: `${base}/saveCategory`,
    method: "post",
    action: categoryActions.saveCategory
  },
  {
    path: `${base}/deleteCategory`,
    method: "delete",
    action: categoryActions.deleteCategory
  },

]
