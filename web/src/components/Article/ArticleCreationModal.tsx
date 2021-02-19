/**
 * Created by Jacob Xie on 2/5/2021
 */

import {useState} from "react"
import {DatePicker, Input, message, Modal, Select, Space, Tag} from "antd"
import {useIntl} from "umi"
import _ from "lodash"
import moment from "moment"

import {ArticleCreationModalProps, GenericArticle} from "./data"
import {TextEditorModifier} from "@/components/TextEditor"
import {SpaceBetween} from "@/components/SpaceBetween"


export const ArticleCreationModal = (props: ArticleCreationModalProps) => {
  const intl = useIntl()
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState<GenericArticle | undefined>(props.initialValue)

  const titleOnChange = (value: string) => {
    setData({...data!, title: value})
  }

  const dateOnChange = (dateString: string) => {
    setData({...data!, date: dateString})
  }

  const textOnChange = (value: string) => {
    setData({...data!, data: value})
  }

  const tagsOnChange = (tagIds: string[]) => {
    const tags = props.tags?.filter(t => tagIds.includes(t.id!))
    setData({...data!, tags: tags || []})
  }

  const onSubmit = () => {
    console.log("data: ", data)
    if (data) {
      props.onSubmit(data)
      setVisible(false)
    } else message.warn("Please enter your content!")
  }

  return (
    <>
      <>
        {props.trigger({onClick: () => setVisible(true)})}
      </>
      <Modal
        title={intl.formatMessage({id: "component.article.articleCreationModal.head"})}
        visible={visible}
        onOk={onSubmit}
        onCancel={() => setVisible(false)}
        maskClosable={false}
        width={props.modalWidth}
        bodyStyle={{height: props.modalHeight}}
      >
        <Space direction="vertical" style={{width: "100%"}}>
          <SpaceBetween>
            <Input
              defaultValue={data?.title}
              placeholder={intl.formatMessage({id: "component.article.articleCreationModal.title"})}
              onChange={e => titleOnChange(e.target.value)}
              style={{width: 400}}
            />
            <DatePicker
              defaultValue={data?.date ? moment(data.date) : undefined}
              onChange={(d, s) => dateOnChange(s)}
            />
          </SpaceBetween>

          <TextEditorModifier
            onChange={textOnChange}
            content={data?.data}
            style={{height: props.modalHeight ? `calc(${props.modalHeight} - 180px)` : undefined}}
          />

          <Select
            mode="multiple"
            showArrow
            style={{width: "100%"}}
            disabled={!data?.data}
            onChange={tagsOnChange}
            placeholder={intl.formatMessage({id: "component.article.articleCreationModal.select"})}
            defaultValue={
              _.reduce(props.initialValue?.tags, (acc: string[], v) =>
                v.id ? [...acc, v.id] : acc, []
              )
            }
          >
            {
              props.tags?.map((t, idx) =>
                <Select.Option key={idx} value={t.id!}>
                  <Tag color={t.color}>{t.name}</Tag>
                </Select.Option>
              )
            }
          </Select>
        </Space>
      </Modal>
    </>
  )
}

