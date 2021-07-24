
import { CloseOutlined, PlusOutlined } from "@ant-design/icons"
import React, { useEffect, useState } from 'react';
import { CSSProperties } from 'react';
import { tabContentChoice, tabItem, TabType } from '../data';
import { AddModuleModal } from '../EmbededModule/AddModuleModal';
import { ElementType } from '../../../../components/Gallery/GalleryDataType';
import { TabItemSelection } from './TabItemSelection';
import { getChoiceElement } from './TabChoice';

interface createElementProps {
    onAddModule: (name: string, timeSeries: boolean, moduleType: ElementType, tabId: string) => void;
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
    const [tabType, setTabType] = useState(el.tabType)
    const [selected, setSelected] = useState('');
    const [addModuleModalVisible, setAddModuleModalVisible] = useState<boolean>(false)
    // console.log(el)
    const toggleSubmitted = () => {
        if (editable) { setSubmitted(!submitted) }
    }

    //reset submitted once editable property changed
    useEffect(() => {
        props.setItems(items => items.map(item => {
            if (item.i === el.i && selected) {
                return { ...el, tabContent: selected as tabContentChoice, tabType: tabType as TabType }
            }
            return item
        }))
    }, [submitted])

    const endEdit = (tabType: string, input?: string) => {
        //not icon
        if (tabType !== "icon") {
            setSelected(input || '')
        }
        //update tab type
        setTabType(tabType)
        setSubmitted(true)
    }

    const quitAddModule = () => setAddModuleModalVisible(false)

    //pass 
    const onAddModule = (name: string, timeSeries: boolean, moduleType: ElementType) => {
        props.onAddModule(name, timeSeries, moduleType, el.i)
    }

    const displayHeader = () => {
        let headerContent: any = el.text

        if (editable) {
            //get content from newly created information
            if (selected) headerContent = getChoiceElement(selected as tabContentChoice)
        } else {
            //get content from tabContent
            if (el.tabContent) headerContent = getChoiceElement(el.tabContent)
        }
        // console.log(headerContent)
        return (<span className={(tabType === "text") ? "tab-text" : "content"}
            title={editable ? "Double click to edit" : ""}>
            {headerContent}
        </span>)
    }

    const inputHeader = (!submitted) ?
        <div className="edit-button">
            <TabItemSelection
                selected={selected}
                setSelected={setSelected}
                endEdit={endEdit} />
        </div> : displayHeader()

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
                    displayHeader()
                }
            </div>

            <AddModuleModal
                onAddModule={onAddModule}
                visible={addModuleModalVisible}
                onQuit={quitAddModule}
            />
        </div >
    );
}