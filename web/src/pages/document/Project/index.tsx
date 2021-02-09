/**
 * Created by Jacob Xie on 2/9/2021.
 */

import React from "react"
import {Typography} from "antd"
import {PageContainer} from "@ant-design/pro-layout"
import {FormattedMessage} from "umi"

import connectorNodeV1 from "@opuscapita/react-filemanager-connector-node-v1"
import {FileManager, FileNavigator} from "@opuscapita/react-filemanager"


const apiOptions = {
  ...connectorNodeV1.apiOptions,
  apiRoot: "/api/cyberbrick",
}

export default () => {

  return (
    <PageContainer>
      <Typography>
        <Typography.Title>
          <FormattedMessage id="pages.document.project.title1"/>
        </Typography.Title>

        <FileManager style={{height: '60vh'}}>
          <FileNavigator
            api={connectorNodeV1.api}
            apiOptions={apiOptions}
            listViewLayout={connectorNodeV1.listViewLayout}
            viewLayoutOptions={connectorNodeV1.viewLayoutOptions}
          />
        </FileManager>
      </Typography>
    </PageContainer>
  )
}

