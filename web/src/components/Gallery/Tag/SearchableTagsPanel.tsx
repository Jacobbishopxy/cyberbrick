/**
 * Created by Jacob Xie on 12/15/2020
 */

import React, {useEffect, useRef, useState} from 'react'
import {Button, Divider, Space, Tag, Tooltip} from "antd"

import {GenericDataInput, SelectableTags, SelectableTagsRef} from "./SelectableTags"

export interface SearchableTagsProps<T extends GenericDataInput> {
  searchable: boolean
  data: T[]
  elementOnSearch: (value: string[]) => void
}

export const SearchableTagsPanel = <T extends GenericDataInput>(props: SearchableTagsProps<T>) => {

  const selectableTagsRef = useRef<SelectableTagsRef>(null)

  const [selectedDataNames, setSelectedDataNames] = useState<string[]>([])

  const clearSelected = () => {
    setSelectedDataNames([])
    if (selectableTagsRef.current) selectableTagsRef.current.clearSelected()
  }

  useEffect(clearSelected, [props.searchable])

  return props.searchable ?
    <>
      <SelectableTags
        tags={props.data}
        onSelectTags={setSelectedDataNames}
        ref={selectableTagsRef}
      />
      <Divider/>
      <Space>
        <Button
          onClick={() => props.elementOnSearch(selectedDataNames)}
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
        props.data.map(t =>
          <Tooltip title={t.description} key={t.name}>
            <Tag>
              {t.name}
            </Tag>
          </Tooltip>
        )
      }
    </>
}

