import { AccountBookOutlined, AreaChartOutlined, BarChartOutlined, BellOutlined, DotChartOutlined, FallOutlined, FieldBinaryOutlined, FileTextOutlined, LineChartOutlined, PieChartOutlined, RiseOutlined, StockOutlined } from "@ant-design/icons";
import { Space } from "antd";

export const iconChoice = [
    { key: "AreaChartOutlined", icon: <AreaChartOutlined />, tabType: "icon" },
    { key: "PieChartOutlined", icon: <PieChartOutlined />, tabType: "icon" },
    { key: "BarChartOutlined", icon: <BarChartOutlined />, tabType: "icon" },
    { key: "DotChartOutlined", icon: <DotChartOutlined />, tabType: "icon" },
    { key: "LineChartOutlined", icon: <LineChartOutlined />, tabType: "icon" },
    { key: "FallOutlined", icon: <FallOutlined />, tabType: "icon" },
    { key: "RiseOutlined", icon: <RiseOutlined />, tabType: "icon" },
    { key: "StockOutlined", icon: <StockOutlined />, tabType: "icon" },
    { key: "AccountBookOutlined", icon: <AccountBookOutlined />, tabType: "icon" },
    { key: "BellOutlined", icon: <BellOutlined />, tabType: "icon" },

]
const tabLabel = {
    fontSize: "20px"
}
export const articleChoice = [
    {
        key: "FileTextOutlined", icon:
            <Space>
                <FileTextOutlined />
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