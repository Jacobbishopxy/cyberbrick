/**
 * Created by Jacob Xie on 12/8/2021
 */

import {useRef, useState} from "react"
import {FormattedMessage} from "umi"
import {Card, Switch} from "antd"

import * as DataType from "@/components/Gallery/GalleryDataType"
import {FileView} from "@/components/Gallery/ModulePanel/Collections/file/FileView"
import {ConvertFwRef} from "@/components/Gallery/ModulePanel/Generator/data"


export default () => {

  const moduleFwRef = useRef<ConvertFwRef>(null)

  const [content, setContent] = useState<DataType.Content>()

  const switchOnClick = (v: boolean) => {
    if (moduleFwRef.current) moduleFwRef.current.edit(v)
  }


  return (
    <Card
      title={<FormattedMessage id="gallery.page.demo.module-test.title" />}
      extra={
        <Switch
          onClick={switchOnClick}
        />
      }
      style={{height: "85vh"}}
      bodyStyle={{height: "100%"}}
    >
      <FileView
        editable={true}
        onSave={(v: string) => {
          console.log(v)
        }}
        content={content}
        contentHeight={500}
        setContent={(v) => {
          console.log(v)
        }}
      />
    </Card>
  )
}

