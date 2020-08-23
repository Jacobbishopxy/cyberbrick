/**
 * Created by Jacob Xie on 8/14/2020.
 */

import { ValidationChain } from "express-validator"

import * as articleActions from "./controllers/ArticleActions"
import * as categoryActions from "./controllers/CategoryActions"
import * as tagActions from "./controllers/TagActions"
import * as authorActions from "./controllers/AuthorActions"
import * as common from "./common"

const base = "/api/literature"


interface Route {
  path: string,
  method: string,
  check?: ValidationChain[],
  action: Function
}

const categoryRoutes: Route[] = [
  {
    path: `${ base }/categories`,
    method: "get",
    action: categoryActions.getAllCategories
  },
  // {
  //   path: `${ base }/category`,
  //   method: "get",
  //   check: [common.queryNameCheck, common.queryOptionalPaginationCheck],
  //   action: categoryActions.getArticlesByCategoryName
  // },
  // {
  //   path: `${ base }/getArticlesByCategoryAndTagNames`,
  //   method: "get",
  //   check: [
  //     common.queryCategoryCheck,
  //     common.queryTagsCheck,
  //     common.queryOptionalPaginationCheck
  //   ],
  //   action: categoryActions.getArticlesByCategoryAndTagNames
  // },
  {
    path: `${ base }/getArticleIdsByCategoryName`,
    method: "get",
    check: [common.queryNameCheck],
    action: categoryActions.getArticleIdsByCategoryName
  },
  {
    path: `${ base }/getTagsByCategoryName`,
    method: "get",
    check: [common.queryNameCheck],
    action: categoryActions.getTagsByCategoryName
  },
  {
    path: `${ base }/category`,
    method: "post",
    action: categoryActions.saveCategory
  },
  {
    path: `${ base }/category`,
    method: "delete",
    check: [common.queryNameCheck],
    action: categoryActions.deleteCategory
  },
]

const articleRouts: Route[] = [
  {
    path: `${ base }/articles`,
    method: "get",
    action: articleActions.getAllArticles
  },
  {
    path: `${ base }/article`,
    method: "get",
    check: [common.queryIdsCheck, common.queryOptionalPaginationCheck],
    action: articleActions.getArticlesByIds
  },
  {
    path: `${ base }/article`,
    method: "post",
    action: articleActions.saveArticle
  },
  {
    path: `${ base }/article`,
    method: "delete",
    check: [common.queryIdCheck],
    action: articleActions.deleteArticle
  },

  {
    path: `${ base }/getArticlesByCategoryName`,
    method: "get",
    check: [common.queryCategoryNameCheck, common.queryOptionalPaginationCheck],
    action: articleActions.getArticlesByCategoryName
  },

]

const tagRouts: Route[] = [
  {
    path: `${ base }/tags`,
    method: "get",
    action: tagActions.getAllTags,
  },
  {
    path: `${ base }/tag`,
    method: "get",
    check: [common.queryNamesCheck],
    action: tagActions.getTagsByNames,
  },
  {
    path: `${ base }/tag`,
    method: "post",
    action: tagActions.tagSaveAction
  },
  {
    path: `${ base }/tag`,
    method: "delete",
    check: [common.queryNameCheck],
    action: tagActions.tagDeleteAction
  },
  {
    path: `${ base }/getCommonCategoriesByTagNames`,
    method: "get",
    check: [common.queryNamesCheck],
    action: tagActions.getCommonCategoriesByTagNames,
  },
]

const authorRoutes: Route[] = [
  {
    path: `${ base }/authors`,
    method: "get",
    action: authorActions.getAllAuthors,
  },
  {
    path: `${ base }/getArticleIdsByAuthorNames`,
    method: "get",
    action: authorActions.getArticleIdsByAuthorNames,
  },

]

export const literature: Route[] = [

  ...articleRouts,

  ...tagRouts,

  ...categoryRoutes,

  ...authorRoutes

]
