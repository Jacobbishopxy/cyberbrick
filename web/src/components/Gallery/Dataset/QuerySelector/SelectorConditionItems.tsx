/**
 * Created by Jacob Xie on 3/2/2021
 */

import {ProFormGroup, ProFormList, ProFormRadio, ProFormSelect, ProFormText} from "@ant-design/pro-form"
import {SelectProps, Space} from "antd"
import {FormattedMessage} from "umi"
import _ from "lodash"


type OptionType = SelectProps<any>['options']

const symbolOptions = {
  "=": "=",
  ">": ">",
  ">=": ">=",
  "<": "<",
  "<=": "<=",
}

const junctionOptions = [
  {
    label: <FormattedMessage id="gallery.component.general40" />,
    value: "and",
  },
  {
    label: <FormattedMessage id="gallery.component.general41" />,
    value: "or",
  },
]

interface SelectorConditionItemsProps {
  columnOptions?: OptionType
}

export const SelectorConditionItems = (props: SelectorConditionItemsProps) => {

  const base = (
    <>
      <ProFormSelect
        rules={[{required: true}]}
        name="field"
        label={<FormattedMessage id="gallery.component.general33" />}
        options={props.columnOptions}
      />
      <ProFormSelect
        rules={[{required: true}]}
        name="symbol"
        label={<FormattedMessage id="gallery.component.general37" />}
        valueEnum={symbolOptions}
      />
      <ProFormText
        rules={[{required: true}]}
        name="value"
        label={<FormattedMessage id="gallery.component.general38" />}
      />
    </>
  )

  return (
    <>
      <ProFormList
        name="conditions"
        label={<FormattedMessage id="gallery.component.dataset.query-selector.selector-condition-items1" />}
        itemRender={({listDom, action}, {field, fields}) => {

          const junction = field.fieldKey !== _.last(fields)?.fieldKey ?
            <ProFormRadio.Group
              rules={[{required: true}]}
              name="junction"
              label={<FormattedMessage id="gallery.component.general39" />}
              options={junctionOptions}
            /> : <></>

          return (
            <>
              <Space align="end">
                {listDom}
                {junction}
                {action}
              </Space>
              <br />
            </>
          )
        }}
      >
        <ProFormGroup>
          {base}
        </ProFormGroup>
      </ProFormList>
    </>
  )
}
