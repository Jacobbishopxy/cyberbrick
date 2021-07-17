// import { Content, ElementType, StorageSimple } from "@/components/Gallery/GalleryDataType"
// import { ModulePanel, ModulePanelProps } from "@/components/Gallery/ModulePanel/Panel/ModulePanel"
// import { Skeleton } from "antd"


// interface MTPProps{

//     modulePanelProps:ModulePanelProps
// }



// export const ModuleTabPane = (props: MTPProps) => {
//     const {modulePanelProps} = props
//     // const [updateCount, setUpdateCount] = useState(0)
//     const [currModule, setCurrModule] = useState<ModulePanelProps>()
//     // const [moduleContent, setModuleContent] = useState(tempContent)

//     const newElement = (name: string, timeSeries: boolean, elementType: ElementType, tabId: string) => {


//         const fetchContent = (data?: string) => {
//           console.log(data)
//         }
//         const updateContent = (c: Content) => {
//           console.log(c)
//         }

//         const onRemoveModule = (id: string) => {
//             setModuleList(moduleList.filter(mod => mod.id !== id))
//           }

//         return (
//           <ModulePanel
//             headName={name}
//             elementType={elementType}
//             timeSeries={timeSeries}
//             editable={editable}
//             settable={editable}
//             contentHeight={400}
//             content={content}
//             onRemove={() => onRemoveModule(tabId)}
//             fetchContent={fetchContent}
//             updateContent={updateContent}
//           />
//         )

//       }


//       return (
//           <div>
//         {<ModulePanel
//             headName={name}
//             elementType={elementType}
//             timeSeries={timeSeries}
//             editable={editable}
//             settable={editable}
//             contentHeight={400}
//             content={content}
//             onRemove={() => onRemoveModule(tabId)}
//             fetchContent={fetchContent}
//             updateContent={updateContent}
//           /> || <Skeleton />}
//         </div>
//       )
// }