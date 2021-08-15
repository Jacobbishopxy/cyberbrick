/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react"

import * as DataType from "../../GalleryDataType"
import { ModulePanel } from "../../ModulePanel/Panel"


export interface ContainerElementProps {
  parentInfo: string[]
  timeSeries?: boolean
  editable: boolean
  element: DataType.Element
  shouldStartFetch: number
  isNested?: boolean
  fetchContentFn: (id: string, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
  fetchContentDatesFn: (id: string, markName?: string) => Promise<DataType.Element>
  updateContentFn: (content: DataType.Content) => void
  onRemove: () => void
  fetchStoragesFn: () => Promise<DataType.StorageSimple[]>
  fetchTableListFn: (id: string) => Promise<string[]>
  fetchTableColumnsFn: (storageId: string, tableName: string) => Promise<string[]>
  fetchQueryDataFn: (readOption: DataType.Content) => Promise<any>

  // onTEfetchContent: (eleId: string, elementType: DataType.ElementType, date?: string | undefined) => Promise<DataType.Content | undefined>
}

export interface ContainerElementRef {
  fetchContent: (date?: string) => void
  fetchContentDates: () => Promise<string[]>
}


/**
 * Template's elements
 */
export const TemplateElement =
  forwardRef((props: ContainerElementProps, ref: React.Ref<ContainerElementRef>) => {
    const mpRef = useRef<HTMLDivElement>(null)

    const [mpHeight, setMpHeight] = useState<number>(0)
    const [content, setContent] = useState<DataType.Content>()
    const eleId = props.element.id as string | undefined

    const [isLoading, setIsLoading] = useState(true);
    useLayoutEffect(() => {
      if (mpRef.current) setMpHeight(mpRef.current.offsetHeight)
    })

    /**
     * Template Element may be nested in a module, so we have different fetch api
     * If TemplateElment is nested, eleId is actually tabId.
     */
    const fetchContent = (date?: string) => {
      // console.log(eleId, props.isNested)
      if (eleId) {
        //no need to check date since it's allowed date to be undefined
        props.fetchContentFn(eleId, date, props.isNested).then(res => {
          //TODO: cannot set content to undefined
          const ct = res || { data: {}, date: '' }
          setContent(ct)
          if (props.isNested) console.log(ct)
          props.updateContentFn(ct)
          // onReceiveContentFromFetch(res as DataType.Content, props.isNested)
        })
        //no matter what we receive, wait till if statement end to stop loading
        setIsLoading(false)
      }
    }


    //listen to props's shouldStartFetch. If it updates, fetchContent
    useEffect(() => {
      //first mount: should fetch; After mount: when props.shouldStartFetch update, do the fetching
      if (props.shouldStartFetch) fetchContent()
    }, [props.shouldStartFetch])

    const fetchContentDates = async () => {
      if (eleId && props.element.timeSeries) {
        const ele = await props.fetchContentDatesFn(eleId)
        return ele.contents!.map(c => DataType.timeToString(c.date))
      }
      return []
    }

    useImperativeHandle(ref, () => ({ fetchContent, fetchContentDates }))

    const updateContent = (ctt: DataType.Content) => props.updateContentFn(ctt)

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
          fetchQueryData={props.fetchQueryDataFn}
          contentHeight={mpHeight}
          fetchContent={fetchContent}
          fetchContentDates={fetchContentDates}
          updateContent={updateContent}
          onRemove={props.onRemove}
          editable={props.editable}
          settable={!!eleId}
          isLoading={isLoading}

          fetchContentFn={props.fetchContentFn}
          fetchContentDatesFn={props.fetchContentDatesFn}
        />
      </div>
    )
  })

TemplateElement.defaultProps = {
  markAvailable: false,
  timeSeries: false
} as Partial<ContainerElementProps>

