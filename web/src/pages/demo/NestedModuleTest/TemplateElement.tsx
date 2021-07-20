/**
 * Created by Jacob Xie on 9/24/2020.
 */

import { StorageSimple, Element, Content } from "@/components/Gallery/GalleryDataType"
import { ModulePanel } from "@/components/Gallery/ModulePanel/Panel/ModulePanel"
import React, { forwardRef, useLayoutEffect, useRef, useState } from "react"


export interface NSContainerElementProps {
  parentInfo: string[]
  timeSeries?: boolean
  editable: boolean
  element: Element
  fetchContentFn: (id: string, date?: string) => Promise<Content | undefined>
  // fetchContentDatesFn: (id: string, markName?: string) => Promise<DataType.Element>
  updateContentFn: (content: Content) => void
  onRemove: () => void
  fetchStoragesFn?: () => Promise<StorageSimple[]>
  fetchTableListFn?: (id: string) => Promise<string[]>
  fetchTableColumnsFn?: (storageId: string, tableName: string) => Promise<string[]>
  //turn to optional
  fetchQueryDataFn?: (readOption: Content) => Promise<any>

  // //added
  // content: Content
}

export interface ContainerElementRef {
  fetchContent: (date?: string) => void
  fetchContentDates: () => Promise<string[]>
}

/**
 * Template's elements
 */
export const TemplateElement =
  forwardRef((props: NSContainerElementProps, ref: React.Ref<ContainerElementRef>) => {
    const mpRef = useRef<HTMLDivElement>(null)
    const [mpHeight, setMpHeight] = useState<number>(0)
    const [content, setContent] = useState<Content>()
    const eleId = props.element.id as string | undefined

    useLayoutEffect(() => {
      if (mpRef.current) setMpHeight(mpRef.current.offsetHeight)
    })

    const fetchContent = async (date?: string) => {
      console.log(props.editable)
      if (eleId) {
        if (date)
          props.fetchContentFn(eleId, date).then(res => setContent(res))
        else
          props.fetchContentFn(eleId).then(res => {
            console.log(res)
            setContent(res)
          }
          )
      }
    }

    // const fetchContentDates = async () => {
    //   if (eleId && props.element.timeSeries) {
    //     const ele = await props.fetchContentDatesFn(eleId)
    //     return ele.contents!.map(c => DataType.timeToString(c.date))
    //   }
    //   return []
    // }

    // useImperativeHandle(ref, () => ({ fetchContent, fetchContentDates }))

    // const updateContent = (ctt: DataType.Content) => props.updateContentFn(ctt)

    return (
      <div style={{ height: "100%" }} ref={mpRef} >
        <ModulePanel
          parentInfo={props.parentInfo}
          eleId={eleId}
          headName={props.element.name}
          timeSeries={props.timeSeries}
          elementType={props.element.type}
          content={content}
          fetchStorages={props.fetchStoragesFn}
          fetchTableList={props.fetchTableListFn}
          fetchTableColumns={props.fetchTableColumnsFn}
          // fetchQueryData={props.fetchQueryDataFn}
          contentHeight={mpHeight}
          fetchContent={fetchContent}
          // fetchContentDates={fetchContentDates}
          // updateContent={updateContent}
          onRemove={props.onRemove}
          editable={props.editable}
          settable={!!eleId}
        />
      </div>
    )
  })

TemplateElement.defaultProps = {
  markAvailable: false,
  timeSeries: false
} as Partial<NSContainerElementProps>

