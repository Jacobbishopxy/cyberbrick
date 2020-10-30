/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React from 'react'

import * as DataType from "@/components/Gallery/GalleryDataType"

import styles from "./Common.less"


export interface ModulePanelFooterProps {
  id?: string
  date?: string
}

export const ModulePanelFooter = (props: ModulePanelFooterProps) =>
  <div className={styles.modulePanelFooter}>
    {props.id ? <span>ID: {props.id}</span> : <></>}
    {props.date ? <span>Date: {DataType.timeToString(props.date)}</span> : <></>}
  </div>

