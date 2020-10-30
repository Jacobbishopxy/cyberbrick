/**
 * Created by Jacob Xie on 10/12/2020.
 */

import React, {useEffect, useState} from 'react'

import * as DataType from "../../GalleryDataType"


export interface ContainerProps {

  contents: DataType.Content[]
}


export const Container = (props: ContainerProps) => {

  const [contents, setContents] = useState<DataType.Content[]>(props.contents)

  useEffect(() => setContents(props.contents), [props.contents])

  return (
    <>{contents}</>
  )
}

