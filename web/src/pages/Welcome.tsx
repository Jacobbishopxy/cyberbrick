/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React from "react"

import connectorNodeV1 from "@opuscapita/react-filemanager-connector-node-v1"
import {FileManager, FileNavigator} from "@opuscapita/react-filemanager"


const apiOptions = {
  ...connectorNodeV1.apiOptions,
  apiRoot: "/api/cyberbrick",
}

export default () => {

  return (
    <FileManager style={{height: '60vh'}}>
      <FileNavigator
        api={connectorNodeV1.api}
        apiOptions={apiOptions}
        listViewLayout={connectorNodeV1.listViewLayout}
        viewLayoutOptions={connectorNodeV1.viewLayoutOptions}
      />
    </FileManager>
  )
}

