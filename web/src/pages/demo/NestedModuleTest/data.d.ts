import { Layout } from "react-grid-layout";
import { Content, ElementType } from "../../../components/Gallery/GalleryDataType";

export interface tabItem extends Layout {
    text: string,
    module?: simpleEmbededModule,
    tabContent?: tabContentChoice | string,
    tabType?: tabType
}

export interface SimpleEmbededModule {
    name: string,
    timeSeries: boolean,
    elementType: ElementType,
    content?: Content
}

export enum TabType {
    icon = "icon",
    text = "text",
    number = "number",
}

export interface TabChoice {
    key: string,
    icon: JSX.Element,
    tabType: string,
}

export enum tabContentChoice {
    AreaChartOutlined = "AreaChartOutlined",
    PieChartOutlined = "PieChartOutlined",
    BarChartOutlined = "BarChartOutlined",
    DotChartOutlined = "DotChartOutlined",
    LineChartOutlined = "LineChartOutlined",
    FallOutlined = "FallOutlined",
    RiseOutlined = "RiseOutlined",
    StockOutlined = "StockOutlined",
    AccountBookOutlined = "AccountBookOutlined",
    BellOutlined = "BellOutlined",
}