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

  fetchContentFn: (id: string, date?: string) => Promise<DataType.Content | undefined>
  fetchContentDatesFn: (id: string, markName?: string) => Promise<DataType.Element>
  updateContentFn: (content: DataType.Content) => void
  onRemove: () => void
  fetchStoragesFn: () => Promise<DataType.StorageSimple[]>
  fetchTableListFn: (id: string) => Promise<string[]>
  fetchTableColumnsFn: (storageId: string, tableName: string) => Promise<string[]>
  fetchQueryDataFn: (readOption: DataType.Content) => Promise<any>
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

    /** 1. determine whether the content is "pointer". 
     * 2. If it is, fetch the actual data from 3rd party database by calling fetchQuery. 
     * 3. update the content to make sure we have the actual content stored in React state.
          */
    const fetchQueryAndUpdateContent = (c: DataType.Content) => {
      //if we should and could fetch query, fetch!
      if (DataType.shouldQueryAfterRecevingContent(props.element.type)) {
        if (DataType.MongoContentValidation(c?.data)) {
          props.fetchQueryDataFn(c).then((res: any) => {
            // console.log({ ...c?.data, ...res })
            //update content so that editor can share the default value
            setContent(ct => {
              return {
                ...ct, data: { ...c?.data, ...res },
                date: ct?.date || DataType.today() //create date if not exist
              }
            })
          })
        }
      }
      //no matter we fetch or not, wait till if statement end to stop loading
      setIsLoading(false)
    }

    const fetchContent = (date?: string) => {
      if (eleId) {
        //no need to check date since it's allowed date to be undefined
        props.fetchContentFn(eleId, date).then(res => {
          //TODO: cannot set content to undefined
          setContent(res || { data: {}, date: '' })
          /**if we use 3rd party database to store the actual content, we just fetch the "pointer" 
           * of those content. Now we need to determine whether the content is "pointer". If it is,
           * fetch the actual data from 3rd party database by calling fetchQuery. And then update 
           * the content to make sure we have the actual content stored in React state.
          */
          res && fetchQueryAndUpdateContent(res)
        })
      }
    }

    //listen to props's shouldStartFetch. If it updates, fetchContent
    useEffect(() => {
      //first mount: should fetch; After mount: when props.shouldStartFetch update, do the fetching
      fetchContent()
    }, [props.shouldStartFetch])

    const fetchContentDates = async () => {
      if (eleId && props.element.timeSeries) {
        const ele = await props.fetchContentDatesFn(eleId)
        return ele.contents!.map(c => DataType.timeToString(c.date))
      }
      return []
    }

    useImperativeHandle(ref, () => ({ eleId, fetchContent, fetchContentDates }))

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
        />
      </div>
    )
  })

TemplateElement.defaultProps = {
  markAvailable: false,
  timeSeries: false
} as Partial<ContainerElementProps>

