/**
 * Created by Jacob Xie on 8/28/2020.
 */

import React, { useState } from "react"

import { EditableContext } from "./GlobalContext"
import { LiteratureHeader } from "./LiteratureHeader"
import { LiteratureContent } from "./LiteratureContent"
import { Category, Article, Tag } from "./data"


interface LiteratureProps {
  // attributes
  categories: Category[]
  selectedCategory?: Category
  articles?: Article[]

  // header methods
  onSelectCategory: (value: string) => void
  onCreateCategory: (value: Category) => void

  // content methods
  tagPanelUpdate: (value: Tag) => void
  tagPanelDelete: (value: string) => void
  articlePanelUpdate: (value: Article) => void
  articlePanelDelete: (value: string) => void
  tagPanelSearch: (value: string[]) => void
}


export const Literature = (props: LiteratureProps) => {

  const [globalEditable, setGlobalEditable] = useState<boolean>(false)


  return (
    <EditableContext.Provider value={ globalEditable }>
      <LiteratureHeader
        categoryNames={ props.categories.map(i => i.name) }
        onSelectCategory={ props.onSelectCategory }
        onCreateCategory={ props.onCreateCategory }
        onEdit={ setGlobalEditable }
      />
      {
        props.selectedCategory && props.articles ?
          <LiteratureContent
            category={ props.selectedCategory }
            articles={ props.articles }
            tagPanelUpdate={ props.tagPanelUpdate }
            tagPanelDelete={ props.tagPanelDelete }
            articlePanelUpdate={ props.articlePanelUpdate }
            articlePanelDelete={ props.articlePanelDelete }
            tagPanelSearch={ props.tagPanelSearch }
          /> :
          <></>
      }
    </EditableContext.Provider>
  )
}
