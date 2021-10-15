import { ElementType } from "@/components/Gallery/GalleryDataType"
import { tabContentChoice, tabItem } from "@/components/Gallery/ModulePanel/Collections/NestedModule/data"
import { AddModuleModal } from "@/components/Gallery/ModulePanel/Collections/NestedModule/EmbededModule/AddModuleModal"
import { getChoiceElement } from "@/components/Gallery/ModulePanel/Collections/NestedModule/Header/TabChoice"
import { FileAddOutlined, DeleteOutlined } from "@ant-design/icons"
import { Tooltip, Button } from "antd"
import { CSSProperties, useEffect, useState } from "react"
import { useIntl } from "umi"
import { TabItemSelection } from "./TabItemSelection"


interface TabControllerProps {
    onAddModule: (name: string, timeSeries: boolean, moduleType: ElementType, tabId: string) => void;
    editable: boolean,
    style?: CSSProperties | undefined,
    className?: string | undefined,
    isHover: boolean,
    isSelected: boolean,
    el: tabItem,
    setItems: React.Dispatch<React.SetStateAction<tabItem[]>>
    onRemoveItem: (i: string) => void

}
/*
This is the controller for tab item. It receives a boolean type 'isHover' from parent.

When 'isHover' is true, display 'editHeader', which is the controller of three buttons that used to
edit corresponding module, edit current tab content, and remove current tab.

'displayHeader' is used to display the content of the tab item.

'selected' is the selected choice from modal triggered by editHeader
*/
export const TabController = (props: TabControllerProps) => {
    const { el } = props
    const [tabType, setTabType] = useState(el.tabType)
    //used to store which
    const [selected, setSelected] = useState('');
    const [addModuleModalVisible, setAddModuleModalVisible] = useState(false)
    const intl = useIntl()

    //update items content to selected
    useEffect(() => {
        // console.log("selected change", selected)
        if (selected && tabType) props.setItems(items => items.map(it => {
            if (it.i === el.i) {
                return { ...it, tabContent: selected, tabType: tabType }
            }
            return it
        }))
    }, [selected, tabType])

    const endEdit = (type: string, input?: string) => {
        //not icon
        if (type !== "icon") {
            setSelected(input || '')
        }
        //update tab type
        setTabType(type)
        // console.log(tabType, input, selected)
    }

    const quitAddModule = () => setAddModuleModalVisible(false)

    //pass 
    const onAddModule = (name: string, timeSeries: boolean, moduleType: ElementType) => {
        props.onAddModule(name, timeSeries, moduleType, el.i)
    }

    const editHeader = <div style={{ marginTop: "-12px", right: 0, textAlign: "right" }}>
        <Tooltip title={intl.formatMessage({ id: "gallery.component.module-panel.nested-simple-module6" })}>
            <Button icon size='small' className="tab-controller-button"
                onClick={() => setAddModuleModalVisible(true)}>
                <FileAddOutlined />
            </Button>
        </Tooltip>

        <TabItemSelection
            selected={selected}
            setSelected={setSelected}
            endEdit={endEdit} />
        <Tooltip title={intl.formatMessage({ id: "gallery.component.general23" })}>
            <Button icon size='small' className="tab-controller-button"
                onClick={() => props.onRemoveItem(el.i)}>
                <DeleteOutlined />
            </Button>
        </Tooltip>

    </div>

    const displayHeader = () => {
        //get content from tabContent
        let headerContent: any = getChoiceElement(el.tabContent || "")

        const className = (tabType === "text") ? "tab-text" : "display-content"
        //calculate fontSize based on the minimal of tab's dimension (width/height)
        const fontSize = (tabType === "text") ? `${el.minDim / 4}px` : `${el.minDim / 2}px`
        if (props.editable && selected) {
            //get content from newly created information
            headerContent = getChoiceElement(selected as tabContentChoice)
        }
        // console.log(el.i, selected)
        return (<span className={className}
            style={{ fontSize: fontSize }}
        >
            {headerContent}
        </span>)
    }

    return (
        <div style={{ bottom: 0, top: 0 }}>
            {props.editable && props.isHover ? editHeader : <div style={{ marginTop: "-12px", height: "24px" }} />}

            <div>
                {/* icon图标 */}
                {displayHeader()}
            </div>
            <AddModuleModal
                onAddModule={onAddModule}
                visible={addModuleModalVisible}
                onQuit={quitAddModule}
            />
        </div>
    )
}