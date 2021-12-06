/**
 * Created by Jacob Xie on 2/25/2021
 */

import { Mixin } from "@/components/Gallery/Utils/data"
import { DisplayFormCartesianCoord } from "./DisplayFormCartesianCoord"
import { DisplayFormSeriesPie } from "./DisplayFormSeriesPie"
import { FormInstance } from 'antd'

interface DisplayFormProps {
    mixin: Mixin
    columns?: string[]
    formRef: React.MutableRefObject<FormInstance<any> | undefined> | undefined
}

export const DisplayForm = (props: DisplayFormProps) => {
    switch (props.mixin) {
        case "pie":
            return <DisplayFormSeriesPie columns={props.columns} />
        default:
            return <DisplayFormCartesianCoord mixin={props.mixin} columns={props.columns} formRef={props.formRef} />
    }
}

