import React, { } from "react";
import { PlusOutlined } from "@ant-design/icons"
import RGL, { WidthProvider } from "react-grid-layout";
import _ from "lodash";
import { CreateElement } from "./CreateItem";
import { tabItem } from "../data"
import { Button } from "antd";
import ProCard from "@ant-design/pro-card";


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

    const addButon = (editable) ? <Button shape="circle" icon={<PlusOutlined />}
        onClick={onAddItem} /> :
        <div></div>

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
                        < div key={el.i} data-grid={el} onClick={() => onSwitch(el.i)} style={{ border: "1px solid grey" }}>
                            <CreateElement editable={editable} el={el}
                                onRemoveItem={onRemoveItem}
                                setItems={setItems}
                                onAddModule={onAddModule}
                            />

                        </div>)
                    }
                </ReactGridLayout>
            </div>
        </ProCard>

    );

}
export default DynamicHeader