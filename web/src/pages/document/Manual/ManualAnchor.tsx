/**
 * Created by Jacob Xie on 1/20/2021
 */

import React from 'react'
import {Anchor} from "antd"

import {anchorList, AnchorType} from "./anchorType"


const anchorLinkGenerator = (anchorList: AnchorType[]) =>
  anchorList.map((a: AnchorType) =>
    a.children ?
      <Anchor.Link href={`#${a.id}`} title={a.name}>
        {anchorLinkGenerator(a.children)}
      </Anchor.Link> :
      <Anchor.Link href={`#${a.id}`} title={a.name}/>
  )

export const ManualAnchor = () => {

  return (
    <Anchor offsetTop={80}>
      {anchorLinkGenerator(anchorList)}
    </Anchor>
  )
}

