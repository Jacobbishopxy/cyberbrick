/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import moment from "moment"

import * as DataType from "../../DataType"
import { ModulePanel } from "../ModulePanel/ModulePanel"

export interface ContainerElementProps {
  markAvailable?: boolean
  timeSeries?: boolean
  editable: boolean
  element: DataType.Element
  fetchContentFn: (id: string, date?: string) => Promise<DataType.Content | undefined>
  fetchContentDatesFn: (id: string) => Promise<DataType.Element>
  updateContentFn: (content: DataType.Content) => void
  onRemove: () => void
}

export interface ContainerElementRef {
  fetchContent: (date?: string) => void
}

export const ContainerElement =
  forwardRef((props: ContainerElementProps, ref: React.Ref<ContainerElementRef>) => {

    const [content, setContent] = useState<DataType.Content>()
    const [dates, setDates] = useState<string[]>()
    const eleId = props.element.id as string | undefined

    // todo: memory lick?
    useEffect(() => {
      let isSubscribed = true
      if (!props.markAvailable && eleId)
        props.fetchContentFn(eleId).then(res => {
          if (isSubscribed) setContent(res)
        })
      return () => {
        isSubscribed = false
      }
    }, [])

    const fetchContent = (date?: string) => {
      if (props.markAvailable && eleId) {
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
            setDates(res.contents!.map(c => moment(c.date).format(DataType.dateFormat)))
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

ContainerElement.defaultProps = {
  markAvailable: false,
  timeSeries: false
} as Partial<ContainerElementProps>
