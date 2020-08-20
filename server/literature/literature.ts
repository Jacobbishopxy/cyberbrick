/**
 * Created by Jacob Xie on 8/14/2020.
 */
import * as articleActions from "./controllers/ArticleActions"
import * as categoryActions from "./controllers/CategoryActions"
// import * as authorActions from "../controllers/AuthorActions"
import * as tagActions from "./controllers/TagActions"

const base = "/api/literature"


const categoryRoutes = [
  {
    path: `${base}/categories`,
    method: "get",
    action: categoryActions.getAllCategories
  },
  {
    path: `${base}/getArticleIdsByCategoryName`,
    method: "get",
    action: categoryActions.getArticleIdsByCategoryName
  },
  {
    path: `${base}/getArticleTagsByCategoryName`,
    method: "get",
    action: categoryActions.getArticleTagsByCategoryName
  },
  {
    path: `${base}/getArticlesByCategoryName`,
    method: "get",
    action: categoryActions.getArticlesByCategoryName
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

export const literature = [
  {
    path: `${base}/articles`,
    method: "get",
    action: articleActions.getAllArticles
  },
  {
    path: `${base}/article`,
    method: "get",
    action: articleActions.getArticlesByIds
  },
  {
    path: `${base}/article`,
    method: "post",
    action: articleActions.saveArticle
  },
  {
    path: `${base}/article`,
    method: "delete",
    action: articleActions.deleteArticle
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

  ...categoryRoutes

]
