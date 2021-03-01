/**
 * Created by Jacob Xie on 2/24/2021
 */

import ProForm, {ProFormRadio, ProFormSelect} from "@ant-design/pro-form"
import {Divider} from "antd"
import {FormattedMessage} from "umi"

import {DisplayFormThemeSelector} from "./DisplayFormThemeSelector"


const seriesDirOptions = [
  {
    value: "vertical",
    label: <FormattedMessage id="gallery.component.general57" />
  },
  {
    value: "horizontal",
    label: <FormattedMessage id="gallery.component.general58" />
  },
]

export interface DisplayFormSeriesPieProps {
  columns?: string[]
}

export const DisplayFormSeriesPie = (props: DisplayFormSeriesPieProps) =>
  props.columns ? (
    <>
      <ProForm.Group
        title={<FormattedMessage id="gallery.component.module-panel.graph.utils.display-form8" />}
      >
        <ProFormSelect
          name="select"
          label={<FormattedMessage id="gallery.component.module-panel.graph.utils.display-form9" />}
          options={props.columns.map(c => ({value: c, label: c}))}
          width="lg"
        />
        <ProFormRadio.Group
          name="seriesDir"
          label={<FormattedMessage id="gallery.component.module-panel.graph.utils.display-form10" />}
          options={seriesDirOptions}
        />
      </ProForm.Group>

      <Divider />

      <DisplayFormThemeSelector />
    </>
  ) : <></>

