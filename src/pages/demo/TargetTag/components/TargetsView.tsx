import { List, Button, Form, Input, Select, Divider, Space } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import React, { useEffect, useState } from "react"

import * as service from "@/services/targetTag"
import { TagsView } from "./TagsView"
import { NewTargetFormProps, TagsSelectorProps, TargetsViewProps } from "./data"

/**
 * Created by Jacob Xie on 8/16/2020.
 */

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { offset: 4, span: 16 },
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


const NewTargetForm = (props: NewTargetFormProps) => {

  const [tags, setTags] = useState<service.Tag[]>(props.tags)
  const [newTag, setNewTag] = useState<string>()


  useEffect(() => {
    setTags(props.tags)
  }, [props.tags])

  const [form] = Form.useForm()

  const onAddNewTag = () => {
    if (newTag !== undefined) setTags([...tags, { name: newTag }])
  }


  const onTagsChange = (value: string[]) => {
    const t = value.map(i => ({ name: i }))
    form.setFieldsValue({ tags: t })
  }

  const onFinish = (values: any) =>
    props.onSubmit(values as service.Target).then()


  const onReset = () => {
    form.resetFields()
  }

  return (
    <Form { ...layout } form={ form } onFinish={ onFinish }>
      <Form.Item name="title" label="Title" rules={ [{ required: true, message: "Title is required" }] }>
        <Input placeholder="Place target title here"/>
      </Form.Item>
      <Form.Item name="text" label="Text" rules={ [{ required: true, message: "Text is required" }] }>
        <Input placeholder="Place target text here"/>
      </Form.Item>
      <Form.Item name="tags" label="Tags">
        <TagsSelector
          tags={ tags }
          onChange={ onTagsChange }
          onAddNewTagInputChange={ setNewTag }
          onAddNewTag={ onAddNewTag }
        />
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

export const TargetsView = (props: TargetsViewProps) => {

  // const targetOnEdit = (target: service.Target) =>

  return (
    <>
      <List
        itemLayout="vertical"
        dataSource={ props.targets }
        renderItem={ item => (
          <List.Item key={ item.id } style={ { display: 'flex', justifyContent: 'space-between' } }>
            <List.Item.Meta
              title={ item.title }
              description={
                <div>
                  <div>{ item.text }</div>
                  <br/>
                  <TagsView
                    tags={ item.tags! }
                    editable={ props.editable }
                  />
                </div>
              }
            />
            {
              props.editable ?
                <a>Edit</a> :
                <></>
            }
          </List.Item>
        ) }
      />
      {
        props.editable ?
          <div>
            <Divider/>
            <NewTargetForm
              tags={ props.tags }
              onSubmit={ props.targetOnCreate! }
            />
          </div> :
          <></>
      }
    </>
  )
}

