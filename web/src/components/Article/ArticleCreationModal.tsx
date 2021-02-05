/**
 * Created by Jacob Xie on 2/5/2021
 */

import React, {useState} from "react"
import {message, Modal, Select, Tag} from "antd"
import {useIntl} from "umi"

import {ArticleCreationModalProps, ArticleOutput} from "./data"
import {TextEditorModifier} from "@/components/TextEditor"


export const ArticleCreationModal = (props: ArticleCreationModalProps) => {
  const intl = useIntl()
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState<ArticleOutput>()

  const textOnChange = (value: string) => {
    setData({...data, value})
  }

  const tagsOnChange = (tagIds: string[]) => {
    setData({...data!, tagIds})
  }

  const onSubmit = () => {
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
        title={intl.formatMessage({id: "component.articleModal.articleModal.title"})}
        visible={visible}
        onOk={onSubmit}
        onCancel={() => setVisible(false)}
        maskClosable={false}
        width={props.modalWidth}
        bodyStyle={{height: props.modalHeight}}
      >
        <TextEditorModifier
          onChange={textOnChange}
          content={data?.value}
          style={{height: props.modalHeight ? `calc(${props.modalHeight} - 120px)` : undefined}}
        />
        <Select
          mode="multiple"
          showArrow
          style={{width: "100%"}}
          disabled={!data?.value}
          onChange={tagsOnChange}
          placeholder={intl.formatMessage({id: "component.articleModal.articleModal.select"})}
          options={props.tags?.map(t => ({
            key: t.id,
            label: <Tag color={t.color}>{t.name}</Tag>,
            value: t.id
          }))}
        />
      </Modal>
    </>
  )
}

