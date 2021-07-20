import { Content, today } from "@/components/Gallery/GalleryDataType"
import { ModuleEditorField, ModulePresenterField } from "@/components/Gallery/ModulePanel/Generator/data"
import { ModuleGenerator } from "@/components/Gallery/ModulePanel/Generator/ModuleGenerator"
import { useEffect, useState } from "react"
import { tabItem } from "./data"
import { NestedSimpleModuleEditor } from "./NestedSimpleModuleEditor"
import { NestedSimpleModulePresentor } from "./NestedSimpleModulePresentor"

// interface NSMEditorProps extends ModuleEditorField {
//   fetchContentFn: (id: string, date?: string) => Promise<Element>
//   fetchContentDatesFn: (id: string, markName?: string) => Promise<Element>
//   fetchQueryDataFn: (readOption: Content) => Promise<any>
// }
const defaultItems: tabItem[] = [0, 1, 2, 3, 4].map(function (i, key, list) {
  return {
    i: i.toString(),
    x: i,
    y: 0,
    w: 1,
    h: 1,
    isResizable: false,
    text: i.toString(),
    autoSize: true,
    static: true,
  };
})
const EditorField = (props: ModuleEditorField) => {
  //content type:tabItem[]
  /* for each item
  id: i
  layout attribute: x y w h
  module: SimpleEmbededModule {
    name: string,
    timeSeries: boolean,
    elementType: ElementType,
    content?: Content
}
  */

  let tempContent: Content;
  if (props.content) {
    tempContent = props.content
  }
  const [items, setItems] = useState<tabItem[]>(tempContent!.data as tabItem[] || defaultItems)
  const [saveCount, setSaveCount] = useState(0)

  useEffect(() => {
    props.updateContent({ ...props.content, date: today(), data: items })
    return () => {
      //
    }
  }, [saveCount])
  return (
    <div className={props.styling}>
      <NestedSimpleModuleEditor
        items={items as tabItem[]}
        setItems={setItems}
        setSaveCount={setSaveCount}
        fetchStoragesFn={props.fetchStorages!}
        fetchTableListFn={props.fetchTableList!}
        fetchTableColumnsFn={props.fetchTableColumns!}
        updateContentFn={props.updateContent}
        editable={true}
        styling={props.styling}
      />
    </div>
  )
}

const PresenterField = (props: ModulePresenterField) =>
  props.content ?
    <div className={props.styling}>
      <NestedSimpleModulePresentor
        //  updateContentFn={props.updateContent} 
        items={props.content?.data as tabItem[] || defaultItems}
        editable={false}
        styling={props.styling}
      />
    </div> : <></>

export default new ModuleGenerator(EditorField, PresenterField).generate()