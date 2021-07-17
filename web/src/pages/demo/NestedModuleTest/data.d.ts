import { Layout } from "react-grid-layout";
import { Content } from "../../../components/Gallery/GalleryDataType";

export interface tabItem extends Layout {
    text: string,
}
export interface Module {
    id: string
    module: JSX.Element
}
export interface ContentWithId {
    id: string,
    content: Content
}