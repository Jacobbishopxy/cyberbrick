/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { useEffect, useState } from 'react'

import * as DataType from "../../DataType"
import { ModulePanel } from "../ModulePanel/ModulePanel"

export interface ContainerElementProps {
  editable: boolean
  element: DataType.Element
  fetchContent: (id: string) => Promise<DataType.Content | undefined>
  updateContent: (content: DataType.Content) => void
  onRemove: () => void
}


export const ContainerElement = (props: ContainerElementProps) => {

  const [content, setContent] = useState<DataType.Content>()
  const eleId = props.element.id as string | undefined

  useEffect(() => {
    if (eleId) props.fetchContent(eleId).then(res => setContent(res))
  }, [])

  const updateContent = (ctt: DataType.Content) => {
    return props.updateContent(ctt)
  }

  return (
    <ModulePanel
      headName={ props.element.name }
      elementType={ props.element.type }
      content={ content }
      updateContent={ updateContent }
      onRemove={ props.onRemove }
      editable={ props.editable }
    />
  )
}

