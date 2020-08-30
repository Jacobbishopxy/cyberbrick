/**
 * Created by Jacob Xie on 8/14/2020.
 */


import * as articleActions from "./controllers/ArticleActions"
import * as categoryActions from "./controllers/CategoryActions"
import * as tagActions from "./controllers/TagActions"
import * as authorActions from "./controllers/AuthorActions"
import * as common from "./common"
import * as utils from "../utils"

const base = "/api/literature"

const categoryRoutes: utils.OrmRoute[] = [
  {
    path: `${ base }/categories`,
    method: "get",
    action: categoryActions.getAllCategories
  },
  {
    path: `${ base }/category`,
    method: "get",
    check: [common.queryNamesCheck],
    action: categoryActions.getCategoriesByNames
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
  {
    path: `${ base }/getTagsByCategoryName`,
    method: "get",
    check: [common.queryNameCheck],
    action: categoryActions.getTagsByCategoryName
  },
  {
    path: `${ base }/upsertCategoryTag`,
    check: [
      common.bodyNameCheck,
      common.bodyTagNameCheck
    ],
    method: "post",
    action: categoryActions.upsertCategoryTag
  },
  {
    path: `${ base }/removeCategoryTag`,
    method: "delete",
    check: [
      common.queryCategoryNameCheck,
      common.queryTagNameCheck
    ],
    action: categoryActions.removeCategoryTag
  },

]

const articleRouts: utils.OrmRoute[] = [
  {
    path: `${ base }/articles`,
    method: "get",
    action: articleActions.getAllArticles
  },
  {
    path: `${ base }/article`,
    method: "get",
    check: [
      common.queryIdsCheck,
      common.queryOptionalPaginationCheck
    ],
    action: articleActions.getArticlesByIds
  },
  {
    path: `${ base }/article`,
    method: "post",
    check: [
      common.bodyCategoryCheck
    ],
    action: articleActions.saveArticle
  },
  {
    path: `${ base }/article`,
    method: "delete",
    check: [common.queryIdCheck],
    action: articleActions.deleteArticle
  },
  {
    path: `${ base }/getArticlesByCategoryNameAndTagNames`,
    method: "get",
    check: [
      common.queryCategoryNameCheck,
      common.queryOptionalTagNamesCheck,
      common.queryOptionalPaginationCheck
    ],
    action: articleActions.getArticlesByCategoryNameAndTagNames
  },
  {
    path: `${ base }/getArticlesByAuthorName`,
    method: "get",
    check: [
      common.queryNameCheck,
      common.queryOptionalPaginationCheck
    ],
    action: articleActions.getArticlesByAuthorName
  },
]

const tagRouts: utils.OrmRoute[] = [
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
    check: [common.bodyCategoryCheck],
    action: tagActions.saveTag
  },
  {
    path: `${ base }/tag`,
    method: "delete",
    check: [common.queryNameCheck],
    action: tagActions.deleteTag
  },
  {
    path: `${ base }/getCommonCategoriesByTagNames`,
    method: "get",
    check: [common.queryNamesCheck],
    action: tagActions.getCommonCategoriesByTagNames,
  },
]

const authorRoutes: utils.OrmRoute[] = [
  {
    path: `${ base }/authors`,
    method: "get",
    action: authorActions.getAllAuthors,
  },
  {
    path: `${ base }/author`,
    method: "get",
    check: [common.queryNamesCheck],
    action: authorActions.getAuthorsByNames,
  },
  {
    path: `${ base }/author`,
    method: "post",
    action: authorActions.saveAuthor,
  },
  {
    path: `${ base }/author`,
    method: "delete",
    check: [common.queryNamesCheck],
    action: authorActions.deleteAuthor,
  },
]


export const literature: utils.OrmRoute[] = [

  ...articleRouts,

  ...tagRouts,

  ...categoryRoutes,

  ...authorRoutes

]

