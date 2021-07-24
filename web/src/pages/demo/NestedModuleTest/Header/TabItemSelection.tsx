import { ModalForm } from "@ant-design/pro-form";
import { Button, Divider, Input, List, message } from "antd";
import { useEffect, useState } from "react";
import { TabChoice } from "../data";

import { tabSelectChunk } from "./TabChoice";

import styles from "@/components/Gallery/Dashboard/DashboardController/Common.less"

interface TabItemSelectionProps {
    selected: string,
    setSelected: React.Dispatch<React.SetStateAction<string>>
    endEdit: (selectedType: string, input?: string) => void
}

export const TabItemSelection = (props: TabItemSelectionProps) => {
    const { selected, setSelected } = props
    const [input, setInput] = useState('')
    const [selectedType, setSelectedType] = useState('')

    useEffect(() => {
    }, [selected])

    //update input value
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setInput(value)
    }

    const onClick = (key: string, type: string) => {
        setSelectedType(type)
        setSelected(key)
    }

    const singleChoiceContent = (choice: TabChoice) => {
        return (choice.key === selected) ? //changed style when selected
            <div onClick={() => onClick(choice.key, choice.tabType)}
                className='tab-icon-selected'
                key={choice.key}
            >
                {choice.icon}
            </div> :
            <div onClick={() => onClick(choice.key, choice.tabType)}
                className='tab-icon'
                key={choice.key}
            >
                {choice.icon}
            </div>
    }

    const choicesDisplay = (choice: TabChoice) => {
        //is icon
        if (choice.tabType === "icon") {
            return singleChoiceContent(choice)
        }
        //not icon, display label and click to enable input field
        return (
            (selected === choice.key) ?
                <div className="tab-input" key={choice.key}>
                    <Input
                        placeholder={choice.tabType}
                        value={input}
                        onChange={onChange}
                    />
                </div>
                : singleChoiceContent(choice)
        )
    }

    const tabChoiceChunk = () => {
        return tabSelectChunk.map(chunk => {
            return <div>
                <Divider orientation="left">{chunk.key}</Divider>
                <List //6 icons per row or 3 labels per row
                    grid={{ column: (chunk.key === "Icon") ? 6 : 3 }}
                    size="small"
                    dataSource={chunk.children}
                    renderItem={item => (
                        <List.Item>
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
            title="Select the content"
            trigger={
                <Button size='small'>
                    Edit
                </Button>
            }
            onFinish={async (values) => {
                message.success('提交成功');
                selectedType === 'icon' ? props.endEdit(selectedType) : props.endEdit(selectedType, input)
                return true;
            }}
        >

            {tabChoiceChunk()}

        </ModalForm>
    );
}