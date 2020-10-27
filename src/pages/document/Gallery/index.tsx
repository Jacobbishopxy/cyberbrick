/**
 * Created by Jacob Xie on 9/17/2020.
 */

import React from 'react'
import { PageContainer } from '@ant-design/pro-layout'


const srcGallery = "/api/collection/document/gallery"

export default () => {

  return (
    <PageContainer>
      <img src={srcGallery} alt="gallery" width="100%" height="100%"/>
    </PageContainer>
  )
}

