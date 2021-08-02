import { ElementType } from "@/components/Gallery/GalleryDataType"
import { tabContentChoice, tabItem } from "@/components/Gallery/ModulePanel/Collections/NestedModule/data"
import { AddModuleModal } from "@/components/Gallery/ModulePanel/Collections/NestedModule/EmbededModule/AddModuleModal"
import { getChoiceElement } from "@/components/Gallery/ModulePanel/Collections/NestedModule/Header/TabChoice"
import { FileAddOutlined, DeleteOutlined } from "@ant-design/icons"
import { Tooltip, Button } from "antd"
import { CSSProperties, useState } from "react"
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

export const TabController = (props: TabControllerProps) => {
    const { el } = props
    const [tabType, setTabType] = useState(el.tabType)
    const [selected, setSelected] = useState('');
    const [addModuleModalVisible, setAddModuleModalVisible] = useState(false)
    const intl = useIntl()

    const endEdit = (tabType: string, input?: string) => {
        //not icon
        if (tabType !== "icon") {
            setSelected(input || '')
        }
        //update tab type
        setTabType(tabType)
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
        let headerContent: any = el.text

        if (props.editable) {
            //get content from newly created information
            if (selected) headerContent = getChoiceElement(selected as tabContentChoice)
        } else {
            //get content from tabContent
            if (el.tabContent) headerContent = getChoiceElement(el.tabContent)
        }
        // console.log(headerContent)
        return (<span className={(tabType === "text") ? "tab-text" : "content"}
        // title={editable ? "Double click to edit" : ""}
        >
            {headerContent}
        </span>)
    }

    return (
        <div>
            {props.editable && props.isHover ? editHeader : null}

            <div>
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