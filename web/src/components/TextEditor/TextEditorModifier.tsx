/**
 * Created by Jacob Xie on 8/17/2020.
 */

import React, {useEffect, useState} from 'react'
import ReactQuill, {Quill} from 'react-quill'

import 'react-quill/dist/quill.snow.css'

const CustomToolbar = () => (
  <div id="toolbar">
    <select className="ql-header" aria-label="ql-header"/>
    <select className="ql-font">
      <option value="arial">Arial</option>
      <option value="comic-sans">Comic Sans</option>
      <option value="courier-new">Courier New</option>
      <option value="georgia">Georgia</option>
      <option value="helvetica">Helvetica</option>
      <option value="lucida">Lucida</option>
    </select>
    <select className="ql-size">
      <option value="16px">16px</option>
      <option value="24px">24px</option>
      <option value="32px">32px</option>
      <option value="48px">48px</option>
      <option value="100px">100px</option>
      <option value="150px">150px</option>
      <option value="200px">200px</option>
    </select>
    <button className="ql-align" value='' aria-label="ql-align" type="button"/>
    <button className="ql-align" value='center' aria-label="ql-align" type="button"/>
    <button className="ql-align" value='right' aria-label="ql-align" type="button"/>
    <button className="ql-align" value='justify' aria-label="ql-align" type="button"/>
    <button className="ql-bold" aria-label="ql-bold" type="button"/>
    <button className="ql-italic" aria-label="ql-italic" type="button"/>
    <button className="ql-underline" aria-label="ql-underline" type="button"/>
    <button className="ql-strike" aria-label="ql-strike" type="button"/>
    <button className="ql-blockquote" aria-label="ql-blockquote" type="button"/>
    <button className="ql-code-block" aria-label="ql-code-block" type="button"/>
    <button className="ql-list" value='ordered' aria-label="ql-list" type="button"/>
    <button className="ql-list" value='bullet' aria-label="ql-list" type="button"/>
    <button className="ql-indent" value='-1' aria-label="ql-indent" type="button"/>
    <button className="ql-indent" value='+1' aria-label="ql-indent" type="button"/>
    <select className="ql-color" aria-label="ql-color"/>
    <select className="ql-background" aria-label="ql-background"/>
    <button className="ql-link" aria-label="ql-link" type="button"/>
    <button className="ql-image" aria-label="ql-image" type="button"/>
  </div>
)

const Size = Quill.import('attributors/style/size')
Size.whitelist = [
  "16px",
  "24px",
  "32px",
  "48px",
  "100px",
  "150px",
  "200px",
]
Quill.register(Size, true)


const modules = {
  toolbar: {
    container: '#toolbar',
  }
}

const formats = [
  'header',
  'font',
  'size',
  'align',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'code-block',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'color',
  'background',
]


export interface TextEditorModifierProps {
  onSave?: (value: string) => void
  onChange?: (value: string) => void
  content?: string
  style?: React.CSSProperties
  styling?: string
}


export const TextEditorModifier = (props: TextEditorModifierProps) => {

  const style = props.styling ? props.styling : undefined

  const [content, setContent] = useState<string | undefined>(props.content)

  useEffect(() => {
    if (content && props.onChange) props.onChange(content)
  }, [content])

  return (
    <div className={style} >
      <CustomToolbar/>
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        value={content}
        onChange={setContent}
        style={props.style}
      />
    </div>
  )
}

TextEditorModifier.defaultProps = {
  saveButton: false
} as Partial<TextEditorModifierProps>

