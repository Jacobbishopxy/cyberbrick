
import { ContainerTemplateRef } from "@/components/Gallery/Dashboard/DashboardContainer/ContainerTemplate"
import { ContainerElementRef, TemplateElement } from "@/components/Gallery/Dashboard/DashboardContainer/TemplateElement"
import { Content, ElementType } from "@/components/Gallery/GalleryDataType"
import { forwardRef, useImperativeHandle, useRef } from "react"
import RGL, { Layout, WidthProvider } from "react-grid-layout"


interface ModuleTabPaneProps {
    editable: boolean,
    name: string,
    timeSeries: boolean,
    elementType: ElementType,
    tabId: string,
    content?: Content
    onRemoveModule: (id: string) => void,
    setLayout: React.Dispatch<React.SetStateAction<Layout[]>>

}
export interface ModuleTabPaneRef {
    startFetchAllContents: () => void;
}
const tempContent: Content = {
    date: `${new Date()}`,
    data: {
        content: "content",
        text: "text"
    }
}
const ReactGridLayout = WidthProvider(RGL)
export const ModuleTabPane = forwardRef((props: ModuleTabPaneProps, ref: React.Ref<ModuleTabPaneRef>) => {

    //fetch the content by calling props' method: fetchContent()
    const teRefs = useRef<ContainerElementRef>(null)
    const startFetchAllContents = () => {
        console.log("in moduleTabPane, start fetching")
        const rf = teRefs.current
        console.log(rf)
        if (rf) {
            console.log("start fetching")
            rf.fetchContent()
        }
    }
    useImperativeHandle(ref, () => ({ startFetchAllContents }))
    // const genRef = (i: number) => (el: ContainerElementRef) => {
    //     if (el) teRefs.current=el
    // }
    const { name, timeSeries, elementType, tabId, content } = props

    const onLayoutChange = (layout: ReactGridLayout.Layout[]) => {
        props.setLayout(layout);
        // console.log(layout)
    };


    const fetchContent = async (id: string, data?: string) => {
        console.log(id, data)
        if (content) {
            console.log("content is defined: ", content)
            return content
        }
        return tempContent
    }
    const updateContent = (c: Content) => {
        console.log(c)
    }

    //hardcode the single module layout
    const elements = [
        {
            id: tabId,
            name: name,
            type: elementType,
            timeSeries: timeSeries,
            x: 0,
            y: 0,
            h: 20,
            w: 12,
        }
    ]

    return (
        <ReactGridLayout
            rowHeight={10}
            onLayoutChange={onLayoutChange}
            isDraggable={props.editable}
            isResizable={props.editable}
        >
            {
                elements.map((ele, i) =>
                    <div key={ele.name} data-grid={elements[0]}>
                        <TemplateElement
                            parentInfo={[]}
                            timeSeries={timeSeries}
                            editable={props.editable}
                            element={elements[0]}
                            onRemove={() => props.onRemoveModule(tabId)}
                            fetchContentFn={fetchContent}
                            fetchContentDatesFn={async (id: string, markName?: string) => elements[0]}
                            updateContentFn={updateContent}
                            fetchStoragesFn={async () => []}
                            fetchTableListFn={async (id) => [id]}
                            fetchTableColumnsFn={async (storageId: string, tableName: string) => [storageId, tableName]}
                            fetchQueryDataFn={async (readOption) => { }}
                            ref={teRefs}
                        />
                    </div>
                )
            }
        </ReactGridLayout>
    )

})