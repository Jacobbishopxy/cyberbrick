import { Layout } from "react-grid-layout";
import { Content, ElementType } from "../../../components/Gallery/GalleryDataType";

export interface tabItem extends Layout {
    text: string,
    module?: simpleEmbededModule
}

export interface SimpleEmbededModule {
    name: string,
    timeSeries: boolean,
    elementType: ElementType,
    content?: Content
}
