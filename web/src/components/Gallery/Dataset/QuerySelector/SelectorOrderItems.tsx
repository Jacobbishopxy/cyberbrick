/**
 * Created by Jacob Xie on 3/2/2021
 */

import {ProFormGroup, ProFormList, ProFormRadio, ProFormSelect} from "@ant-design/pro-form"
import {SelectProps} from "antd"
import {FormattedMessage} from "umi"


const directionOptions = [
  {
    label: <FormattedMessage id="gallery.component.general59" />,
    value: "asc"
  },
  {
    label: <FormattedMessage id="gallery.component.general60" />,
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
      name="ordering"
      label={<FormattedMessage id="gallery.component.dataset.query-selector.selector-order-items1" />}
      creatorRecord={{direction: "asc"}}
    >
      <ProFormGroup>
        <ProFormSelect
          rules={[{required: true}]}
          name="field"
          label={<FormattedMessage id="gallery.component.general33" />}
          options={props.columnOptions}
        />

        <ProFormRadio.Group
          rules={[{required: true}]}
          name="direction"
          label={<FormattedMessage id="gallery.component.general48" />}
          options={directionOptions}
        />
      </ProFormGroup>
    </ProFormList>
  </>

