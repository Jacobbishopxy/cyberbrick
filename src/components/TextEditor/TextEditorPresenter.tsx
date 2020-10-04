/**
 * Created by Jacob Xie on 8/17/2020.
 */

import React from "react"
import ReactQuill from "react-quill"

import 'react-quill/dist/quill.bubble.css'

export interface DisplayPresenterProps {
  content: string
  styling?: string
}

export const TextEditorPresenter = (props: DisplayPresenterProps) => {

  const style = props.styling ? props.styling : undefined

  return <ReactQuill
    className={ style }
    theme="bubble"
    value={ props.content }
    readOnly
  />
}
