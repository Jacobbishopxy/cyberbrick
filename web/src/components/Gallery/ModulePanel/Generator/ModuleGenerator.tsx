/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React, {forwardRef, useImperativeHandle, useState} from 'react'

import {ConvertProps, ConvertFwRef, ConvertRefProps, ModuleEditorField, ModulePresenterField} from "./data"
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
      const [editable, setEditable] = useState<boolean>()
      const {forceStyle} = this

      useImperativeHandle(crProps.forwardedRef, () => ({
        edit: setEditable
      }))

      return editable ?
        <this.editor
          content={crProps.content}
          fetchStorages={crProps.fetchStorages}
          fetchTableList={crProps.fetchTableList}
          fetchTableColumns={crProps.fetchTableColumns}
          contentHeight={crProps.contentHeight}
          updateContent={crProps.updateContent}
          styling={forceStyle ? crProps.styling : styles.editorField}
        /> :
        <this.presenter
          content={crProps.content}
          fetchQueryData={crProps.fetchQueryData}
          contentHeight={crProps.contentHeight}
          styling={crProps.styling}
        />
    }

    return forwardRef((props: ConvertProps, ref: React.Ref<ConvertFwRef>) =>
      <ConvertRef
        content={props.content}
        fetchStorages={props.fetchStorages}
        fetchTableList={props.fetchTableList}
        fetchTableColumns={props.fetchTableColumns}
        fetchQueryData={props.fetchQueryData}
        contentHeight={props.contentHeight}
        updateContent={props.updateContent}
        styling={props.styling}
        forwardedRef={ref}
      />
    )
  }
}

