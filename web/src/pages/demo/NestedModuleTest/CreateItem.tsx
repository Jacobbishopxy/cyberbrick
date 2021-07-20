
import { Button, Input } from 'antd';
import { CloseOutlined, PlusOutlined } from "@ant-design/icons"
import React, { useEffect, useState } from 'react';
import { CSSProperties } from 'react';
import { tabItem } from './data';
import { AddModuleModal } from './AddModuleModal';
import { Category, ElementType } from '../../../components/Gallery/GalleryDataType';

// type Props = ReactGridLayout.Layout & { children: React.ReactNode };
interface createElementProps {
    onAddModule: (name: string, timeSeries: boolean, moduleType: ElementType, tabId: string) => void;
    // categories: Category[];
    // categoryOnSelect(name: string, arg1: boolean): Promise<import("../../../components/Gallery/GalleryDataType").Category>;
    // dashboardOnSelect(id: string, arg1: boolean): Promise<import("../../../components/Gallery/GalleryDataType").Dashboard>;
    // onCopyTemplate: (originTemplateId: string) => void;
    editable: boolean,
    style?: CSSProperties | undefined,
    className?: string | undefined,
    el: tabItem,
    setItems: React.Dispatch<React.SetStateAction<tabItem[]>>
    onRemoveItem: (i: string) => void
}

export const CreateElement = (props: createElementProps) => {
    const { editable, el, onRemoveItem } = props
    const [submitted, setSubmitted] = useState(false)
    const [input, setInput] = useState(el.text)
    const [addModuleModalVisible, setAddModuleModalVisible] = useState<boolean>(false)
    // console.log(el)
    const toggleSubmitted = () => {
        if (editable) { setSubmitted(!submitted) }
    }
    //reset submitted once editable property changed
    useEffect(() => {
        if (!editable) {
            setSubmitted(false)
        } else {
            setSubmitted(false)
        }
    }, [editable])
    const endEdit = () => setSubmitted(true)
    //update input value
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setInput(value)
    }
    const quitAddModule = () => setAddModuleModalVisible(false)

    //pass 
    const onAddModule = (name: string, timeSeries: boolean, moduleType: ElementType) => {
        props.onAddModule(name, timeSeries, moduleType, el.i)
    }
    const displayHeader = <span className="text" title="Double click to edit">{el.text}</span>
    const inputHeader = (!submitted) ?
        <div style={{
            position: "absolute",
            padding: 10
        }}>
            <Input
                placeholder="input here"
                style={{
                    position: "relative",
                    top: 10,
                }}
                value={input}
                onChange={onChange}
                onBlur={endEdit}
                onPressEnter={endEdit}

            />
        </div> : displayHeader
    return (
        <div onDoubleClick={toggleSubmitted}>
            <div>
                {(editable) ?
                    <div>
                        <PlusOutlined
                            style={{
                                position: "absolute",
                                left: 0,
                                bottom: 0,
                                cursor: "pointer",
                            }}
                            onClick={() => setAddModuleModalVisible(true)}
                        />
                        {inputHeader}

                        <CloseOutlined
                            style={{
                                position: 'absolute',
                                right: 2,
                                top: 2,
                                cursor: "pointer",
                            }}
                            onClick={() => onRemoveItem(el.i)} />


                    </div>
                    :
                    displayHeader
                }
            </div>


            <AddModuleModal
                onAddModule={onAddModule}
                // categories={props.categories}
                // categoryOnSelect={name => props.categoryOnSelect(name, true)}
                // dashboardOnSelect={id => props.dashboardOnSelect(id, true)}
                // copyTemplate={props.onCopyTemplate}

                visible={addModuleModalVisible}
                onQuit={quitAddModule}
            />
        </div >
    );
}