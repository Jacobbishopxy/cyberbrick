import { AccountBookOutlined, AreaChartOutlined, BarChartOutlined, BellOutlined, DotChartOutlined, FallOutlined, FieldBinaryOutlined, FileTextOutlined, LineChartOutlined, PieChartOutlined, RiseOutlined, StockOutlined, FileExcelOutlined, FileSearchOutlined, TranslationOutlined } from "@ant-design/icons";
import { Space } from "antd";

export const iconChoice = [
    // { key: "AreaChartOutlined", icon: <AreaChartOutlined />, tabType: "icon" },

    // text
    { key: "FileTextOutlined", icon: <FileTextOutlined />, tabType: "icon" },
    // 目标价
    { key: "AccountBookOutlined", icon: <AccountBookOutlined />, tabType: "icon" },
    // 价位图
    { key: "BellOutlined", icon: <BellOutlined />, tabType: "icon" },
    // excel
    { key: "FileExcelOutlined", icon: <FileExcelOutlined />, tabType: "icon" },
    // 数据集
    { key: "FileSearchOutlined", icon: <FileSearchOutlined />, tabType: "icon" },
    // 折线图
    { key: "LineChartOutlined", icon: <LineChartOutlined />, tabType: "icon" },
    // 柱状图
    { key: "BarChartOutlined", icon: <BarChartOutlined />, tabType: "icon" },
    // 饼图
    { key: "PieChartOutlined", icon: <PieChartOutlined />, tabType: "icon" },
    // 气泡图
    { key: "DotChartOutlined", icon: <DotChartOutlined />, tabType: "icon" },
    // { key: "FallOutlined", icon: <FallOutlined />, tabType: "icon" },
    // { key: "RiseOutlined", icon: <RiseOutlined />, tabType: "icon" },
    // { key: "StockOutlined", icon: <StockOutlined />, tabType: "icon" },
]

export const iconMapText = {
    FileTextOutlined: '文章',
    AccountBookOutlined: '目标价',
    BellOutlined: '价位图',
    FileExcelOutlined: 'excel表格',
    FileSearchOutlined: '数据集表格',
    PieChartOutlined: '饼图',
    BarChartOutlined: '柱状图',
    DotChartOutlined: '气泡图',
    LineChartOutlined: '折线图',
    TranslationOutlined: '文字',
    FieldBinaryOutlined: '序号'
}


const tabLabel = {
    fontSize: "20px"
}
export const articleChoice = [
    {
        key: "TranslationOutlined", icon:
            <Space>
                <TranslationOutlined />
                <div style={tabLabel}> text </div>
            </Space>
        ,
        tabType: "text"
    },
    {
        key: "FieldBinaryOutlined", icon:
            <Space>
                <FieldBinaryOutlined />
                <div style={tabLabel}> number </div>
            </Space>, tabType: "number"
    }
]

export const tabSelectChunk = [
    { key: "Icon", children: iconChoice },
    { key: "Article", children: articleChoice }
]

export const getChoiceElement = (v: string) => {
    switch (v) {
        case "AreaChartOutlined":
            return <AreaChartOutlined />
        case "FileTextOutlined":
            return <FileTextOutlined />
        case "FileExcelOutlined":
            return <FileExcelOutlined />
        case "FileSearchOutlined":
            return <FileSearchOutlined />
        case "PieChartOutlined":
            return <PieChartOutlined />
        case "BarChartOutlined":
            return <BarChartOutlined />
        case "DotChartOutlined":
            return <DotChartOutlined />
        case "LineChartOutlined":
            return <LineChartOutlined />
        case "FallOutlined":
            return <FallOutlined />
        case "RiseOutlined":
            return <RiseOutlined />
        case "StockOutlined":
            return <StockOutlined />
        case "AccountBookOutlined":
            return <AccountBookOutlined />
        case "BellOutlined":
            return <BellOutlined />
        default:
            return <div> {v}</div>
    }
}