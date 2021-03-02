/**
 * Created by Jacob Xie on 3/2/2021
 */

import {ProFormDependency, ProFormGroup, ProFormList, ProFormRadio, ProFormSelect, ProFormText} from "@ant-design/pro-form"
import {Space} from "antd"
import {FormattedMessage} from "umi"


interface OptionType {
  label: string
  value: any
}

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
  columnOptions?: OptionType[]
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
      {/* <ProFormDependency name={["field"]}>
        {i => {

          return (
            <ProFormRadio.Group
              name="junction"
              label={<FormattedMessage id="gallery.component.general39" />}
              options={junctionOptions}
            />
          )
        }}
      </ProFormDependency> */}
    </>
  )

  return (
    <>
      <ProFormList
        name="conditions"
        label={<FormattedMessage id="gallery.component.dataset-controller-query-condition-form-items1" />}
        creatorRecord={{junction: "and"}}
        itemRender={({listDom, action}, {fields}) => {
          console.log("fields:", fields)
          return (
            <>
              <Space align="end">
                {listDom}
                <ProFormRadio.Group
                  name="junction"
                  label={<FormattedMessage id="gallery.component.general39" />}
                  options={junctionOptions}
                />
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

