import React, { useState, useEffect } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import _ from "lodash";
import { tabItem } from "../data"
import { Button, message } from "antd";
import { useIntl } from "umi";
import { TabController } from "./TabController";
import { COLS_NUM, DEFAULT_ROW_HEIGHT, RGL_CLASSNAME } from "../util";

import * as DataType from "@/components/Gallery/GalleryDataType"

const ReactGridLayout = WidthProvider(RGL);
interface DynamicHeaderProps {
    editable: boolean
    // items: tabItem[],
    // currIndex: number,
    setItems?: React.Dispatch<React.SetStateAction<tabItem[]>>,
    onAddItem?: () => void,
    // onRemoveItem?: (i: string) => void,
    // onSwitch: (i: string) => void
    onLayoutChange: (layout: ReactGridLayout.Layout[]) => void
    onAddModule: (name: string, timeSeries: boolean, moduleType: any) => void
    content?: DataType.Content
    setContent?: React.Dispatch<React.SetStateAction<DataType.Content | undefined>>
    parentInfo: {
        templateId: string
    }
    addElement: (name: string, timeSeries: boolean, elementType: DataType.ElementType) => void
}


/**
 * This layout demonstrates how to use a grid with a dynamic number of elements.
 */
const DynamicHeader = (props: DynamicHeaderProps) => {
    const intl = useIntl()
    // const { onRemoveItem, onSwitch, onAddModule } = props
    const [isHover, setIsHover] = useState<number | null>(null)
    // const [tab]
    /*
    the following are helper method to determine which tab item the mouse is hovering over
    */
    const onMouseEnter = (id: number) => {
        console.log(40, id)
        setIsHover(id)
    }

    const onMouseLeave = () => {
        setIsHover(-1)
    }
    console.log(48, props.parentInfo)
    //添加tab事件
    const onAddTabItems = () => {
        let length = props.content?.data?.tabItems?.length
        if (length >= 30) {
            message.error('已超过最大数！')
            return
        }
        // let xPos = (length ? length : 0) % COLS_NUM
        // let yPos = Math.floor((length ? length : 0) / COLS_NUM)
        let xPos = (length ? length : 0) % COLS_NUM
        let yPos = Math.floor((length ? length : 0) / COLS_NUM)

        if (props.setContent) {
            props.setContent((content) => {
                const newTabItems = [...content?.data?.tabItems, {
                    i: length + 1,
                    x: xPos,
                    y: yPos,
                    w: 1,
                    h: 1,
                    template: {
                        id: props.parentInfo.templateId
                    }
                }]

                return {
                    ...content,
                    data: {
                        ...content?.data,
                        tabItems: newTabItems
                    }
                } as DataType.Content
            })
        }
    }

    //添加submodule
    const onAddSubModule = (index: number) =>
        (name: string, timeSeries: boolean, elementType: DataType.ElementType) => {
            let newTabItems = props.content?.data?.tabItems.slice();

            newTabItems = newTabItems.map((v, i: number) => {
                if (i === index) {
                    return {
                        ...v,
                        name,
                        timeSeries,
                        type: elementType,
                        isSubmodule: true
                    }
                } else {
                    return v
                }
            })
            props.setContent!((content) => {
                return {
                    ...content,
                    data: {
                        currIndex: index,
                        tabItems: newTabItems
                    }
                } as DataType.Content
            })
        }


    //tab点击事件:更换当前的currIndex
    function onSwitch(index: number) {
        props.setContent!((content) => {
            return {
                ...content,
                data: {
                    ...content?.data,
                    currIndex: index
                }
            } as DataType.Content
        })
    }

    //RGL布局
    function genDataGrid(el) {
        return {
            i: el.i + '',
            x: +el.x,
            y: +el.y,
            h: +el.h,
            w: +el.w
        }
    }
    //选中与为选中的样式
    const className = (index: number) => props.content?.data?.currIndex === index ? "tab-content-selected" : "tab-content"

    console.log(135, props.addElement)
    return (
        <div>
            {
                props.editable
                    ? <div className="align-header">
                        <Button
                            onClick={onAddTabItems} block>
                            {intl.formatMessage({ id: "gallery.component.module-panel.nested-simple-module1" })}</Button>
                    </div>
                    : <></>
            }
            <ReactGridLayout
                rowHeight={DEFAULT_ROW_HEIGHT}
                cols={COLS_NUM}
                className={RGL_CLASSNAME}
                isDraggable={props.editable}
                isResizable={props.editable}
                compactType={"horizontal"}
                // onBreakpointChange={onBreakpointChange}
                // {...props}
                // layout={props.content?.data?.tabItems.map((el, i) => { return { i: el.i, x: 5, y: 5, w: 1, h: 1 } }) || []}
                onLayoutChange={props.onLayoutChange}
                style={{ minWidth: "100%", border: "0" }}
            >
                {props.content?.data?.tabItems?.map((el, i: number) =>
                    <div
                        key={el.id ? el.id : el.i}
                        data-grid={genDataGrid(el)}
                        id={el.i}
                        className={className(i)}
                        onClick={() => onSwitch(i)}
                        onMouseEnter={() => onMouseEnter(i)}
                        onMouseLeave={onMouseLeave}>
                        <TabController
                            editable={props.editable} el={el}
                            isHover={(isHover === i) ? true : false}
                            // isSelected={props.currIndex === el.i}
                            // onRemoveItem={onRemoveItem}
                            // setItems={props.setItems}
                            onAddSubModule={onAddSubModule(i)}
                            addElement={props.addElement}
                        />
                    </div>)
                }
            </ReactGridLayout>
        </div>
    );

}
export default DynamicHeader