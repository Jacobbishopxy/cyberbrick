/**
 * Created by Jacob Xie on 2/24/2021
 */

import {useState} from "react"


export interface DisplayFormSeriesPieProps {
  columns?: string[]
}

export const DisplayFormSeriesPie = (props: DisplayFormSeriesPieProps) => {

  // todo: Form matches `SeriesPieChartConfig`
  return props.columns ? (
    <>

    </>
  ) : <></>
}

