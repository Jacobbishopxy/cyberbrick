/**
 * Created by Jacob Xie on 11/25/2020
 */

import React, {useState} from 'react'

import {FileExtractModal} from "@/components/FileUploadModal"
import {fileExtract} from "@/components/Gallery/Misc/FileUploadConfig"
import {Button} from "antd"




export default () => {
  const [uploadVisible, setUploadVisible] = useState<boolean>(false)

  const uploadResHandle = (v: any) => console.log(v)

  return (

    <>
      <Button onClick={() => setUploadVisible(true)}>
        Click
      </Button>
      <FileExtractModal
        setVisible={setUploadVisible}
        visible={uploadVisible}
        upload={fileExtract}
        uploadResHandle={uploadResHandle}
      />
    </>
  )
}

