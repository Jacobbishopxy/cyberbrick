/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import { ConvertProps, ConvertRefFR, ConvertRefProps, ModuleEditorField, ModulePresenterField } from "./data"
import * as DataType from "../../DataType"
import styles from "./Common.less"

export class ModuleGenerator {
  private editor: React.FC<ModuleEditorField>

  private presenter: React.FC<ModulePresenterField>

  private forceStyle: boolean

  constructor(editor: React.FC<ModuleEditorField>,
              presenter: React.FC<ModulePresenterField>,
              forceStyle: boolean = false) {
    this.editor = editor
    this.presenter = presenter
    this.forceStyle = forceStyle
  }

  public generate = () => {
    const ConvertRef: React.FC<ConvertRefProps> = (crProps: ConvertRefProps) => {
      const [editable, setEditable] = useState<boolean>(false)
      const [content, setContent] = useState<DataType.Content | undefined>(crProps.content)

      useEffect(() => setContent(crProps.content), [crProps.content])

      const updateContent = (c: DataType.Content) => {
        setContent(c)
        crProps.updateContent(c)
      }

      useImperativeHandle(crProps.forwardedRef, () => ({
        edit: () => setEditable(!editable)
      }))

      const { forceStyle } = this
      return editable ?
        <this.editor
          content={ content }
          updateContent={ updateContent }
          styling={ forceStyle ? crProps.styling : styles.editorField }
        /> :
        <this.presenter
          content={ content }
          styling={ crProps.styling }
        />
    }

    return forwardRef((props: ConvertProps, ref: React.Ref<ConvertRefFR>) =>
      <ConvertRef
        content={ props.content }
        updateContent={ props.updateContent }
        styling={ props.styling }
        forwardedRef={ ref }
      />
    )
  }
}

