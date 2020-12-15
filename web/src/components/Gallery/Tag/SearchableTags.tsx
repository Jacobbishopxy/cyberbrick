/**
 * Created by Jacob Xie on 12/15/2020
 */

import React, {useEffect, useRef, useState} from 'react'
import {Button, Divider, Space, Tag, Tooltip} from "antd"

import {GenericDataInput, SelectableTags, SelectableTagsRef} from "./SelectableTags"

export interface SearchableTagsProps<T extends GenericDataInput> {
  searchable: boolean
  data: T[]
  elementOnSelect: (value: string[]) => void
}

export const SearchableTags = <T extends GenericDataInput>(props: SearchableTagsProps<T>) => {

  const selectableTagsRef = useRef<SelectableTagsRef>(null)

  const [data, setData] = useState<T[]>(props.data)
  const [selectedDataNames, setSelectedDataNames] = useState<string[]>([])

  useEffect(() => setData(props.data), [props.data])

  const clearSelected = () => {
    props.elementOnSelect([])
    if (selectableTagsRef.current) selectableTagsRef.current.clearSelected()
  }

  useEffect(clearSelected, [props.searchable])


  return props.searchable ?
    <>
      <SelectableTags
        tags={data}
        onSelectTags={setSelectedDataNames}
        ref={selectableTagsRef}
      />
      <Divider/>
      <Space>
        <Button
          onClick={() => props.elementOnSelect(selectedDataNames)}
          type="primary"
          size="small"
        >
          Search
        </Button>
        <Button
          onClick={clearSelected}
          size="small"
        >
          Reset
        </Button>
      </Space>
    </> :
    <>
      {
        data.map(t =>
          <Tooltip title={t.description} key={t.name}>
            <Tag>
              {t.name}
            </Tag>
          </Tooltip>
        )
      }
    </>
}

