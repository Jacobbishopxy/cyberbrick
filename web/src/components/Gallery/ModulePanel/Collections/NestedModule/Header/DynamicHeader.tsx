import React, { useState } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import _ from "lodash";
import { tabItem } from "../data"
import { Button } from "antd";
import { useIntl } from "umi";
import { TabController } from "./TabController";
import { COLS_NUM, DEFAULT_ROW_HEIGHT, RGL_CLASSNAME } from "../util";


const ReactGridLayout = WidthProvider(RGL);
interface DynamicHeaderProps {
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
const DynamicHeader = (props: DynamicHeaderProps) => {
    const intl = useIntl()
    const { onRemoveItem, onSwitch, onAddModule } = props
    const [isHover, setIsHover] = useState<string | null>(null)

    /*
    the following are helper method to determine which tab item the mouse is hovering over
    */
    const onMouseEnter = (id: string) => {
        setIsHover(id)
    }

    const onMouseLeave = () => {
        setIsHover(null)
    }

    //determine style for selected and unselected items
    const className = (id: string) => props.currIndex === id ? "tab-content-selected" : "tab-content"

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
                rowHeight={DEFAULT_ROW_HEIGHT}
                cols={COLS_NUM}
                className={RGL_CLASSNAME}
                isDraggable={props.editable}
                isResizable={props.editable}
                compactType={"horizontal"}
                // onBreakpointChange={onBreakpointChange}
                // {...props}
                // layout={[addTabLayout]}
                onLayoutChange={props.onLayoutChange}
                style={{ minWidth: "100%", border: "0" }}
            >
                {props.items.map(el =>
                    <div key={el.i} data-grid={el} id={el.i}
                        className={className(el.i)}
                        onClick={() => onSwitch(el.i)}
                        onMouseEnter={() => onMouseEnter(el.i)}
                        onMouseLeave={onMouseLeave}>
                        <TabController

                            editable={props.editable} el={el}
                            isHover={(isHover && isHover === el.i) ? true : false}
                            isSelected={props.currIndex === el.i}
                            onRemoveItem={onRemoveItem}
                            setItems={props.setItems}
                            onAddModule={onAddModule}
                        />
                    </div>)
                }
            </ReactGridLayout>
        </div>
    );

}
export default DynamicHeader