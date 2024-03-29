// import { today } from "@/components/Gallery/GalleryDataType"
// import { ModuleEditorField, ModulePresenterField } from "@/components/Gallery/ModulePanel/Generator/data"
// import { ModuleGenerator } from "@/components/Gallery/ModulePanel/Generator/ModuleGenerator"
import { useEffect, useState, useImperativeHandle, forwardRef } from "react"
// import { tabItem } from "./data"
import { NestedModuleEditor } from "./Editor"
import './style.less'
import { NSMid } from "./util"
// import { prRef } from './data'

// const defaultItems: tabItem[] = [0].map(function (i) {
//     return {
//         i: today(),
//         x: i,
//         y: 0,
//         w: 1,
//         h: 1,
//         autoSize: true,
//         static: false,
//     }
// })
// const defaultData = { tabItems: defaultItems, currIndex: defaultItems[0].i }


//【小齿轮】编辑时
// const EditorField = (props: ModuleEditorField) => {
//     /* content type: 
//     currIndex: string (used to indicate the tab when entering)
//     tabItem: tabItem[]: 
//     for each item:
//         id: i
//         layout attribute: x y w h

//         tab content attribute:
//             tabContent: the content that will be displayed for a tab item
//             tabType: the type of the content
//             minDim: the minimal length between width and height. Used to calculate an item's font-size

//         module: SimpleEmbededModule {
//         name: string,
//         timeSeries: boolean,
//         elementType: ElementType,
//         content?: Content
//     }
//     */
//     // let tempIndex = props.content?.data?.currIndex
//     // if (!tempIndex) {
//     //     tempIndex = defaultData.currIndex
//     // }

//     // let tempItems: tabItem[] = props.content?.data?.tabItems
//     // if (!tempItems || tempItems.length === 0) {
//     //     tempItems = defaultData.tabItems
//     //     tempIndex = defaultData.currIndex
//     // }

//     // const [items, setItems] = useState<tabItem[]>(tempItems)
//     // const [currIndex, setCurrIndex] = useState(tempIndex)
//     // const [saveCount, setSaveCount] = useState(0)


//     // useEffect(() => {
//     // props.updateContent({
//     //     ...props.content, date: props.content?.date || today(),
//     //     data: { tabItems: items, currIndex: currIndex }
//     // })
//     // }, [saveCount])
//     return (
//         <div id={NSMid} style={{ height: '98%' }}>
{/* <NestedModuleEditor
    content={props.content}
    setContent={props.setContent}
    setNewestContent={props.setNewestContent}
    // currIndex={currIndex}
    // setCurrIndex={setCurrIndex}
    // items={items as tabItem[]}
    // setItems={setItems}
    // setSaveCount={setSaveCount}
    fetchStoragesFn={props.fetchStorages!}
    fetchTableListFn={props.fetchTableList!}
    fetchTableColumnsFn={props.fetchTableColumns!}
    fetchQueryDataFn={props.fetchQueryData!}
    // updateContentFn={props.updateContent}
    editable={true}
    NSMid={NSMid}
    contentHeight={props.contentHeight}
    fetchContentFn={props.fetchContentFn!}
    fetchContentDatesFn={props.fetchContentDatesFn!}
    parentInfo={props.parentInfo!}
    addElement={props.addElement!}
/> */}
//         </div>
//     )
// }

// const PresenterField = (props: ModulePresenterField) => {
//     // let tempItems: tabItem[] = []
//     // if (props.content) {
//     //     tempItems = props.content.data.tabItems as tabItem[]
//     // } else tempItems = []

//     // let tempIndex = ""
//     // if (props.content) {
//     //     tempIndex = props.content.data.currIndex
//     // }

//     // const [items, setItems] = useState<tabItem[]>(tempItems)
//     // const [currIndex, setCurrIndex] = useState(0)
//     // const [saveCount, setSaveCount] = useState(0)

//     /**
//      * when PresenterField first mounted, it's parent haven't mounted, so there's no
//      * content. When parent received content, update the items state for presentorField
//     */

//     // 获取
//     // useImperativeHandle(ref, () => {
//     //     return {
//     //         getTabItem: () => {
//     //             return items
//     //         }
//     //     }
//     // })
//     // useEffect(() => {
//     //     setItems(props.content?.data?.tabItems)
//     // }, [props.content?.data?.tabItems])

//     // useEffect(() => {
//     //     setCurrIndex(props.content?.data?.currIndex)
//     // }, [props.content?.data?.currIndex])

//     /**
//      * update currIndex
//      */
//     // useEffect(() => {
//     //     props.updateContent({ ...props.content, date: today(), data: { tabItems: items, currIndex: currIndex } })
//     // }, [saveCount])
//     // useEffect(() => {
//     //     console.log(123, items)
//     // }, [items])

//     // useImperativeHandle(crProps.forwardedRef, () => ({
//     //     items: items
//     // }))

//     //use Editor and set editable to false so that it can receive and update the new content fetched from db
//     return (props.content?.data?.tabItems ?
//         <div style={{ height: '98%' }}>
//             <NestedModuleEditor
//                 content={props.content}
//                 setContent={props.setContent}
//                 // setNewestContent={props.setNewestContent}
//                 // currIndex={currIndex}
//                 // setCurrIndex={setCurrIndex}
//                 // setItems={setItems}
//                 editable={false}
//                 NSMid={NSMid}
//                 contentHeight={props.contentHeight}
//                 fetchStoragesFn={() => Promise.resolve([])}
//                 fetchTableColumnsFn={(storageId, tableName) => Promise.resolve([])}
//                 fetchTableListFn={(id) => Promise.resolve([])}
//                 fetchQueryDataFn={props.fetchQueryData!}
//                 // updateContentFn={props.updateContent}
//                 // setSaveCount={setSaveCount}

//                 fetchContentFn={props.fetchContentFn!}
//                 fetchContentDatesFn={props.fetchContentDatesFn!}
//                 parentInfo={props.parentInfo}
//                 addElement={props.addElement!}
//             />
//         </div> : <></>)
// }
// export const NestedModule = new ModuleGenerator(EditorField, PresenterField).generate()
// export const NestedModule = () => {
//     return (
//         <div>789</div>
//     )
// }

// 重构
import * as DataType from "@/components/Gallery/GalleryDataType"
export interface NestedModuleProps {
    editable: boolean
    initialValue: string
    onSave: (v: string) => void
    content?: DataType.Content
    fetchQueryData?: (value: DataType.Content) => Promise<any>
    contentHeight?: number
    styling?: string
    updateContent?: (c: DataType.Content) => void
    fetchContentFn?: (id: string, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
    fetchContentDatesFn?: (id: string, markName?: string) => Promise<DataType.Element>
    setContent?: React.Dispatch<React.SetStateAction<DataType.Content | undefined>>
    parentInfo: any
    setNewestContent?: (content: DataType.Content, elementInfo?: any) => void
    addElement?: (name: string, timeSeries: boolean, elementType: DataType.ElementType) => boolean
    //获取全部数据库
    fetchStorages: () => Promise<DataType.StorageSimple[]>
    fetchTableList: (id: string) => Promise<string[]>
    fetchTableColumns: (storageId: string, tableName: string) => Promise<string[]>
}

export interface NestedModuleRef {
    setEdit: React.Dispatch<React.SetStateAction<boolean>>
}

export const NestedModule = forwardRef((props: NestedModuleProps, ref: React.Ref<NestedModuleRef>) => {
    const [edit, setEdit] = useState(false)

    useImperativeHandle(ref, () => {
        return {
            setEdit
        }
    })
    console.log(215, props.contentHeight)
    return (
        <NestedModuleEditor
            content={props.content}
            setContent={props.setContent}
            setNewestContent={props.setNewestContent}
            // currIndex={currIndex}
            // setCurrIndex={setCurrIndex}
            // setItems={setItems}
            editable={edit}
            setEdit={setEdit}
            NSMid={NSMid}
            contentHeight={props.contentHeight}
            fetchStoragesFn={props.fetchStorages}
            fetchTableColumnsFn={props.fetchTableColumns}
            fetchTableListFn={props.fetchTableList}
            fetchQueryDataFn={props.fetchQueryData}
            // updateContentFn={props.updateContent}
            // setSaveCount={setSaveCount}

            fetchContentFn={props.fetchContentFn!}
            fetchContentDatesFn={props.fetchContentDatesFn!}
            parentInfo={props.parentInfo}
            addElement={props.addElement!}
        />
    )
})