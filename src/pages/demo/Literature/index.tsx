/**
 * Created by Jacob Xie on 8/27/2020.
 */

import React, { useState, useEffect } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import _ from "lodash"

import * as service from '@/services/literature'
import { EditableContext, LiteratureHeader, LiteratureContent } from "@/components/Literature"
import { TriggerEdit } from "./data"


export default () => {

  const [categories, setCategories] = useState<API.Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<API.Category>()
  const [articles, setArticles] = useState<API.Article[]>()
  const [reloadTrigger, setReloadTrigger] = useState<TriggerEdit>({ article: 0, category: 0 })

  const [globalEditable, setGlobalEditable] = useState<boolean>(false)

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
      ...reloadTrigger,
      article: reloadTrigger.article + 1
    })
  const triggerCategoryAndArticle = () =>
    setReloadTrigger({
      category: reloadTrigger.category + 1,
      article: reloadTrigger.article + 1
    })

  const tagPanelUpdate = (ts: API.CategoryU) =>
    service.upsertCategoryTag(ts).then(triggerCategory)

  const tagPanelDelete = (name: string) =>
    service.deleteTag(name).then(triggerCategory)

  const articlePanelUpdate = (target: API.Article) =>
    service.saveArticle(target).then(triggerCategoryAndArticle)

  const articlePanelDelete = (id: number) =>
    service.deleteArticle(id).then(triggerCategoryAndArticle)

  const categoryCreate = (cat: API.Category) =>
    service.saveCategory(cat).then(triggerCategory)

  const articleSearchByTags = (tagNames: string[]) => {
    if (selectedCategory) {
      if (tagNames.length !== 0)
        service.getArticlesByCategoryNameAndTagNames(selectedCategory.name, tagNames)
          .then(res => setArticles(res))
      else
        triggerArticle()
    }

  }

  return (
    <PageHeaderWrapper>
      <EditableContext.Provider value={ globalEditable }>
        <LiteratureHeader
          categoryNames={ categories.map(i => i.name) }
          onSelectCategory={ onSelectCategory }
          onCreateCategory={ categoryCreate }
          onEdit={ setGlobalEditable }
        />
        {
          selectedCategory && articles ?
            <LiteratureContent
              category={ selectedCategory }
              articles={ articles }
              tagPanelUpdate={ tagPanelUpdate }
              tagPanelDelete={ tagPanelDelete }
              articlePanelUpdate={ articlePanelUpdate }
              articlePanelDelete={ articlePanelDelete }
              tagPanelSearch={ articleSearchByTags }
            /> :
            <></>
        }
      </EditableContext.Provider>
    </PageHeaderWrapper>
  )
}

