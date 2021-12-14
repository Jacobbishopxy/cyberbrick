/**
 * Created by Jacob Xie on 2/25/2021
 */

import ProForm from "@ant-design/pro-form"
import { Form, Select } from "antd"
import { FormattedMessage } from "umi"

import { themeSelections } from "@/components/EchartsPro/themeSelections"


export const DisplayFormThemeSelector = () =>
  <div className="themeSelectStyle">
    <ProForm.Group

      title={<FormattedMessage id="gallery.component.module-panel.graph.utils.display-form7" />}
    >
      <Form.Item
        name="style"
        label={<FormattedMessage id="gallery.component.module-panel.graph.utils.display-form6" />}
      >
        <Select
          placeholder="Select a theme for display"
          style={{ width: 250 }}
        >
          {themeSelections.map(t => <Select.Option key={t.name} value={t.name}>{t.ele}</Select.Option>)}
        </Select>
      </Form.Item>
    </ProForm.Group>
  </div>
