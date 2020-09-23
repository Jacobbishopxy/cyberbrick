/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React, { forwardRef, useImperativeHandle, useState } from 'react'

import { ModuleGeneratorProps, ConvertRefProps, ConvertProps, ConvertRefFR } from "./data"
import * as DataType from "../../DataType"
import styles from "./Common.less"


export const ModuleGenerator = (mgProps: ModuleGeneratorProps) => {

  const ConvertRef: React.FC<ConvertRefProps> = (crProps: ConvertRefProps) => {
    const [editable, setEditable] = useState<boolean>(false)
    const [content, setContent] = useState<DataType.Content | undefined>(crProps.content)

    const updateContent = (c: DataType.Content) => {
      setContent(c)
      crProps.updateContent(c)
    }

    useImperativeHandle(crProps.forwardedRef, () => ({
      edit: () => setEditable(!editable)
    }))

    return !content || editable ?
      <mgProps.EditorField
        content={ content }
        updateContent={ updateContent }
        styling={ styles.editorField }
      /> :
      <mgProps.PresenterField
        content={ content }
        styling={ crProps.styling }
      />


  }

  return forwardRef((props: ConvertProps, ref: React.Ref<ConvertRefFR>) =>
    <ConvertRef
      content={ props.content }
      updateContent={ props.updateContent }
      forwardedRef={ ref }
      styling={ props.styling }
    />
  )
}

ModuleGenerator.defaultProps = {
  present: true
} as Partial<ModuleGeneratorProps>

