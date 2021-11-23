
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
    console.log(200, props)
    return (
        <Row className={"priceChart"} align="middle">
            <Col span={3} offset={1} className={"minPrice"}> 123</Col>
            <Col span={16} className="section">区间</Col>
            <Col span={3} offset={1} className={"topPrice"}>{props?.content?.data?.topPrice}</Col>
        </Row>
    )
}
export const PriceChart = new ModuleGenerator(EditorField, PresenterField).generate()
