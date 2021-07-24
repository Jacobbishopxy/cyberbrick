import React, { useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons"
import RGL, { WidthProvider } from "react-grid-layout";
import _ from "lodash";
import { CreateElement } from "./CreateItem";
import { tabItem } from "../data"


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

    let addTabLayout = {
        i: "add",
        x: (items.length) % (12),
        y: Math.floor((items.length) / (12)), // puts it at the bottom
        w: 1,
        h: 1,
        text: "Add",
    }

    useEffect(() => {
        addTabLayout = {
            i: "add",
            x: (items.length) % (12),
            y: Math.floor((items.length) / (12)), // puts it at the bottom
            w: 1,
            h: 1,
            text: "Add",
        }

    }, [items.length])



    const addTab = <div key={"add"}
        data-grid={addTabLayout}
        style={{ border: "1px dashed grey" }}
    >
        <PlusOutlined
            className="add-tab"
            onClick={onAddItem}
            style={{ cursor: "pointer", }}
        />
    </div>
    return (
        <ReactGridLayout
            {...reactGridLayoutDefaultProps}
            isDraggable={editable}
            isResizable={editable}
            compactType={"horizontal"}
            // important!!! Without this layout props RGL won't be able to rerender
            // layout={items}
            // onBreakpointChange={onBreakpointChange}
            // {...props}
            onLayoutChange={props.onLayoutChange}
            style={{ minWidth: "100%" }}
        >
            {items.map(el =>
                <div key={el.i} data-grid={el} onClick={() => onSwitch(el.i)}>
                    <CreateElement editable={editable} el={el}
                        onRemoveItem={onRemoveItem}
                        setItems={setItems}
                        onAddModule={onAddModule}
                    />

                </div>)
            }
            {editable ? addTab : <div />}
        </ReactGridLayout>

    );

}
export default DynamicHeader