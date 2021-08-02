/**
 * Created by Jacob Xie on 10/29/2020.
 */

import { Button, Input, InputNumber, Select, Space } from "antd"
import { FormattedMessage } from "umi"
import { CheckCircleTwoTone, CloseCircleTwoTone, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'


interface EditFieldProps<T extends string | number> {
  editable: boolean
  placeholder?: string
  selections?: string[]
  defaultValue?: T
  onChange: (value: T) => void
}

interface StateFieldProps {
  state: boolean
}

interface OperationFieldProps {
  editable: boolean
  onUpdateClick: () => void
  onDeleteClick: () => void
  onCheckClick: () => void
  onReloadClick: () => void
  disabled: boolean
}
export enum CategoryType {
  dashboard = "dashboard",
  temp_lib = "temp_lib"
}

export enum CategoryTypeColor {
  dashboard = "rgba(131,137,150, 0.7)",
  temp_lib = "#5fa8d3"
}

export const StringField = (props: EditFieldProps<string>) =>
  props.editable ?
    <Input
      size="small"
      style={{ width: 150 }}
      placeholder={props.placeholder}
      defaultValue={props.defaultValue}
      onChange={e => props.onChange(e.target.value)}
    /> :
    <span>{props.defaultValue}</span>

export const NumberField = (props: EditFieldProps<number>) =>
  props.editable ?
    <InputNumber
      size="small"
      style={{ width: 150 }}
      placeholder={props.placeholder}
      defaultValue={props.defaultValue}
      onChange={v => props.onChange(+v!)}
      precision={0}
    /> :
    <span>{props.defaultValue}</span>

export const SelectionField = (props: EditFieldProps<string>) =>
  props.editable ?
    <Select
      size="small"
      style={{ width: 150 }}
      defaultValue={props.defaultValue}
      onChange={e => props.onChange(e.toString())}
    >
      {
        props.selections!.map((s, idx) =>
          <Select.Option value={s} key={idx}>{s}</Select.Option>
        )
      }
    </Select> :
    <span>{props.defaultValue}</span>

export const StateField = (props: StateFieldProps) =>
  props.state ?
    <CheckCircleTwoTone twoToneColor="green" /> :
    <CloseCircleTwoTone twoToneColor="red" />

export const PasswordField = (props: EditFieldProps<string>) =>
  props.editable ?
    <Input.Password
      size="small"
      style={{ width: 150 }}
      placeholder="password"
      defaultValue={props.defaultValue}
      iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
      onChange={e => props.onChange(e.target.value)}
    /> :
    <span>******</span>

export const OperationField = (props: OperationFieldProps) =>
  props.editable ?
    <Space>
      <Button
        size="small"
        type="primary"
        onClick={props.onUpdateClick}
        disabled={props.disabled}
      >
        <FormattedMessage id="gallery.component.general13" />
      </Button>
      <Button
        size="small"
        danger
        onClick={props.onDeleteClick}
        disabled={props.disabled}
      >
        <FormattedMessage id="gallery.component.general23" />
      </Button>
    </Space> :
    <Space>
      <Button
        size="small"
        type="primary"
        onClick={props.onCheckClick}
      >
        <FormattedMessage id="gallery.component.general24" />
      </Button>
      <Button
        size="small"
        onClick={props.onReloadClick}
      >
        <FormattedMessage id="gallery.component.general25" />
      </Button>
    </Space>

