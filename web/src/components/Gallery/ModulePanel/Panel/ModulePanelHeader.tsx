/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React, { useEffect, useState, useRef } from "react"
import { Button, Col, Input, message, Row } from "antd"
import { FormattedMessage, useIntl } from "umi"

import * as DataType from "@/components/Gallery/GalleryDataType"
import { HeaderController } from "./HeaderController"
import { data } from "@/pages/demo/Charts/mock/ls"


interface ModulePanelHeaderProps {
    editable: boolean
    settable: boolean
    timeSeries?: boolean
    headName?: string
    type: DataType.ElementType
    title: string | undefined
    date: string | undefined
    updateTitle: (v: string) => void
    editContent: (value: boolean) => void
    newContent: (date: string) => void
    confirmDelete: () => void
    dateList?: string[]
    editDate?: (date: string, isMessage?: boolean) => void
    onSelectDate?: (date: string) => void
    updateContent: (content: DataType.Content) => void

    content: DataType.Content
    setContent: React.Dispatch<React.SetStateAction<DataType.Content | undefined>>
    setDate: React.Dispatch<React.SetStateAction<string>>
}

export const ModulePanelHeader = (props: ModulePanelHeaderProps) => {
    const [titleEditable, setTitleEditable] = useState<boolean>(false)
    const [title, setTitle] = useState<string | undefined>(props.title)
    const intl = useIntl()

    useEffect(() => setTitle(props.title), [props.title])

    const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        if (value !== "") {
            setTitle(value)
            props.updateTitle(value)
        } else
            message.warning("title cannot be empty!")

        setTitleEditable(false)
    }

    const titleInputRef = useRef<any>(null)
    //点击标题聚焦
    useEffect(() => {
        if (titleEditable) {
            titleInputRef.current?.focus();
        }
    }, [titleEditable])
    const genTitle = () => {
        //don't display title since header separator is a "title" by itself
        if (props.type === DataType.ElementType.FieldHeader) return <></>
        if (titleEditable)
            return <Input
                ref={titleInputRef}
                placeholder={intl.formatMessage({ id: "gallery.component.general62" })}
                size="small"
                allowClear
                style={{ width: 200 }}
                onBlur={changeTitle}
                defaultValue={title}
            />
        const eleType = <FormattedMessage id={`gallery.component.type.${props.type}`} />

        if (props.editable && props.settable) {
            const txt = <FormattedMessage id="gallery.component.module-panel.panel.module-panel-header1" />
            return (
                <Button
                    type="link"
                    size="small"
                    onClick={() => setTitleEditable(true)}
                >
                    {title ? title : <>{eleType} - {txt}</>}
                </Button>
            )
        }
        return (
            <span style={{ fontWeight: "bold" }}>
                {/* {title ? title : eleType} */}
                {title ? title : ''}
            </span>
        )
    }

    const genController = () =>
        <HeaderController
            editable={props.editable}
            settable={props.settable}
            timeSeries={props.timeSeries}
            dateList={props.dateList}
            editDate={props.editDate}
            editContent={props.editContent}
            newContent={props.newContent}
            confirmDelete={props.confirmDelete}
            onSelectDate={props.onSelectDate}
            setTitle={setTitle}
            updateContent={props.updateContent}

            content={props.content}
            setContent={props.setContent}
            elementType={props.type}
            headName={props.headName}
            setDate={props.setDate}
        />

    function getDate() {
        if (props.timeSeries) {
            if (props.content) {
                // if (Object.keys(props.content.data).length !== 0) {
                //     return DataType.timeToString(props.date!)
                // }
                if (props.content.date !== '') {
                    return DataType.timeToString(props.date!)
                }
            }
        } else {
            return DataType.timeToString(props.date!)
        }

        return '';
    }

    console.log(126, props.setContent)
    return (
        <Row >
            {
                props.headName ?
                    <>
                        <Col span={8} style={{ fontWeight: "bold" }}>
                            {props.type === DataType.ElementType.FieldHeader ? '' : props.headName}
                        </Col>

                        <Col span={8} style={{ textAlign: "center" }}>
                            {genTitle()}
                        </Col>

                        <Col span={8}>
                            <Row justify='end'>
                                <Col  >
                                    {
                                        getDate()
                                    }

                                </Col>
                                <Col  >

                                    {genController()}
                                </Col>
                            </Row>
                        </Col>

                    </> :
                    <>
                        <Col span={12} style={{ textAlign: "left" }}>
                            {genTitle()}
                        </Col>
                        <Col span={12} style={{ textAlign: "right" }}>
                            {genController()}
                        </Col>
                    </>
            }
        </Row>
    )
}

ModulePanelHeader.defaultProps = {
    timeSeries: false
} as Partial<ModulePanelHeaderProps>

