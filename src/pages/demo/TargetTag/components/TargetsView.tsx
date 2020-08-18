import { List, Button, Form, Input, Select, Divider, Space } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import React, { useEffect, useState } from "react"
import _ from "lodash"
import { TextEditorModifier, TextEditorPresenter } from "@/components/TextEditor"

import * as service from "@/services/targetTag"
import { TagsView } from "./TagsView"
import * as propsData from "./data"

/**
 * Created by Jacob Xie on 8/16/2020.
 */


const getExcludeTags = (all: string[], have: service.Tag[]): string[] =>
  _.difference(all, have.map(i => i.name))


const SingleTargetView = (props: propsData.SingleTargetViewProps) => {

  const [target, setTarget] = useState<service.Target>(props.target)
  const [targetEditable, setTargetEditable] = useState<boolean>(false)

  useEffect(() => {
    setTarget(props.target)
  }, [props.target])

  const doneEdit = () => {
    if (target && props.targetOnModify)
      props.targetOnModify(target).then()
    setTargetEditable(false)
  }

  const targetTextOnChange = (text: string) =>
    setTarget({ ...target, text })

  const targetTagOnChange = (tags: service.Tag[]) =>
    setTarget({ ...target, tags })

  const displayView = (
    <>
      <List.Item.Meta
        title={
          <div style={ { display: 'flex', justifyContent: 'space-between' } }>
            <div>{ target.title }</div>
            <div>{ target.id }</div>
          </div>
        }
        description={
          <div>
            <TextEditorPresenter
              content={ target.text }
            />
            <br/>
            <TagsView
              tags={ target.tags! }
              editable={ false }
            />
          </div>
        }
        style={ { marginRight: 10 } }
      />
      {
        props.editable ?
          <a
            onClick={ () => setTargetEditable(true) }
            style={ { height: 20 } }
          >
            Edit
          </a> :
          <div/>
      }
    </>
  )

  const editView = (
    <>
      <List.Item.Meta
        title={
          <div style={ { display: 'flex', justifyContent: 'space-between' } }>
            <div>{ target.title }</div>
            <div>{ target.id }</div>
          </div>
        }
        description={
          <div>
            <TextEditorModifier
              onSave={ targetTextOnChange }
              content={ target.text }
            />
            <br/>
            <TagsView
              isTagPanel={ false }
              tags={ target.tags! }
              tagsNameExclude={ getExcludeTags(props.tagsName, target.tags!) }
              editable
              tagsOnChange={ targetTagOnChange }
            />
          </div>
        }
        style={ { marginRight: 10 } }
      />
      <a onClick={ doneEdit }>Done</a>
    </>
  )

  return (
    <List.Item key={ target.id } style={ { display: 'flex', justifyContent: 'space-between' } }>
      { targetEditable && props.editable ? editView : displayView }
    </List.Item>
  )
}

const TagsSelector = (props: propsData.TagsSelectorProps) =>
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

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { offset: 4, span: 16 },
}

const NewTargetForm = (props: propsData.NewTargetFormProps) => {

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

export const TargetsView = (props: propsData.TargetsViewProps) => {

  const tagsName = props.tags.map(i => i.name)

  return (
    <>
      <List
        itemLayout="vertical"
        dataSource={ props.targets }
        renderItem={ item =>
          <SingleTargetView
            tagsName={ tagsName }
            target={ item }
            editable={ props.editable }
            targetOnModify={ props.targetOnCreate }
          />
        }
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

