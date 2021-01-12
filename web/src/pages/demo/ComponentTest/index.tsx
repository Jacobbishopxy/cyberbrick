/**
 * Created by Jacob Xie on 11/25/2020
 */

import React from 'react'
import { FileManager, FileNavigator } from '@opuscapita/react-filemanager'
import connectorNodeV1 from '@opuscapita/react-filemanager-connector-node-v1'


const apiOptions = {
  ...connectorNodeV1.apiOptions,
  apiRoot: "/api/fm"
}


export default () => {


  return (
    <div style={{height: '480px'}}>
      <FileManager>
        <FileNavigator
          id="fm-dev"
          api={connectorNodeV1.api}
          apiOptions={apiOptions}
          capabilities={connectorNodeV1.capabilities}
          listViewLayout={connectorNodeV1.listViewLayout}
          viewLayoutOptions={connectorNodeV1.viewLayoutOptions}
        />
      </FileManager>
    </div>
  )
}

