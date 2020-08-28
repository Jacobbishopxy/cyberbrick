/**
 * Created by Jacob Xie on 8/27/2020.
 */

import React, { useState, useEffect } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import _ from "lodash"

import * as service from '@/services/literature'
import LiteratureDataType from "@/components/Literature/data"
import Literature from "@/components/Literature"


interface TriggerEdit {
  article: number
  category: number
}

export default () => {

  const [categories, setCategories] = useState<LiteratureDataType.Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<LiteratureDataType.Category>()
  const [articles, setArticles] = useState<LiteratureDataType.Article[]>()
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
      ...reloadTrigger,
      article: reloadTrigger.article + 1
    })
  const triggerCategoryAndArticle = () =>
    setReloadTrigger({
      category: reloadTrigger.category + 1,
      article: reloadTrigger.article + 1
    })

  const onCreateCategory = (cat: LiteratureDataType.Category) =>
    service.saveCategory(cat).then(triggerCategory)

  const tagPanelUpdate = (ts: LiteratureDataType.CategoryU) =>
    service.upsertCategoryTag(ts).then(triggerCategory)

  const tagPanelDelete = (name: string) =>
    service.deleteTag(name).then(triggerCategory)

  const articlePanelUpdate = (target: LiteratureDataType.Article) =>
    service.saveArticle(target).then(triggerCategoryAndArticle)

  const articlePanelDelete = (id: number) =>
    service.deleteArticle(id).then(triggerCategoryAndArticle)

  const tagPanelSearch = (tagNames: string[]) => {
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
      <Literature
        categories={ categories }
        selectedCategory={ selectedCategory }
        articles={ articles }
        onSelectCategory={ onSelectCategory }
        onCreateCategory={ onCreateCategory }
        tagPanelUpdate={ tagPanelUpdate }
        tagPanelDelete={ tagPanelDelete }
        articlePanelUpdate={ articlePanelUpdate }
        articlePanelDelete={ articlePanelDelete }
        tagPanelSearch={ tagPanelSearch }
      />
    </PageHeaderWrapper>
  )
}

