/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import * as DataType from "../../GalleryDataType"
import { ModulePanel } from "../../ModulePanel/Panel"

export interface ContainerElementProps {
  markAvailable?: boolean
  timeSeries?: boolean
  editable: boolean
  element: DataType.Element
  fetchContentFn: (id: string, date?: string) => Promise<DataType.Content | undefined>
  fetchContentDatesFn: (id: string, markName?: string) => Promise<DataType.Element>
  updateContentFn: (content: DataType.Content) => void
  onRemove: () => void
}

export interface ContainerElementRef {
  fetchContent: (date?: string) => void
}

// todo: add Tags presenting
/**
 * Template's elements
 */
export const TemplateElement =
  forwardRef((props: ContainerElementProps, ref: React.Ref<ContainerElementRef>) => {

    const [content, setContent] = useState<DataType.Content>()
    const [dates, setDates] = useState<string[]>()
    const eleId = props.element.id as string | undefined

    useEffect(() => {
      if (!props.markAvailable && eleId) {
        setContent(undefined)
        setDates(undefined)
        props.fetchContentFn(eleId).then(res => setContent(res))
      }
    }, [])

    const fetchContent = (date?: string) => {
      if (props.markAvailable && eleId) {
        setContent(undefined)
        setDates(undefined)
        if (date)
          props.fetchContentFn(eleId, date).then(res => setContent(res))
        else
          props.fetchContentFn(eleId).then(res => setContent(res))
      }
    }

    const fetchContentDates = () => {
      if (eleId && props.element.timeSeries)
        props.fetchContentDatesFn(eleId)
          .then(res =>
            setDates(res.contents!.map(c => DataType.timeToString(c.date)))
          )
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
        dates={ dates }
        fetchContentDates={ fetchContentDates }
        updateContent={ updateContent }
        onRemove={ props.onRemove }
        editable={ props.editable }
      />
    )
  })

TemplateElement.defaultProps = {
  markAvailable: false,
  timeSeries: false
} as Partial<ContainerElementProps>

