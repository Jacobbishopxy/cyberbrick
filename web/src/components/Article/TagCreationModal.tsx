/**
 * Created by Jacob Xie on 2/5/2021
 */

import {useState} from "react"
import {useIntl} from "umi"

import {TagCreationModalProps, GenericTag} from "./data"
import {CreationModal} from "@/components/Gallery/Misc/CreationModal"


export const TagCreationModal = (props: TagCreationModalProps) => {
  const intl = useIntl()
  const [visible, setVisible] = useState(false)

  return (
    <>
      <>
        {props.trigger({onClick: () => setVisible(true)})}
      </>
      <CreationModal
        title={intl.formatMessage({id: "component.article.tagCreationModal.title"})}
        visible={visible}
        onSubmit={v => {
          props.onSubmit(v as GenericTag)
          setVisible(false)
        }}
        onCancel={() => setVisible(false)}
        colorSelector
      />
    </>
  )
}

