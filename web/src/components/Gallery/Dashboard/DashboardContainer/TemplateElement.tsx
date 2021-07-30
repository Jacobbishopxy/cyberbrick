/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react"

import * as DataType from "../../GalleryDataType"
import { ModulePanel } from "../../ModulePanel/Panel"

export interface ContainerElementProps {
  parentInfo: string[]
  timeSeries?: boolean
  editable: boolean
  element: DataType.Element
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
    const [isMounted, setIsMounted] = useState(true);

    useLayoutEffect(() => {
      if (mpRef.current) setMpHeight(mpRef.current.offsetHeight)
    })

    //TODO: cancel can't refetch
    const fetchContent = useCallback(
      (date?: string) => {
        console.log(isMounted, eleId)
        if (eleId && isMounted) {
          if (date)
            props.fetchContentFn(eleId, date).then(res => setContent(res))
          else
            props.fetchContentFn(eleId).then(res => setContent(res))
        }
      },
      [isMounted],
    )


    //cancel subsription when this component is unmounted, so that fetchContent won't make a request
    useEffect(() => {
      // console.log(content)
      setIsMounted(true);
      return () => {
        setIsMounted(false);
      };
    }, [])

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
        />
      </div>
    )
  })

TemplateElement.defaultProps = {
  markAvailable: false,
  timeSeries: false
} as Partial<ContainerElementProps>

