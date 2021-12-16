/**
 * Created by Jacob Xie on 10/19/2020.
 */

import { useEffect, useState, useRef, RefObject } from "react"
import { Button, message, Modal, Space, Form, FormInstance, Radio } from "antd"
import ProForm, { ModalForm, StepsForm } from "@ant-design/pro-form"
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons"
import { FormattedMessage, useIntl } from "umi"
import ReactEcharts from "echarts-for-react"
import _ from "lodash";

import { QuerySelectorModal, AutoDraftingModal } from "@/components/Gallery/Dataset"

import { ModuleEditorField, ModulePresenterField } from "../../../Generator/data"
import * as DataType from "../../../../GalleryDataType"
import { DisplayForm } from "./DisplayForm"
import { ColumnIdentifier } from "@/components/Gallery/Dataset/ColumnIdentifier/ColumnIdentifierItems"
import { ChartOptionGenerator, Mixin, UnionChartConfig } from "@/components/Gallery/Utils/data"
// import useMappingWay from './useMappingWay'

export const generateCommonEditorField = (mixin?: Mixin) =>
  (props: ModuleEditorField) => {
    const intl = useIntl()
    const [visibleCustomDrawing, setVisibleCustomDrawing] = useState(false)
    const [visibleAutoDrafting, setVisibleAutoDrafting] = useState(false)

    const [content, setContent] = useState<DataType.Content | undefined>(props.content)
    const [dataAvailable, setDataAvailable] = useState(false)
    const [columns, setColumns] = useState<string[]>(props.content?.data?.selects)
    const formRef: React.MutableRefObject<FormInstance<any> | undefined> | undefined = useRef()

    // 制图方式
    const [mappingWay, setMappingWay] = useState<'autogeneration' | 'custom'>('autogeneration')

    // 如果有数据，dataAvailable变绿
    useEffect(() => {
      if (!_.isEmpty(content?.data)) {
        setDataAvailable(true)
      }
    }, [content])


    // 保存【数据源配置】
    const saveDataSourceConfig = (dataSourceConfig: Record<string, any>) => {

      let ctt;
      if (mappingWay === 'autogeneration') {
        if (mixin === 'pie') {
          ctt = {
            ...content!,
            storageType: DataType.StorageType.PG,
            data: dataSourceConfig,
            config: {
              select: dataSourceConfig.selects[0],
              seriesDir: 'vertical'
            }
          }
        } else if (mixin === 'line' || mixin === 'bar') {
          ctt = {
            ...content!,
            storageType: DataType.StorageType.PG,
            data: dataSourceConfig,
            config: {
              x: {
                column: dataSourceConfig.selects[0],
                type: 'category'
              },
              y: [{
                columns: dataSourceConfig.selects.slice(1),
                type: 'value',
                position: 'left'
              }]
            },

          }
        } else if (mixin === 'scatter') {
          ctt = {
            ...content!,
            storageType: DataType.StorageType.PG,
            data: dataSourceConfig,
            config: {
              scatter: [{
                min: 0,
                max: 100,
                column: dataSourceConfig.selects[1],
                size: dataSourceConfig.selects[2],
              }],
              x: {
                column: dataSourceConfig.selects[0],
                type: 'category'
              },
              y: [{
                columns: dataSourceConfig.selects.slice(1, 2),
                type: 'value',
                position: 'left'
              }]
            }
          }
          console.log(100, ctt)
        }

        // 因为智能制图只有一个步骤，所以直接更改props.setContent
        if (props.setContent) {
          props.setContent(ctt)
        }

      } else if (mappingWay === 'custom') {
        ctt = {
          ...content!,
          storageType: DataType.StorageType.PG,
          data: dataSourceConfig
        }
        // 自定义制图还有后续步骤，所以只更改setContent
        setContent(ctt)
      }

      console.log(32, dataSourceConfig, ctt)

      setColumns(dataSourceConfig.selects)
      // setDataAvailable(true)

      setVisibleAutoDrafting(false)
      return true
    }



    // 保存【显示配置】
    const saveDisplayConfig = async (values: Record<string, any>) => {
      console.log(466, values, formRef)
      if (content) {
        console.log(466, content)
        const ctt = {
          ...content,
          config: {
            ...values,
            mappingWay
          },
          databaseType: DataType.StorageType.PG,

        }
        if (props.setContent) {
          console.log(4666, ctt)
          props.setContent(ctt)
        }

        message.success("Updating succeeded!")
      } else {
        message.warn("Updating failed! dataset and options are required!")
      }
      setVisibleCustomDrawing(false)
    }

    const dataSelectOnFinish = async () => {
      if (content?.data === undefined || content?.data.length === 0) {
        message.warn("Please choose your data!")
        return false
      }
      return true
    }



    useEffect(() => {
      console.log(130, mappingWay, visibleAutoDrafting, visibleCustomDrawing)
    }, [mappingWay, visibleAutoDrafting, visibleCustomDrawing])

    // 智能制图
    const autoDrafting = <div className={props.styling}>
      <AutoDraftingModal
        storagesOnFetch={props.fetchStorages!}
        storageOnSelect={props.fetchTableList!}
        tableOnSelect={props.fetchTableColumns!}
        onSubmit={saveDataSourceConfig}
        content={content}
        columnsRequired
        initialValues={content?.data}
        visibleAutoDrafting={visibleAutoDrafting}
        setVisibleAutoDrafting={setVisibleAutoDrafting}
      />
    </div >

    // 自定义制图
    const customDrawing = <div className={props.styling}>
      <StepsForm
        onFinish={saveDisplayConfig}
        formRef={formRef}

        stepsFormRender={(dom, submitter) =>
          <Modal
            title={intl.formatMessage({ id: "gallery.component.module-panel.graph.utils.common1" })}
            visible={visibleCustomDrawing}
            onCancel={() => setVisibleCustomDrawing(false)}
            footer={submitter}
            destroyOnClose
            width="60vw"
          >
            {dom}
          </Modal>
        }
      >
        {/* 第一步 */}
        <StepsForm.StepForm
          name="data"
          title={intl.formatMessage({ id: "gallery.component.general43" })}
          onFinish={dataSelectOnFinish}
        >

          {/* 【选择数据集】modal */}
          <ProForm.Group
            title={<FormattedMessage id="gallery.component.module-panel.collections.file-view3" />}
          >

            <Space align="baseline">
              <QuerySelectorModal
                trigger={
                  <Button
                    type='primary'
                    style={{ marginBottom: 20 }}
                  >
                    <FormattedMessage id="gallery.component.module-panel.collections.file-view4" />
                  </Button>
                }
                storagesOnFetch={props.fetchStorages!}
                storageOnSelect={props.fetchTableList!}
                tableOnSelect={props.fetchTableColumns!}
                onSubmit={saveDataSourceConfig}
                content={content}
                columnsRequired
                initialValues={content?.data}
              />
              {/* ❌ */}
              {
                dataAvailable ?
                  <CheckCircleTwoTone twoToneColor="green" /> :
                  <CloseCircleTwoTone twoToneColor="red" />
              }
            </Space>
          </ProForm.Group>

          {/* 数据修整 */}
          <ProForm.Group
            title={<FormattedMessage id="gallery.component.module-panel.collections.file-view5" />}
          >
            <ColumnIdentifier columns={columns!} />
          </ProForm.Group>
        </StepsForm.StepForm>

        {/*第二步  */}
        <StepsForm.StepForm
          name="display"
          title={intl.formatMessage({ id: "gallery.component.general43" })}
          initialValues={props.content?.config ? props.content.config : { x: { type: "category" }, seriesDir: "vertical" }}
        >
          <div className="displayConfigStyle">
            <DisplayForm
              formRef={formRef}
              mixin={mixin}
              columns={columns}
            />
          </div>
          {/* <div>123</div> */}
        </StepsForm.StepForm>
      </StepsForm>
    </div>
    // const [mappingWayModal,setMappingWayModal]=useState(false)

    return (
      (<div className={props.styling}>
        <ModalForm
          width={300}
          title={<FormattedMessage id="gallery.component.general70" />}
          onFinish={() => {
            console.log(126)

            mappingWay === 'autogeneration'
              ?
              setVisibleAutoDrafting(true)
              :
              setVisibleCustomDrawing(true)

            return Promise.resolve(true)
          }}
          trigger={
            <Button
              type="primary"
            >
              <FormattedMessage id="gallery.component.general42" />
            </Button>
          }
        >


          <Radio.Group

            onChange={(e) => {
              setMappingWay(e.target.value)
            }} defaultValue={'autogeneration'} >
            <Radio value="autogeneration" >
              智能制图
            </Radio>
            < Radio value="custom" >
              自定义
            </Radio>
          </Radio.Group>
        </ModalForm>
        {autoDrafting}
        {customDrawing}

      </div >)
    )

  }

// 展示
export const generateCommonPresenterField =
  // todo: fix `config: any`
  (chartOptionGenerator: ChartOptionGenerator) =>
    (props: ModulePresenterField) => {

      console.log(272, props)
      const [data, setData] = useState<any[]>()
      useEffect(() => {
        if (props.fetchQueryData && props.content) {
          //validate content
          if (!_.isEmpty(props.content.data) && DataType.PgContentValidation(props.content.data))
            props.fetchQueryData(props.content).then(res => {
              console.log(159, res)
              setData(res)
            }
            )
        }
      }, [props.content])


      if (data && props.content && props.content.config) {

        console.log(151, chartOptionGenerator(data, props.content.config as UnionChartConfig))
        // let tem = chartOptionGenerator(data, props.content.config as UnionChartConfig)
        // tem.xAxis = tem.yAxis;
        // tem.yAxis = chartOptionGenerator(data, props.content.config as UnionChartConfig).xAxis
        return (
          <ReactEcharts
            notMerge={true}
            option={chartOptionGenerator(data, props.content.config as UnionChartConfig)}
            style={{ height: '100%' }}
            theme={props.content.config.style || "default"}
          />
        )
      }
      return <></>
    }

