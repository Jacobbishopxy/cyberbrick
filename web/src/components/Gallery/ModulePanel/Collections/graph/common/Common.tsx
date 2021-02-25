/**
 * Created by Jacob Xie on 10/19/2020.
 */

import {useEffect, useState} from 'react'
import {Button, message, Modal, Space} from "antd"
import ProForm, {StepsForm} from "@ant-design/pro-form"
import {CheckCircleTwoTone, CloseCircleTwoTone} from "@ant-design/icons"
import {FormattedMessage, useIntl} from "umi"
import ReactEcharts from "echarts-for-react"

import {QuerySelectorModal} from "@/components/Gallery/Dataset"

import {ModuleEditorField, ModulePresenterField} from "../../../Generator/data"
import * as DataType from "../../../../GalleryDataType"
import {DisplayForm} from "./DisplayForm"
import {ColumnIdentifier} from "@/components/Gallery/Dataset/ColumnIdentifier/ColumnIdentifierItems"
import {ChartOptionGenerator, Mixin, UnionChartConfig} from "@/components/Gallery/Utils/data"


export const generateCommonEditorField = (mixin?: Mixin) =>
  (props: ModuleEditorField) => {
    const intl = useIntl()
    const [visible, setVisible] = useState(false)
    const [content, setContent] = useState<DataType.Content | undefined>(props.content)
    const [dataAvailable, setDataAvailable] = useState(false)
    const [columns, setColumns] = useState<string[]>()

    const saveContentData = (data: Record<string, any>) => {
      const ctt = {
        ...content!,
        date: DataType.today(),
        data
      }
      setContent(ctt)
      setColumns(data.selects)
      setDataAvailable(true)

      return true
    }


    const saveContent = async (values: Record<string, any>) => {
      if (content) {
        const ctt = {...content, config: values}
        props.updateContent(ctt)
        message.success("Updating succeeded!")
      } else {
        message.warn("Updating failed! dataset and options are required!")
      }
      setVisible(false)
    }

    const dataSelectOnFinish = async () => {
      if (content?.data === undefined || content?.data.length === 0) {
        message.warn("Please choose your data!")
        return false
      }
      return true
    }

    return (
      <div className={props.styling}>
        <Button
          type="primary"
          onClick={() => setVisible(true)}
        >
          <FormattedMessage id="gallery.component.general42" />
        </Button>

        <StepsForm
          onFinish={saveContent}
          stepsFormRender={(dom, submitter) =>
            <Modal
              title={intl.formatMessage({id: "gallery.component.module-panel.graph.utils.common1"})}
              visible={visible}
              onCancel={() => setVisible(false)}
              footer={submitter}
              destroyOnClose
              width="60vw"
            >
              {dom}
            </Modal>
          }
        >
          <StepsForm.StepForm
            name="data"
            title={intl.formatMessage({id: "gallery.component.general43"})}
            onFinish={dataSelectOnFinish}
          >
            <ProForm.Group
              title={<FormattedMessage id="gallery.component.module-panel.collections.file-view3" />}
            >
              <Space align="baseline">
                <QuerySelectorModal
                  trigger={
                    <Button
                      type='primary'
                      style={{marginBottom: 20}}
                    >
                      <FormattedMessage id="gallery.component.module-panel.collections.file-view4" />
                    </Button>
                  }
                  storagesOnFetch={props.fetchStorages!}
                  storageOnSelect={props.fetchTableList!}
                  tableOnSelect={props.fetchTableColumns!}
                  onSubmit={saveContentData}
                  columnsRequired
                />
                {
                  dataAvailable ?
                    <CheckCircleTwoTone twoToneColor="green" /> :
                    <CloseCircleTwoTone twoToneColor="red" />
                }
              </Space>
            </ProForm.Group>

            <ProForm.Group
              title={<FormattedMessage id="gallery.component.module-panel.collections.file-view5" />}
            >
              <ColumnIdentifier columns={columns!} />
            </ProForm.Group>
          </StepsForm.StepForm>

          <StepsForm.StepForm
            name="display"
            title={intl.formatMessage({id: "gallery.component.general43"})}
            initialValues={{x: {type: "category"}, seriesDir: "vertical"}}
          >
            <DisplayForm
              mixin={mixin}
              columns={columns}
            />
          </StepsForm.StepForm>
        </StepsForm>
      </div>
    )
  }

export const generateCommonPresenterField =
  // todo: fix `config: any`
  (chartOptionGenerator: ChartOptionGenerator) =>
    (props: ModulePresenterField) => {

      const [data, setData] = useState<any[]>()

      useEffect(() => {
        if (props.fetchQueryData && props.content) {
          if (props.content.data)
            props.fetchQueryData(props.content).then(res => setData(res))
        }
      }, [props.content])


      if (data && props.content && props.content.config)
        return <ReactEcharts
          option={chartOptionGenerator(data, props.content.config as UnionChartConfig)}
          style={{height: props.contentHeight}}
          theme={props.content.config.style || "default"}
        />
      return <></>
    }

