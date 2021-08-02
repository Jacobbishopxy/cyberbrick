import React, { useState } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import _ from "lodash";
import { CreateElement } from "./DisplayHeader";
import { tabItem } from "../data"
import { Button } from "antd";
import { useIntl } from "umi";
import { TabController } from "./TabController";

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
    currIndex: string,
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
    const [isHover, setIsHover] = useState<string | null>(null)
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
                style={{ minWidth: "100%", border: "0" }}
            >
                {items.map(el =>
                    <div key={el.i} data-grid={el}
                        className={props.currIndex === el.i ? "tab-content-selected" : "tab-content"}
                        onClick={() => onSwitch(el.i)}
                        onMouseEnter={() => setIsHover(el.i)}
                        onMouseLeave={() => setIsHover(null)}
                    >
                        <TabController editable={props.editable} el={el}
                            isHover={(isHover && isHover === el.i) ? true : false}
                            isSelected={props.currIndex === el.i}
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