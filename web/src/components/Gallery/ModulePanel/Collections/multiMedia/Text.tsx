/**
 * Created by Jacob Xie on 10/3/2020.
 */

import { useEffect, useState } from "react"

import { TextEditorModifier, TextEditorPresenter } from "@/components/TextEditor"
import { ModuleGenerator } from "../../Generator/ModuleGenerator"
import { ModuleEditorField, ModulePresenterField } from "../../Generator/data"
import * as DataType from "../../../GalleryDataType"
import _ from "lodash";


const EditorField = (props: ModuleEditorField) => {
  const [content, setContent] = useState<DataType.Content | undefined>(props.content)

  //TODO: how to fetch content as defualt 
  // useEffect(() => {
  //   if (props.fetchQueryData && props.content) {
  //     if (!_.isEmpty(props.content.data))
  //       props.fetchQueryData(props.content).then((res: any) => setData(res))
  //   }
  // }, [props.content])

  const onChangeContent = (value: string) => {
    const ctt = content ? //if content.data is defined, only update text proprety
      { ...content, data: { ...content.data, text: value } } :
      { date: DataType.today(), data: { text: value } }
    const ctWithDb = { ...ctt, storageType: DataType.StorageType.MONGO }
    // console.log(ctWithDb)
    setContent(ctWithDb)
    props.updateContent(ctWithDb)
  }

  return (
    <TextEditorModifier
      onChange={onChangeContent}
      content={content && content.data ? content.data.text : null}
      styling={props.styling}
      style={{ height: props.contentHeight ? props.contentHeight - 50 : undefined }}
    />
  )
}

const PresenterField = (props: ModulePresenterField) => {

  const [data, setData] = useState<any>()

  useEffect(() => {
    console.log(props.content?.data)
    if (props.fetchQueryData && props.content && props.content.data?.id) {
      // console.log("line 51", !_.isEmpty(props.content.data))
      if (!_.isEmpty(props.content.data))
        props.fetchQueryData(props.content).then((res: any) => setData(res))
    }
  }, [props.content])

  return props.content && props.content.data && data ?
    <TextEditorPresenter
      content={props.content.data?.text || data.text}
      styling={props.styling}
      style={{ height: props.contentHeight }}
    /> : <></>
}


export const Text = new ModuleGenerator(EditorField, PresenterField, true).generate()

