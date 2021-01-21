/**
 * Created by Jacob Xie on 1/20/2021
 */

import React from 'react'
import {Anchor} from "antd"

import {anchorList, AnchorType} from "./anchorType"


const anchorLinkGenerator = (anchorList: AnchorType[], index: number | string = 0) =>
  anchorList.map((a: AnchorType, idx) =>
    a.children ?
      <Anchor.Link href={`#${a.id}`} title={a.name} key={`${index}-${idx}`}>
        {anchorLinkGenerator(a.children, idx)}
      </Anchor.Link> :
      <Anchor.Link href={`#${a.id}`} title={a.name} key={`${index}-${idx}`}/>
  )

export const ManualAnchor = () =>
  <Anchor offsetTop={80}>
    {anchorLinkGenerator(anchorList)}
  </Anchor>

