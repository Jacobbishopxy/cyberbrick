/**
 * Created by Jacob Xie on 1/13/2021
 */

import {useRef, useState} from "react"
import {Button} from "antd"
import {ModalForm, ProFormText} from "@ant-design/pro-form"
import {FormattedMessage, useIntl} from "umi"
import {FileManager, FileNavigator} from "@opuscapita/react-filemanager"
import connectorNodeV1 from "@opuscapita/react-filemanager-connector-node-v1"

import {ModuleGenerator} from "../../Generator/ModuleGenerator"
import {ModuleEditorField, ModulePresenterField} from "../../Generator/data"
import * as DataType from "../../../GalleryDataType"
import {linkToExternalAddress} from "./linkToExternalAddress"


const apiOptions = {
  ...connectorNodeV1.apiOptions,
  apiRoot: "/api/fm",
}

interface Capabilities {
  canAddChildren: boolean
  canCopy: boolean
  canDelete: boolean
  canDownload: boolean
  canEdit: boolean
  canListChildren: boolean
  canRemoveChildren: boolean
  canRename: boolean
}

interface Ancestor {
  id: string
  parentId?: string
  ancestors: Ancestor[]
  capabilities: Capabilities
  name?: string
  createdTime: string
  modifiedTime: string
  type: string
}

const EditorField = (props: ModuleEditorField) => {
  const intl = useIntl()
  const [content, setContent] = useState<DataType.Content | undefined>(props.content)
  const [resource, setResource] = useState<Ancestor>()

  const onSubmit = async (values: Record<string, any>) => {
    const ctt = {
      ...content,
      date: content?.date || DataType.today(),
      data: {...values, locationId: resource!.id}
    }
    setContent(ctt)
    props.updateContent(ctt)

    return true
  }

  return (
    <div className={props.styling}>
      <ModalForm
        title={intl.formatMessage({id: "gallery.component.module-panel.collections.file-view1"})}
        trigger={<Button type="primary">Create</Button>}
        onFinish={onSubmit}
        modalProps={{width: "80vw"}}
      >
        <ProFormText
          name="link"
          label={<FormattedMessage id="gallery.component.module-panel.collections.file-view1"/>}
        />

        <FileManager style={{height: '60vh'}}>
          <FileNavigator
            api={connectorNodeV1.api}
            apiOptions={apiOptions}
            initialResourceId={
              content && content.data && content.data.locationId ?
                content.data.locationId : undefined
            }
            listViewLayout={connectorNodeV1.listViewLayout}
            viewLayoutOptions={connectorNodeV1.viewLayoutOptions}
            onResourceChange={setResource}
          />
        </FileManager>
      </ModalForm>
    </div>
  )
}

const PresenterField = (props: ModulePresenterField) => {
  const linkRef = useRef<any>(null)

  const capabilities = () => [
    {
      id: "external-link",
      icon: {svg: linkToExternalAddress},
      label: "Link",
      shouldBeAvailable: () => !!props.content?.data.link,
      availableInContexts: ["toolbar"],
      handler: () => linkRef.current.click()
    }
  ]

  return props.content && props.content.data && props.content.data.locationId ?
    <>
      <a
        rel="noopener noreferrer"
        target="_blank"
        href={props.content.data.link}
        ref={linkRef}
      />
      <FileManager style={{height: props.contentHeight}}>
        <FileNavigator
          api={connectorNodeV1.api}
          apiOptions={apiOptions}
          capabilities={capabilities}
          initialResourceId={props.content.data.locationId}
          listViewLayout={connectorNodeV1.listViewLayout}
          viewLayoutOptions={connectorNodeV1.viewLayoutOptions}
        />
      </FileManager>
    </> : <></>
}

export const FileView = new ModuleGenerator(EditorField, PresenterField).generate()

