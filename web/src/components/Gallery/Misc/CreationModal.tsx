/**
 * Created by Jacob Xie on 8/27/2020.
 */

import { useState } from "react"
import { Form, Input, Modal, Select } from "antd"
import { FormattedMessage, useIntl } from "umi"
import { ColorResult, BlockPicker } from "react-color"

export interface CreationModalValue {
  name: string
  type?: string
  description?: string
  color?: string
}

export interface CreationModalProps {
  name?: string
  title: string
  visible: boolean
  onSubmit: (value: CreationModalValue) => void
  onCancel: () => void
  colorSelector?: boolean
  initialValues?: CreationModalValue
  typeSelector?: string[]
  isTypeSelector?: boolean
}

const formItemLayout = {
  labelCol: { offset: 2, span: 4 },
  wrapperCol: { span: 16 },
}

const { Option } = Select;

export const CreationModal = (props: CreationModalProps) => {
  const [form] = Form.useForm<CreationModalValue>()
  const [color, setColor] = useState<string>()

  const intl = useIntl()

  const onCancel = () => {
    form.resetFields()
    props.onCancel()
  }
  const onOk = () => {

    form
      .validateFields()
      .then((values: any) => {
        // console.log(values)
        form.resetFields()
        props.onSubmit(values)
      })
  }

  const onSelectColor = (value: ColorResult) =>
    setColor(value.hex)

  const onSelectColorComplete = (value: ColorResult) =>
    form.setFieldsValue({ color: value.hex })

  return (
    <Modal
      visible={props.visible}
      title={props.title}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose
      forceRender
    >
      <Form
        form={form}
        name={props.name}
        initialValues={props.initialValues}
        {...formItemLayout}
      >
        <Form.Item
          name="name"
          label={<FormattedMessage id="gallery.component.general5" />}
          rules={[{ required: true, message: intl.formatMessage({ id: "gallery.component.category-config-table18" }) }]}
        >
          <Input placeholder={intl.formatMessage({ id: "gallery.component.category-config-table20" })} />
        </Form.Item>
        {props.isTypeSelector ? <Form.Item
          name="type"
          label={<FormattedMessage id="gallery.component.general61" />}
          rules={[{ required: true, message: intl.formatMessage({ id: "gallery.component.category-config-table19" }) }]}
        >
          <Select placeholder={intl.formatMessage({ id: "gallery.component.category-config-table21" })} >
            {props.typeSelector?.map(type => {
              return <Option key={type} value={type}>
                {intl.formatMessage({ id: `gallery.component.category-config-table_type-${type}` })} </Option>
            })}
          </Select>
        </Form.Item>
          : <Form.Item
            name="description"
            label={<FormattedMessage id="gallery.component.general6" />}
          >
            <Input placeholder={intl.formatMessage({ id: "gallery.component.category-config-table22" })} />
          </Form.Item>}
        {
          props.colorSelector ?
            <Form.Item
              name="color"
              label={<FormattedMessage id="gallery.component.general15" />}
            >
              <BlockPicker
                color={color}
                onChange={onSelectColor}
                onChangeComplete={onSelectColorComplete}
                triangle="hide"
                width="100%"
              />
            </Form.Item> :
            <></>
        }
      </Form>
    </Modal>
  )
}

CreationModal.defaultProps = {
  colorSelector: false
} as Partial<CreationModalProps>
