import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons"
import RGL, { WidthProvider } from "react-grid-layout";
import _ from "lodash";
import { CreateElement } from "./CreateItem";
import { tabItem } from "./data"
import { Button } from "antd";
import ProCard from "@ant-design/pro-card";
import { Category } from "@/components/Gallery/GalleryDataType";


const reactGridLayoutDefaultProps = {
    className: "layout",
    cols: 12,
    rowHeight: 70,
}

const ReactGridLayout = WidthProvider(RGL);
interface AddRemoveProps {
    editable: boolean
    items: tabItem[],
    setItems: React.Dispatch<React.SetStateAction<tabItem[]>>,
    onAddItem: () => void,
    onRemoveItem: (i: string) => void,
    onSwitch: (i: string) => void
    onLayoutChange: (layout: ReactGridLayout.Layout[]) => void
    onAddModule: (name: string, timeSeries: boolean, moduleType: any, tabId: string) => void
}

/**
 * This layout demonstrates how to use a grid with a dynamic number of elements.
 */
const DynamicHeader = (props: AddRemoveProps) => {

    const { editable, items, setItems, onAddItem, onRemoveItem, onSwitch, onAddModule } = props
    const [categories, setCategories] = useState<Category[]>([])

    const addButon = (editable) ? <Button shape="circle" icon={<PlusOutlined />}
        onClick={onAddItem} /> :
        <div></div>

    //setup categories
    useEffect(() => {
        //   setCategories(categories.push())
    }, [])

    // const categoryOnSelect = async (name: string, arg1: boolean) => {
    //     return categories[0]
    // }
    //   const dashboardOnSelect = (id: string, arg1: boolean): Promise<import("../../../components/Gallery/GalleryDataType").Dashboard>;



    return (

        <ProCard title="Header" extra={addButon} >

            <div>
                <ReactGridLayout
                    {...reactGridLayoutDefaultProps}
                    isDraggable={editable}
                    compactType={"horizontal"}
                    // important!!! Without this layout props RGL won't be able to rerender
                    layout={items}
                    // onBreakpointChange={onBreakpointChange}
                    {...props}
                    style={{ minWidth: "100%" }}
                >
                    {items.map(el =>
                        < div key={el.i} data-grid={el} onClick={() => onSwitch(el.i)}>
                            <CreateElement editable={editable} el={el}
                                onRemoveItem={onRemoveItem}
                                setItems={setItems}
                                onAddModule={onAddModule}
                            // categories={categories}
                            // categoryOnSelect={categoryOnSelect}
                            />

                        </div>)
                    }
                </ReactGridLayout>
            </div>
        </ProCard>

    );

}
export default DynamicHeader

// if (process.env.STATIC_EXAMPLES === true) {
//     export default (makeLayout(AddRemoveLayout));
// }