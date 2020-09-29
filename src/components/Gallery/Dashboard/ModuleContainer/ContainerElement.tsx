/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { useEffect, useState } from 'react'

import * as DataType from "../../DataType"
import { ModulePanel } from "../ModulePanel/ModulePanel"

export interface ContainerElementProps {
  markAvailable?: boolean
  startFetchContent?: number
  editable: boolean
  element: DataType.Element
  fetchContentFn: (id: string) => Promise<DataType.Content | undefined>
  updateContentFn: (content: DataType.Content) => void
  onRemove: () => void
}

export const ContainerElement = (props: ContainerElementProps) => {

  const [content, setContent] = useState<DataType.Content>()
  const eleId = props.element.id as string | undefined

  useEffect(() => {
    if (!props.markAvailable && eleId)
      props.fetchContentFn(eleId).then(res => setContent(res))
  }, [])

  useEffect(() => {
    if (props.markAvailable && props.startFetchContent! > 0 && eleId)
      props.fetchContentFn(eleId).then(res => setContent(res))
  }, [props.startFetchContent])

  const updateContent = (ctt: DataType.Content) =>
    props.updateContentFn(ctt)

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

ContainerElement.defaultProps = {
  markAvailable: false,
  startFetchContent: 0
} as Partial<ContainerElementProps>

