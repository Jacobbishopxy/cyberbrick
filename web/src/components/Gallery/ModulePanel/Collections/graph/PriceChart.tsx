
import { ModuleEditorField, ModulePresenterField } from "../../Generator/data"
import { ModuleGenerator } from "../../Generator/ModuleGenerator"
import { Row, Col } from 'antd'
import './styles.less'
interface PriceChartProps {
    minimumPrice: string,
    topPrice: string,
    medianPrice: string,
    targetPrice: string
}
const EditorField = () => {
    return (
        <div>123</div>
    )
}

const PresenterField = (props: ModulePresenterField) => {
    return (
        <Row className={"priceChart"} align="middle">
            <Col span={3} offset={1} className={"minPrice"}>最低价</Col>
            <Col span={16} className="section">区间</Col>
            <Col span={3} offset={1} className={"topPrice"}>最高价</Col>
        </Row>
    )
}
export const PriceChart = new ModuleGenerator(EditorField, PresenterField).generate()
