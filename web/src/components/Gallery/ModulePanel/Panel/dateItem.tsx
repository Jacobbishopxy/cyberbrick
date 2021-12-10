import { CloseOutlined } from '@ant-design/icons'
import styles from './Common.less'
import { useContext } from 'react'
import * as DataType from "../../GalleryDataType"

import { nestedDedicatedContext } from '@/components/Gallery/Dashboard/DashboardContainer/nestedDedicatedContext'

import { DashboardContext } from "../../Dashboard/DashboardContext"
import e from "@umijs/deps/compiled/express"
interface dateBoxProps {
  date: string
  setDate: React.Dispatch<React.SetStateAction<string | undefined | null>>
  style?: React.CSSProperties
  currDate: string
  elementName: string
  editble: boolean
}
export default (props: dateBoxProps) => {

  const dashboardProps = useContext(DashboardContext)
  const nestedDedicatedProps = useContext(nestedDedicatedContext)
  console.log(100, props.currDate, props.date)
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
          ? <CloseOutlined
            // 删除content和dateList
            onClick={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
              console.log(1888, e)

              e.stopPropagation()
              // 删除content
              if (dashboardProps?.setAllContent) {

                dashboardProps?.setAllContent((allContent) => {
                  const newAllContent = allContent?.filter((v) => {
                    return !(v.date.slice(0, 10) === props.date?.slice(0, 10) && v.element?.name === props.elementName
                    )
                  })
                  console.log(411, newAllContent, props.date, props.elementName)
                  return newAllContent
                })
              }
              // 将删除content的id存入delectIds
              const delectId = nestedDedicatedProps?.content?.id
              if (delectId) {
                dashboardProps?.setContentIdsToBeDelect((ids) => [...ids, delectId])
              }
              // 跳转附近的date
              let nextDate: string | undefined = undefined;
              nestedDedicatedProps?.dateList.forEach((v, i) => {
                if (v === props.date) {
                  nextDate = nestedDedicatedProps.dateList[i - 1] ? nestedDedicatedProps.dateList[i - 1]
                    : nestedDedicatedProps.dateList[i + 1]
                }
              })
              console.log(566, nextDate)
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
          />
          : <></>
      }
      {props.date}
    </div>
  )
}