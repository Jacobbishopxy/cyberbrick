/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import * as DataType from "../../DataType"
import { ModulePanel } from "../ModulePanel/ModulePanel"

export interface ContainerElementProps {
  markAvailable?: boolean
  timeSeries?: boolean
  editable: boolean
  element: DataType.Element
  // todo: `fetchContentFn` param `date` is not used
  fetchContentFn: (id: string, date?: string) => Promise<DataType.Content | undefined>
  updateContentFn: (content: DataType.Content) => void
  onRemove: () => void
}

export interface ContainerElementRef {
  fetchContent: () => void
}

export const ContainerElement =
  forwardRef((props: ContainerElementProps, ref: React.Ref<ContainerElementRef>) => {

    const [content, setContent] = useState<DataType.Content>()
    const eleId = props.element.id as string | undefined

    useEffect(() => {
      if (!props.markAvailable && eleId)
        props.fetchContentFn(eleId).then(res => setContent(res))
    }, [])

    const fetchContent = () => {
      if (props.markAvailable && eleId)
        props.fetchContentFn(eleId).then(res => setContent(res))
    }

    useImperativeHandle(ref, () => ({ fetchContent }))

    const updateContent = (ctt: DataType.Content) =>
      props.updateContentFn(ctt)

    return (
      <ModulePanel
        headName={ props.element.name }
        timeSeries={ props.timeSeries }
        elementType={ props.element.type }
        content={ content }
        fetchContent={ fetchContent }
        updateContent={ updateContent }
        onRemove={ props.onRemove }
        editable={ props.editable }
      />
    )
  })

ContainerElement.defaultProps = {
  markAvailable: false,
  timeSeries: false
} as Partial<ContainerElementProps>

