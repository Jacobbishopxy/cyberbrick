/**
 * Created by Jacob Xie on 2/9/2021.
 */

import {Typography} from "antd"
import {FormattedMessage} from "umi"
import connectorNodeV1 from "@opuscapita/react-filemanager-connector-node-v1"
import {FileManager, FileNavigator} from "@opuscapita/react-filemanager"


const apiOptions = {
  ...connectorNodeV1.apiOptions,
  apiRoot: "/api/cyberbrick",
}

export default () => {

  return (
    <Typography style={{width: "100%"}}>
      <Typography.Title>
        <FormattedMessage id="pages.document.project.title1"/>
      </Typography.Title>

      <FileManager style={{height: '80vh'}}>
        <FileNavigator
          api={connectorNodeV1.api}
          apiOptions={apiOptions}
          listViewLayout={connectorNodeV1.listViewLayout}
          viewLayoutOptions={connectorNodeV1.viewLayoutOptions}
        />
      </FileManager>
    </Typography>
  )
}

