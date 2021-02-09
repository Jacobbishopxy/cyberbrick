/**
 * Created by Jacob Xie on 2/6/2021
 */

import React, {useState} from "react"
import { Modal} from "antd";
import {useIntl} from "umi"

import {TagModificationModalProps, GenericTag} from "./data"
import {EditableTagPanel} from "@/components/Gallery/Tag"


export const TagModificationModal = (props: TagModificationModalProps) => {
  const intl = useIntl()
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState<GenericTag[]>()

  const onSubmit = () => {
    if (data) {
      props.onSubmit(data)
      setVisible(false)
    }
  }

  return (
    <>
      <>
        {props.trigger({onClick: () => setVisible(true)})}
      </>
      <Modal
        title={intl.formatMessage({id: "component.article.tagModificationModal.title"})}
        visible={visible}
        onOk={onSubmit}
        onCancel={() => setVisible(false)}
        maskClosable={false}
        width={props.modalWidth}
        bodyStyle={{height: props.modalHeight}}
      >
        <EditableTagPanel<GenericTag>
          textCreation={"create tag"}
          textModification={"modify tag"}
          textDeletion={"delete tag"}
          data={props.tags}
          editable={true}
          elementOnChange={setData}
          draggable={false}
          colorSelector
        />
      </Modal>
    </>
  )
}

