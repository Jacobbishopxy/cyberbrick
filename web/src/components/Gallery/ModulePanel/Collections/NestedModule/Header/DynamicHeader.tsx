import React, { } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import _ from "lodash";
import { CreateElement } from "./CreateItem";
import { tabItem } from "../data"
import { Button } from "antd";
import { useIntl } from "umi";

const COLSNUM = 6
const reactGridLayoutDefaultProps = {
    className: "layout",
    cols: COLSNUM,
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
    const intl = useIntl()
    const { items, setItems, onRemoveItem, onSwitch, onAddModule } = props

    // let addTabLayout = {
    //     i: "add",
    //     x: (items.length) % (COLSNUM),
    //     y: Math.floor((items.length) / (COLSNUM)), // puts it at the bottom
    //     w: 1,
    //     h: 1,
    //     text: "Add",
    // }

    // useEffect(() => {

    //     addTabLayout = {
    //         ...addTabLayout,
    //         x: (items.length) % (COLSNUM),
    //         y: Math.floor((items.length) / (COLSNUM)), // puts it at the bottom

    //     }
    //     console.log(addTabLayout)
    // }, [items.length])



    // const addTab = <div key={"add"}
    //     data-grid={addTabLayout}
    //     style={{ border: "1px dashed grey" }}
    // >
    //     <PlusOutlined
    //         className="add-tab"
    //         onClick={onAddItem}
    //         style={{ cursor: "pointer", }}
    //     />
    // </div>

    return (
        <div>
            {props.editable ?
                <div className="align-header">
                    <Button
                        onClick={props.onAddItem} block>
                        {intl.formatMessage({ id: "gallery.component.module-panel.nested-simple-module1" })}</Button>
                </div>
                : <div />}
            <ReactGridLayout
                {...reactGridLayoutDefaultProps}
                isDraggable={props.editable}
                isResizable={props.editable}
                compactType={"horizontal"}
                // onBreakpointChange={onBreakpointChange}
                // {...props}
                // layout={[addTabLayout]}
                onLayoutChange={props.onLayoutChange}
                style={{ minWidth: "100%" }}
            >
                {items.map(el =>
                    <div key={el.i} data-grid={el} onClick={() => onSwitch(el.i)}>
                        <CreateElement editable={props.editable} el={el}
                            onRemoveItem={onRemoveItem}
                            setItems={setItems}
                            onAddModule={onAddModule}
                        />

                    </div>)
                }
            </ReactGridLayout>
        </div>
    );

}
export default DynamicHeader