
import React, { forwardRef, useState } from 'react';
import { CSSProperties } from 'react';
import { tabContentChoice, tabItem } from '../data';

import { ElementType } from '@/components/Gallery/GalleryDataType';

import { getChoiceElement } from './TabChoice';


interface createElementProps {
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

export const CreateElement = forwardRef((props: createElementProps, ref) => {
    const { editable, el, onRemoveItem } = props
    const [submitted, setSubmitted] = useState(false)



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
        // title={editable ? "Double click to edit" : ""}
        >
            {headerContent}
        </span>)
    }




    return (
        <div >
            {(editable && props.isHover) ?
                null : null
            }
            {displayHeader()}


        </div >
    );
})