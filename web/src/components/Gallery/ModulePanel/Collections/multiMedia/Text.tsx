/**
 * Created by Jacob Xie on 10/3/2020.
 */

import { useState } from "react"

import { TextEditorModifier, TextEditorPresenter } from "@/components/TextEditor"
import { ModuleGenerator } from "../../Generator/ModuleGenerator"
import { ModuleEditorField, ModulePresenterField } from "../../Generator/data"
import * as DataType from "../../../GalleryDataType"
import _ from "lodash";

const EditorField = (props: ModuleEditorField) => {

    const onChangeContent = (value: string) => {
        // console.log(content)
        const ctt = //only update data.text property
            { ...props.content, data: { ...props.content?.data, text: value }, date: props.content?.date || DataType.today() }
        const ctWithDb = { ...ctt, storageType: DataType.StorageType.MONGO }
        console.log(22, ctWithDb)
        if (props.setContent) {
            props.setContent(() => ctWithDb)
        }
    }

    console.log(277, props.styling)
    return (
        <div style={{ marginTop: '2em' }}>
            <TextEditorModifier
                onChange={onChangeContent}
                content={props.content && props.content.data ? props.content.data.text : null}
                styling={props.styling}
                style={{
                    height: props.contentHeight ? props.contentHeight - 130 : undefined,
                }}
            />
        </div>
    )
}

const PresenterField = (props: ModulePresenterField) => {
    console.log(42, props.content)
    return <div style={{ marginTop: '2em' }}>
        <TextEditorPresenter
            content={props.content?.data?.text || ""}
        />
    </div>
}


export const Text = new ModuleGenerator(EditorField, PresenterField, true).generate()

