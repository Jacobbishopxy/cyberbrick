/**
 * Created by Jacob Xie on 8/17/2020.
 */

import React from "react"
import ReactQuill from "react-quill"

import 'react-quill/dist/quill.bubble.css'

export interface DisplayPresenterProps {
  content: string
}

export const TexEditorPresenter = (props: DisplayPresenterProps) =>
  <ReactQuill
    theme="bubble"
    value={ props.content }
    readOnly
  />
