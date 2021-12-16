import { PropertySafetyTwoTone } from "@ant-design/icons"
import { Modal, Radio } from "antd"
import { useEffect, useState } from "react"


export default (onOk: (...args: any[]) => any) => {
  const [mappingWay, setMappingWay] = useState<'autogeneration' | 'custom'>('autogeneration')
  // useEffect(() => {
  //   console.log(14, mappingWay)
  // }, [mappingWay])
  function showMappingWayModal() {
    Modal.confirm({
      title: '制图方式',
      content: (
        <Radio.Group onChange={(e) => {
          setMappingWay(e.target.value)
        }} defaultValue={'autogeneration'} >
          <Radio value="autogeneration" >
            智能制图
          </Radio>
          < Radio value="custom" >
            自定义
          </Radio>
        </Radio.Group>
      ),
      onOk: onOk
    })
  }
  return [mappingWay, showMappingWayModal]
}