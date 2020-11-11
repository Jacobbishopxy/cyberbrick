/**
 * Created by Jacob Xie on 9/24/2020.
 */

import React from 'react'
import {PageContainer} from '@ant-design/pro-layout'


const srcGallery = "/api/document/rocket"

export default (): React.ReactNode => (
  <PageContainer>
    <div style={{textAlign: "center"}}>
      <img src={srcGallery} alt="rocket" height="800vh"/>
    </div>
  </PageContainer>
)
