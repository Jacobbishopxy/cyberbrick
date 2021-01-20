/**
 * Created by Jacob Xie on 1/20/2021
 */

import React from 'react'
// import {Image} from "antd"

import {anchorList} from "./anchorType"


export const ManualContent = () => {

  return (
    <>
      <div id={anchorList[0].id}>
        <div style={{height: 500}}>dev</div>
      </div>
      <div id={anchorList[0].children![0].id}>
        <div style={{height: 500}}>dev</div>
      </div>
      <div id={anchorList[0].children![1].id}>
        <div style={{height: 500}}>dev</div>
      </div>
      <div id={anchorList[0].children![2].id}>
        <div style={{height: 500}}>dev</div>
      </div>
      <div id={anchorList[1].id}>
        <div style={{height: 500}}>dev</div>
      </div>
      <div id={anchorList[1].children![0].id}>
        <div style={{height: 500}}>dev</div>
      </div>
      <div id={anchorList[1].children![1].id}>
        <div style={{height: 500}}>dev</div>
      </div>
      <div id={anchorList[2].id}>
        <div style={{height: 500}}>dev</div>
      </div>
      <div id={anchorList[2].children![0].id}>
        <div style={{height: 500}}>dev</div>
      </div>
      <div id={anchorList[2].children![1].id}>
        <div style={{height: 500}}>dev</div>
      </div>
      <div id={anchorList[2].children![1].children![0].id}>
        <div style={{height: 500}}>dev</div>
      </div>
      <div id={anchorList[2].children![1].children![1].id}>
        <div style={{height: 500}}>dev</div>
      </div>
      <div id={anchorList[2].children![1].children![2].id}>
        <div style={{height: 500}}>dev</div>
      </div>
      <div id={anchorList[2].children![1].children![3].id}>
        <div style={{height: 500}}>dev</div>
      </div>
      <div id={anchorList[2].children![1].children![4].id}>
        <div style={{height: 500}}>dev</div>
      </div>
      <div id={anchorList[2].children![1].children![5].id}>
        <div style={{height: 500}}>dev</div>
      </div>
      <div id={anchorList[2].children![1].children![6].id}>
        <div style={{height: 500}}>dev</div>
      </div>
      <div id={anchorList[2].children![1].children![7].id}>
        <div style={{height: 500}}>dev</div>
      </div>
    </>
  )
}

