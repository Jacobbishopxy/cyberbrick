/**
 * Created by Jacob Xie on 8/27/2020.
 */

import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Tag } from "antd"

import { SelectableTagsProps } from "./data"

export interface SelectableTagsRef {
  clearSelected: () => void
}

export const SelectableTags = forwardRef((props: SelectableTagsProps, ref: React.Ref<SelectableTagsRef>) => {

  const [selectedTagNames, setSelectedTagNames] = useState<string[]>([])

  useEffect(() => {
    props.onSelectTags(selectedTagNames)
  }, [selectedTagNames])

  const handleChange = (tag: string, checked: boolean) => {
    const nextSelectedTags = checked ?
      [...selectedTagNames, tag] :
      selectedTagNames.filter(t => t !== tag)
    setSelectedTagNames(nextSelectedTags)
  }

  const clearSelected = () => setSelectedTagNames([])

  useImperativeHandle(ref, () => ({clearSelected}))

  return (
    <>
      {
        props.tags.map(t =>
          <Tag.CheckableTag
            key={ t.name }
            checked={ selectedTagNames.indexOf(t.name) > -1 }
            onChange={ c => handleChange(t.name, c) }
          >
            { t.name }
          </Tag.CheckableTag>
        )
      }
    </>
  )
})
