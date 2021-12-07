import { ModalForm } from "@ant-design/pro-form";
import { Button, Divider, List, Tooltip } from "antd";
import { useState } from "react";
import { TabChoice } from "../data";

import { tabSelectChunk, iconMapText, } from "./TabChoice";

import styles from "@/components/Gallery/Dashboard/DashboardController/Common.less"
import { useIntl } from "umi";
import { TabItemArticalInput } from "./TabItemArticaleInput";

interface TabItemSelectionProps {
    // selected: string,
    // setSelected: React.Dispatch<React.SetStateAction<string>>
    // endEdit: (selectedType: string, input?: string) => void
    onFinish: (iconType: string, iconContent: string) => void
    trigger: any
}

/*
This is the modal form for selecting tab item content. When submit, it update the
tab choice (with 'selectedType'), selected icon (with 'selected') and input if it's given (with 'input')
*/
export const TabItemSelection = (props: TabItemSelectionProps) => {
    const [selected, setSelected] = useState('')
    const [input, setInput] = useState('')
    const [selectedType, setSelectedType] = useState('')
    const intl = useIntl()

    //update input value
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setInput(value)
    }

    const onClick = (key: string, type: string) => {
        setSelectedType(type)
        setSelected(key)
    }

    const onFinish = async () => {
        // props.setSelected(selected)
        // console.log(selected)
        // selectedType === 'icon' ? props.endEdit(selectedType) : props.endEdit(selectedType, input)
        props.onFinish(selectedType, selectedType === 'icon' ? selected : input)
        return true;
    }

    //style of a single choice
    const singleChoiceContent = (choice: TabChoice) => {
        const className = (choice.key === selected) ? 'tab-icon-selected' : 'tab-icon'

        console.log(53, choice.key)
        return ( //changed style when selected
            <Tooltip title={iconMapText[choice.key]}>
                <div onClick={() => onClick(choice.key, choice.tabType)}
                    className={className}
                    key={choice.key}
                >
                    {choice.icon}
                </div>
            </Tooltip>
        )
    }

    //display a list of tab choices of same type
    const choicesDisplay = (choice: TabChoice) => {
        //is icon
        if (choice.tabType === "icon") {
            return singleChoiceContent(choice)
        }
        //not icon, display label and click to enable input field
        return (
            (selected === choice.key) ?
                <TabItemArticalInput
                    key={choice.key}
                    value={input}
                    placeholder={choice.tabType}
                    onChange={onChange}
                />
                : singleChoiceContent(choice)
        )
    }

    //display tab choice of different types
    const tabChoiceChunk = () => {
        return tabSelectChunk.map(chunk => {
            return <div key={chunk.key}>
                <Divider orientation="left">
                    {intl.formatMessage({ id: `gallery.component.module-panel.nested-simple-module.edit-tab.${chunk.key}` })}</Divider>
                <List //6 icons per row or 3 labels per row
                    grid={{ column: (chunk.key === "Icon") ? 6 : 3 }}
                    size="small"
                    dataSource={chunk.children}
                    renderItem={item => (
                        <List.Item key={item.key}>
                            <label className={styles.moduleSelectionLabel}>
                                {choicesDisplay(item)}
                            </label>
                        </List.Item>
                    )}
                />
            </div>
        })
    }

    return (
        <ModalForm<{
            name: string;
            company: string;
        }>
            title={intl.formatMessage({ id: "gallery.component.module-panel.nested-simple-module4" })}
            trigger={props.trigger}
            onFinish={onFinish}
        >

            {tabChoiceChunk()}

        </ModalForm>
    );
}

