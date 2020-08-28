/**
 * Created by Jacob Xie on 8/26/2020.
 */

import React, { useEffect, useState } from "react"
import { Button, DatePicker, Divider, Form, Input, Select, Space } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import moment from "moment"

import { TextEditorModifier } from "@/components/TextEditor"
import { TagsSelectorProps, NewArticleFormProps } from "./data"

const dateFormat = "YYYY-MM-DD HH:mm:ss"

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 20 },
}
const tailLayout = {
  wrapperCol: { offset: 2, span: 20 },
}

const TagsSelector = (props: TagsSelectorProps) =>
  <Select
    mode="multiple"
    placeholder="Select tags"
    onChange={ props.onChange }
    allowClear
    dropdownRender={ t => (
      <div>
        { t }
        <Divider style={ { margin: '4px 0' } }/>
        <div style={ { display: 'flex', flexWrap: 'nowrap', padding: 8 } }>
          <Input
            size="small"
            style={ { flex: 'auto' } }
            onBlur={ e => props.onAddNewTagInputChange(e.target.value) }
          />
          <a
            style={ { flex: 'none', padding: 8, display: 'block', cursor: 'pointer' } }
            onClick={ props.onAddNewTag }
          >
            <PlusOutlined/> New tag
          </a>
        </div>
      </div>
    ) }
  >
    {
      props.tags.map(t =>
        <Select.Option key={ t.name } value={ t.name }>
          { t.name }
        </Select.Option>
      )
    }
  </Select>

export const NewArticleForm = (props: NewArticleFormProps) => {
  const [form] = Form.useForm()

  const [tags, setTags] = useState<API.Tag[]>(props.tags)
  const [newTag, setNewTag] = useState<string>()
  const [date, setDate] = useState<moment.Moment>(moment())

  useEffect(() => {
    setTags(props.tags)
  }, [props.tags])

  useEffect(() => {
    if (date) form.setFieldsValue({ date: date.format(dateFormat) })
  }, [date])

  const onTextChange = (value: string) =>
    form.setFieldsValue({ text: value })

  const onAddNewTag = () => {
    if (newTag !== undefined) setTags([...tags, { name: newTag }])
  }

  const onTagsChange = (value: string[]) => {
    const t = value.map(i => ({ name: i }))
    form.setFieldsValue({ tags: t })
  }

  const onReset = () => form.resetFields()
  const onFinish = (values: any) => {
    const d = {
      category: { name: props.categoryName },
      ...values
    } as API.Article
    props.onSubmit(d)
    onReset()
  }

  return (
    <Form { ...layout } form={ form } onFinish={ onFinish }>
      <Form.Item
        name="title"
        label="Title"
        rules={ [{ required: true, message: "Title is required" }] }
      >
        <Input placeholder="Place target title here"/>
      </Form.Item>
      <Form.Item
        name="text"
        label="Text"
        rules={ [
          { required: true, message: "Text is required" },
          { validator: (r, v, c) => v ? c() : c() }
        ] }
      >
        <TextEditorModifier onChange={ onTextChange }/>
      </Form.Item>
      <Form.Item name="tags" label="Tags">
        <TagsSelector
          tags={ tags }
          onChange={ onTagsChange }
          onAddNewTagInputChange={ setNewTag }
          onAddNewTag={ onAddNewTag }
        />
      </Form.Item>
      <Form.Item name="date" label="Date">
        <div>
          <DatePicker
            format={ dateFormat }
            onSelect={ setDate }
            value={ date }
          />
        </div>
      </Form.Item>
      <Form.Item { ...tailLayout }>
        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={ onReset }>
            Reset
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}
