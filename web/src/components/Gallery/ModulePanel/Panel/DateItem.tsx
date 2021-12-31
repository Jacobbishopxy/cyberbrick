// import { CloseOutlined } from '@ant-design/icons'
import { useContext, useEffect, useState } from 'react'

import { Tooltip } from 'antd'
import { useIntl } from 'umi'

import styles from './Common.less'
import * as DataType from "../../GalleryDataType"
import { nestedDedicatedContext } from '@/components/Gallery/Dashboard/DashboardContainer/nestedDedicatedContext'

import { DashboardContext } from "../../Dashboard/DashboardContext"
interface dateBoxProps {
  date: string
  setDate: React.Dispatch<React.SetStateAction<string | undefined | null>>
  style?: React.CSSProperties
  currDate: string
  elementName: string
  editble: boolean
  content: DataType.Content | undefined
  contentId: string | undefined
}
export default (props: dateBoxProps) => {

  const dashboardProps = useContext(DashboardContext)
  const nestedDedicatedProps = useContext(nestedDedicatedContext)
  const intl = useIntl()



  // const [contentToBeDeleted, setContentToBeDeleted] = useState<DataType.Content | undefined>()


  return (
    <div className={styles.dateItem}
      style={props.currDate === props.date ? {
        backgroundColor: 'rgba(111, 184, 226, 0.76)',
        boxShadow: '1px 1px 2px #85b4cf, -1px -1px 2px #5fa8d3'
      } : {}}
      // 改变date
      onClick={() => props.setDate(props.date!)}>
      {
        props.editble
          ? <Tooltip title={intl.formatMessage({ id: "gallery.component.general23" })}>
            <div
              // 删除content和dateList
              onClick={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
                console.log(1888, props.contentId)

                e.stopPropagation()

                // 删除content
                if (dashboardProps?.setAllContent) {

                  dashboardProps?.setAllContent((allContent) => {
                    // 根据公司ID、维度ID、父模块名称、自身模块名称、date删除content
                    const newAllContent = allContent?.filter((v, i) => v.date?.slice(0, 10) === props.date?.slice(0, 10) && v.element?.name === props.elementName && v.element.parentName === nestedDedicatedProps?.element.parentName && v.templateInfo?.id === props.content?.templateInfo?.id && v.dashboardInfo?.id === props.content?.dashboardInfo?.id)
                    return newAllContent
                  })
                }
                // 将删除content的id存入delectIds
                if (props.contentId) {
                  dashboardProps?.setContentIdsToBeDelect((ids) => [...ids, props.contentId as string])
                }

                // 跳转附近的date
                let nextDate: string | undefined = undefined;
                nestedDedicatedProps?.dateList.forEach((v, i) => {
                  if (v === props.date) {
                    nextDate = nestedDedicatedProps.dateList[i - 1] ? nestedDedicatedProps.dateList[i - 1]
                      : nestedDedicatedProps.dateList[i + 1]
                  }
                })
                props.setDate(nextDate ? nextDate : '-1')
                // 删除dateList
                if (nestedDedicatedProps?.setDateList) {
                  nestedDedicatedProps.setDateList((dateList) => dateList.filter((v) => v !== props.date))
                }
              }}
              style={{
                position: 'absolute',
                right: '0',
                top: '0',
                cursor: 'pointer',
              }}
            >🗑️</div>
          </Tooltip>
          : <></>
      }
      {props.date}
    </div>
  )
}