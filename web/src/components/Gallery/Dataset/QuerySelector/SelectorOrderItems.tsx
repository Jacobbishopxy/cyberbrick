/**
 * Created by Jacob Xie on 3/2/2021
 */

import {ProFormGroup, ProFormList, ProFormRadio, ProFormSelect} from "@ant-design/pro-form"
import {SelectProps} from "antd"


const directionOptions = [
  {
    label: "ASC",
    value: "asc"
  },
  {
    label: "DESC",
    value: "desc"
  },
]

type OptionType = SelectProps<any>["options"]

interface SelectorOrderItemsProps {
  columnOptions?: OptionType
}

export const SelectorOrderItems = (props: SelectorOrderItemsProps) =>
  <>
    <ProFormList
      name="sorting"
      label="Sorting"
      creatorRecord={{dir: "asc"}}
    >
      <ProFormGroup>
        <ProFormSelect
          rules={[{required: true}]}
          name="field"
          label="Field"
          options={props.columnOptions}
        />

        <ProFormRadio.Group
          rules={[{required: true}]}
          name="dir"
          label="Direction"
          options={directionOptions}
        />
      </ProFormGroup>
    </ProFormList>
  </>

