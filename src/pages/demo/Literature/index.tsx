/**
 * Created by Jacob Xie on 8/16/2020.
 */

import { PageHeaderWrapper } from '@ant-design/pro-layout'
import React, { useState, useEffect } from 'react'
import _ from "lodash"

import * as service from '@/services/literature'
import { Content } from "./components/Content"
import { Controller } from "./components/Controller"
import { TriggerEdit } from "./data"


export default () => {

  const [categories, setCategories] = useState<API.Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<API.Category>()
  const [articles, setArticles] = useState<API.Article[]>()
  const [reloadTrigger, setReloadTrigger] = useState<TriggerEdit>({ article: 0, category: 0 })

  useEffect(() => {
    service.getAllCategoriesWithUnionTags()
      .then(res => setCategories(res))
  }, [reloadTrigger.category])

  useEffect(() => {
    if (selectedCategory)
      service.getArticlesByCategoryNameAndTagNames(selectedCategory.name)
        .then(res => setArticles(res))
  }, [selectedCategory, reloadTrigger.article])

  const onSelectCategory = (value: string) => {
    const cat = _.find(categories, i => i.name === value)
    if (cat) setSelectedCategory(cat)
  }

  useEffect(() => {
    if (selectedCategory) onSelectCategory(selectedCategory.name)
  }, [categories])

  const triggerCategory = () =>
    setReloadTrigger({
      ...reloadTrigger,
      category: reloadTrigger.category + 1
    })

  const triggerArticle = () =>
    setReloadTrigger({
      category: reloadTrigger.category + 1,
      article: reloadTrigger.article + 1
    })

  const tagPanelUpdate = (ts: API.CategoryU) =>
    service.upsertCategoryTag(ts).then(triggerCategory)

  const tagPanelDelete = (name: string) =>
    service.deleteTag(name).then(triggerCategory)

  const articlePanelUpdate = (target: API.Article) =>
    service.saveArticle(target).then(triggerArticle)

  const articlePanelDelete = (id: number) =>
    service.deleteArticle(id).then(triggerArticle)

  const categoryCreate = (cat: API.Category) =>
    service.saveCategory(cat).then(triggerCategory)

  return (
    <PageHeaderWrapper>
      <Controller
        categoryNames={ categories.map(i => i.name) }
        onSelectCategory={ onSelectCategory }
        onCreateCategory={ categoryCreate }
      />
      {
        selectedCategory && articles ?
          <Content
            category={ selectedCategory }
            articles={ articles }
            tagPanelUpdate={ tagPanelUpdate }
            tagPanelDelete={ tagPanelDelete }
            articlePanelUpdate={ articlePanelUpdate }
            articlePanelDelete={ articlePanelDelete }
          /> :
          <></>
      }
    </PageHeaderWrapper>
  )
}

