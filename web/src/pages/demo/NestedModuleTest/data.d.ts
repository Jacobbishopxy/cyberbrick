import { Layout } from "react-grid-layout";

export interface tabItem extends Layout {
    text: string,
}
export interface Module {
    id: string
    module: ModulePanelProps
}
export interface ContentWithId {
    id: string,
    content: Content
}