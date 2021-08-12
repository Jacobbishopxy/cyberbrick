/**
 * Created by Jacob Xie on 10/3/2020.
 */

import { useEffect, useState } from "react"

import { TextEditorModifier, TextEditorPresenter } from "@/components/TextEditor"
import { ModuleGenerator } from "../../Generator/ModuleGenerator"
import { ModuleEditorField, ModulePresenterField } from "../../Generator/data"
import * as DataType from "../../../GalleryDataType"
import _ from "lodash";
import { MongoContentValidation } from "./mediaUtil"


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

  // const [data, setData] = useState<any>()

  //TODO: when should we fetch?
  useEffect(() => {
    // console.log(props.setShouldQuery)
    //if we should and could query from db, do the query
    if (props.shouldQuery && props.setShouldQuery &&
      props.fetchQueryData && props.content && MongoContentValidation(props.content?.data)) {
      props.fetchQueryData(props.content).then((res: any) => {
        // console.log(res)
        //update content so that editor can share the default value
        props.updateContent({
          ...props.content, data: res,
          date: props.content?.date || DataType.today() //create date if not exist
        })
      }).then(() => {
        // console.log("setting should query to false...")
        props.setShouldQuery!(false)
      })

      //no matter fetch query succeed or not, or what we've received, set shouldQuery to false to inform parent we've finish fetching
    }
  }, [props.shouldQuery])

  return <TextEditorPresenter
    content={props.content?.data?.text || ""}
    styling={props.styling}
    style={{ height: props.contentHeight }}
  />
}


export const Text = new ModuleGenerator(EditorField, PresenterField, true).generate()

