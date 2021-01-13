/**
 * Created by Jacob Xie on 11/25/2020
 */

import React, {useState} from 'react'
import {Button, Space} from "antd"
import {FileManager, FileNavigator} from '@opuscapita/react-filemanager'
import connectorNodeV1 from '@opuscapita/react-filemanager-connector-node-v1'


const apiOptions  = {
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


export default () => {

  const [resource, setResource] = useState<Ancestor>()
  const [currentResourceId, setCurrentResourceId] = useState<string>()


  const onButtonClick = () => {
    if (resource) {
      setCurrentResourceId(resource.id)
    }
  }

  return (
    <div style={{height: '80vh'}}>
      <Space direction="horizontal">
        <Button
          type="primary"
          onClick={onButtonClick}
        >
          Inform
        </Button>
        <h1>{currentResourceId}</h1>
      </Space>

      <FileManager>
        <FileNavigator
          id="fm-dev"
          api={connectorNodeV1.api}
          apiOptions={apiOptions}
          initialResourceId={currentResourceId}
          listViewLayout={connectorNodeV1.listViewLayout}
          viewLayoutOptions={connectorNodeV1.viewLayoutOptions}
          onResourceChange={setResource}
        />
      </FileManager>
    </div>
  )
}

