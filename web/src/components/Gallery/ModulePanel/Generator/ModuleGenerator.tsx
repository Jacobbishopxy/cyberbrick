/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React, { forwardRef, useImperativeHandle, useState, useRef } from "react"

import { ConvertProps, ConvertFwRef, ConvertRefProps, ModuleEditorField, ModulePresenterField } from "./data"
import styles from "./Common.less"

export class ModuleGenerator {
    private editor: React.FC<ModuleEditorField>

    // private presenter: React.FC<ModulePresenterField>
    private presenter
    private forceStyle: boolean

    constructor(editor: React.FC<ModuleEditorField>,
        presenter: React.FC<ModulePresenterField>,
        // presenter: any,
        forceStyle: boolean = false) {
        this.editor = editor
        this.presenter = presenter
        this.forceStyle = forceStyle
    }

    public generate = () => {
        const ConvertRef: React.FC<ConvertRefProps> = (crProps: ConvertRefProps) => {
            const [editable, setEditable] = useState<boolean>()
            const { forceStyle } = this
            //!any
            const prRef = useRef<any>()
            useImperativeHandle(crProps.forwardedRef, () => ({
                edit: setEditable,
                items: prRef.current?.getTabItem //无用，可以删除
            }))

            //为了使用到presenter里的数据
            // const PresenterRef = forwardRef((props, ref) => {
            //     return (<this.presenter
            //         editable={crProps.editable}
            //         initialValue={crProps.initialValue}
            //         onSave={crProps.onSave}
            //         content={crProps.content}
            //         fetchQueryData={crProps.fetchQueryData}
            //         contentHeight={crProps.contentHeight}
            //         styling={crProps.styling}
            //         updateContent={crProps.updateContent}

            //         fetchContentFn={crProps.fetchContentFn}
            //         fetchContentDatesFn={crProps.fetchContentDatesFn}
            //     />)
            // })
            return (
                <>
                    {
                        editable ?
                            <this.editor
                                content={crProps.content}
                                setContent={crProps.setContent}
                                fetchQueryData={crProps.fetchQueryData}
                                fetchStorages={crProps.fetchStorages}
                                fetchTableList={crProps.fetchTableList}
                                fetchTableColumns={crProps.fetchTableColumns}
                                contentHeight={crProps.contentHeight}
                                updateContent={crProps.setContent}
                                styling={forceStyle ? crProps.styling : styles.editorField}

                                fetchContentFn={crProps.fetchContentFn}
                                fetchContentDatesFn={crProps.fetchContentDatesFn}
                                parentInfo={crProps.parentInfo}
                                addElement={crProps.addElement}

                                setNewestContent={crProps.setNewestContent}
                            />
                            : <this.presenter
                                editable={crProps.editable}
                                initialValue={crProps.initialValue}
                                onSave={crProps.onSave}
                                content={crProps.content}
                                setContent={crProps.setContent}
                                fetchQueryData={crProps.fetchQueryData}
                                contentHeight={crProps.contentHeight}
                                styling={crProps.styling}
                                updateContent={crProps.setContent}
                                // ref={prRef}
                                fetchContentFn={crProps.fetchContentFn}
                                fetchContentDatesFn={crProps.fetchContentDatesFn}
                                parentInfo={crProps.parentInfo}
                            />
                    }
                </>

            )
        }

        return forwardRef((props: ConvertProps, ref: React.Ref<ConvertFwRef>) =>
            <ConvertRef
                editable={props.editable}
                initialValue={props.initialValue}
                onSave={props.onSave}
                content={props.content}
                setContent={props.setContent}
                setNewestContent={props.setNewestContent}
                fetchStorages={props.fetchStorages}
                fetchTableList={props.fetchTableList}
                fetchTableColumns={props.fetchTableColumns}
                fetchQueryData={props.fetchQueryData}
                contentHeight={props.contentHeight}
                updateContent={props.setContent}
                styling={props.styling}
                forwardedRef={ref}

                fetchContentFn={props.fetchContentFn}
                fetchContentDatesFn={props.fetchContentDatesFn}
                parentInfo={props.parentInfo!}
                addElement={props.addElement!}
            />
        )
    }
}

