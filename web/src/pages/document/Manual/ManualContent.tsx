/**
 * Created by Jacob Xie on 1/20/2021
 */

import React from 'react'
import {Divider, Image, Space, Typography} from "antd"

import {anchorList} from "./anchorList"
import Styling from "./Style.less"


const {Title, Paragraph, Text, Link} = Typography

const imageSrc = (name: string) =>
  `/api/manual/getManualImage?name=${encodeURI(name)}`

const routeConfiguration = "/gallery/configuration"
const routeDataset = "/gallery/dataset"
const routeDashboard = "/gallery/dashboard"

export const ManualContent = () => {

  return (
    <Typography>
      <Space direction="vertical" size="large">

        <div id={anchorList[0].id}>
          <Title>1. 基础配置</Title>
          <Paragraph>
            <Text strong>
              基础配置分为三部分: 数据库，族群，以及仪表盘。
            </Text>
          </Paragraph>
          <Paragraph>
            <ol>
              <li>
                数据库由管理员设置，用于连接私有数据库，以及第三方数据库。
              </li>
              <li>
                族群可以理解为大的分类，例如以行业进行分类，用于管理其名下的所有仪表盘。
              </li>
              <li>
                仪表盘为展示界面，提供自定义的子版块配置。
              </li>
            </ol>
          </Paragraph>
        </div>

        <div id={anchorList[0].children![0].id}>
          <Title level={2}>a. 数据库</Title>
          <Paragraph>
            此配置用于连接私有数据库，以及第三方数据库。
            点击<Link href={routeConfiguration}>配置界面</Link>
            下的<Text strong mark>Storage</Text>进行数据库连接等操作
            <Text type="secondary">（研究员可忽略此步骤）</Text>。
          </Paragraph>
          <Paragraph>
            1. 查看界面
            <br/>
            <Image
              src={imageSrc("database-config.jpg")}
              className={Styling.manualImg}
            />
            <br/>
            2. 新增界面
            <br/>
            <Image
              src={imageSrc("database-config1.jpg")}
              className={Styling.manualImg}
            />
          </Paragraph>
        </div>

        <div id={anchorList[0].children![1].id}>
          <Title level={2}>b. 族群</Title>
          <Paragraph>
            点击<Link href={routeConfiguration}>配置界面</Link>
            下的<Text strong mark>Category</Text>进行族群设置。
          </Paragraph>
          <Paragraph>
            <Image
              src={imageSrc("category-config.jpg")}
              className={Styling.manualImg}
            />
          </Paragraph>
        </div>

        <div id={anchorList[0].children![2].id}>
          <Title level={2}>c. 仪表盘</Title>
          <Paragraph>
            点击<Link href={routeConfiguration}>配置界面</Link>
            下的<Text strong mark>Dashboard</Text>进行仪表板设置。
          </Paragraph>
          <Paragraph>
            <Image
              src={imageSrc("dashboard-config.jpg")}
              className={Styling.manualImg}
            />
          </Paragraph>
        </div>

        <Divider/>

        <div id={anchorList[1].id}>
          <Title>2. 数据集</Title>
          <Paragraph>
            数据集用于存储用户数据，并且提供一个维护数据（增删改查）的渠道。
            <br/>
            仪表板中大部分的模块（表格，图形）会引用到数据集中的数据，
            因此维护好数据集中的数据至关重要。
            <br/>
            点击<Link href={routeDataset}>数据集界面</Link>进行操作。
          </Paragraph>
          <Paragraph>
            <Image
              src={imageSrc("dataset.jpg")}
              className={Styling.manualImg}
            />
          </Paragraph>
        </div>

        <div id={anchorList[1].children![0].id}>
          <Title level={2}>a. 导入/导出数据</Title>
          <Paragraph>
            <Title level={3}>1) 导入数据</Title>
            <Text strong>文件支持XLSX与CSV</Text>
          </Paragraph>
          <Paragraph>
            <Image
              src={imageSrc("dataset-upload.jpg")}
              className={Styling.manualImg}
            />
            <Text strong>文件格式</Text>
            <Image
              src={imageSrc("dataset-file-format.jpg")}
              className={Styling.manualImg}
            />
          </Paragraph>
          <Paragraph>
            <Title level={3}>2) 导出数据</Title>
            <br/>
            <Text type="secondary">施工中...</Text>
          </Paragraph>
        </div>

        <div id={anchorList[1].children![1].id}>
          <Title level={2}>b. 查询数据</Title>
          <Paragraph>
            <Title level={3}>1) 全查询</Title>
            <Image
              src={imageSrc("dataset-query.jpg")}
              className={Styling.manualImg}
            />
          </Paragraph>
          <Paragraph>
            <Title level={3}>2) 条件查询</Title>
            <Image
              src={imageSrc("dataset-query1.jpg")}
              className={Styling.manualImg}
            />
          </Paragraph>
        </div>

        <Divider/>

        <div id={anchorList[2].id}>
          <Title>3. 仪表盘</Title>
          <Paragraph>
            仪表盘用于展示用户数据，提供多种类型的展示方式以及自定义的面板。
            <br/>
            点击<Link href={routeDashboard}>仪表盘界面</Link>进行操作。
          </Paragraph>
        </div>

        <div id={anchorList[2].children![0].id}>
          <Title level={2}>a. 查看</Title>
          <Paragraph>
            <Image
              src={imageSrc("dashboard.jpg")}
              className={Styling.manualImg}
            />
          </Paragraph>
        </div>

        <div id={anchorList[2].children![1].id}>
          <Title level={2}>b. 编辑</Title>
          <Paragraph>
            <Title level={3}>1) 单模块添加</Title>
            <Image
              src={imageSrc("dashboard-new.jpg")}
              className={Styling.manualImg}
            />
            <Image
              src={imageSrc("dashboard-new1.jpg")}
              className={Styling.manualImg}
            />
            <Image
              src={imageSrc("dashboard-new2.jpg")}
              className={Styling.manualImg}
            />
            <Title level={3}>2) 已有子模板拷贝</Title>
            <Text strong>只拷贝整体模板布局，非内容拷贝。</Text>
            <Image
              src={imageSrc("dashboard-new3.jpg")}
              className={Styling.manualImg}
            />
            <Image
              src={imageSrc("dashboard-new4.jpg")}
              className={Styling.manualImg}
            />
          </Paragraph>
        </div>

        <div id={anchorList[2].children![2].id}>
          <Title level={2}>c. 模板</Title>
          <Paragraph>
            模板为构成仪表盘中子界面的基本元素，现有模板分为4大类
            <Text type="secondary">（未来开发过程中可能会有变动）</Text>：
            <ul>
              <li>功能类</li>
              <li>文件类</li>
              <li>表格类</li>
              <li>图形类</li>
            </ul>
          </Paragraph>
          <Paragraph>
            <Title level={3}>模板时序功能</Title>
            当需要在仪表盘中记录时序数据或展示时，我们以
            <Text strong mark>Text</Text>模板为例：
            <Image
              src={imageSrc("dashboard-edit1.jpg")}
              className={Styling.manualImg}
            />
            <Image
              src={imageSrc("dashboard-edit2.jpg")}
              className={Styling.manualImg}
            />
            <Image
              src={imageSrc("dashboard-edit3.jpg")}
              className={Styling.manualImg}
            />
          </Paragraph>
        </div>

        <div id={anchorList[2].children![2].children![0].id}>
          <Title level={3}>[模板]链接</Title>
          <Text strong>注：不是所有外部网页可以引用，具体由网页的提供方是否授权。</Text>
          <Image
            src={imageSrc("module-link.jpg")}
            className={Styling.manualImg}
          />
          <Image
            src={imageSrc("module-link1.jpg")}
            className={Styling.manualImg}
          />
        </div>

        <div id={anchorList[2].children![2].children![1].id}>
          <Title level={3}>[模板]文章</Title>
          <Image
            src={imageSrc("module-text.jpg")}
            className={Styling.manualImg}
          />
          <Image
            src={imageSrc("module-text1.jpg")}
            className={Styling.manualImg}
          />
        </div>

        <div id={anchorList[2].children![2].children![2].id}>
          <Title level={3}>[模板]目标价</Title>
          <Image
            src={imageSrc("module-target-price.jpg")}
            className={Styling.manualImg}
          />
          <Image
            src={imageSrc("module-target-price1.jpg")}
            className={Styling.manualImg}
          />
        </div>

        <div id={anchorList[2].children![2].children![3].id}>
          <Title level={3}>[模板]文件管理</Title>
          <Image
            src={imageSrc("module-file-management.jpg")}
            className={Styling.manualImg}
          />
          <Image
            src={imageSrc("module-file-management1.jpg")}
            className={Styling.manualImg}
          />
        </div>

        <div id={anchorList[2].children![2].children![4].id}>
          <Title level={3}>[模板]表格</Title>
          表格现在分为两类：
          <ul>
            <li><Text strong>Xlsx风格表</Text>: 提供类似Excel风格的表格，无类型约束并且可以切换工作簿。</li>
            <li><Text strong>普通表格</Text>: 支持上传Excel文件以及直接引用Dataset中的表。</li>
          </ul>
          <Title level={4}>Xlsx风格表</Title>
          <Image
            src={imageSrc("module-table-xlsx.jpg")}
            className={Styling.manualImg}
          />
          <Image
            src={imageSrc("module-table-xlsx1.jpg")}
            className={Styling.manualImg}
          />
          <Image
            src={imageSrc("module-table-xlsx2.jpg")}
            className={Styling.manualImg}
          />
          <Image
            src={imageSrc("module-table-xlsx3.jpg")}
            className={Styling.manualImg}
          />
          <Title level={4}>普通表格</Title>
          <Image
            src={imageSrc("module-table-flex.jpg")}
            className={Styling.manualImg}
          />
          <Image
            src={imageSrc("module-table-flex1.jpg")}
            className={Styling.manualImg}
          />
          <Image
            src={imageSrc("module-table-flex2.jpg")}
            className={Styling.manualImg}
          />
          <Image
            src={imageSrc("module-table-flex3.jpg")}
            className={Styling.manualImg}
          />
          <Image
            src={imageSrc("module-table-flex4.jpg")}
            className={Styling.manualImg}
          />
        </div>

        <div id={anchorList[2].children![2].children![5].id}>
          <Title level={3}>[模板]折线图</Title>
          <Image
            src={imageSrc("module-line.jpg")}
            className={Styling.manualImg}
          />
          <Image
            src={imageSrc("module-line1.jpg")}
            className={Styling.manualImg}
          />
          <Image
            src={imageSrc("module-line2.jpg")}
            className={Styling.manualImg}
          />
          <Image
            src={imageSrc("module-line3.jpg")}
            className={Styling.manualImg}
          />
        </div>

        <div id={anchorList[2].children![2].children![6].id}>
          <Title level={3}>[模板]柱状图</Title>
          <Text>柱状图的设置步骤与折线图完全相同，请参考折线图。</Text>
        </div>

        <div id={anchorList[2].children![2].children![7].id}>
          <Title level={3}>[模板]折线柱状混合图</Title>
          <Image
            src={imageSrc("module-line-bar.jpg")}
            className={Styling.manualImg}
          />
          <Image
            src={imageSrc("module-line-bar1.jpg")}
            className={Styling.manualImg}
          />
        </div>

        <div id={anchorList[2].children![2].children![8].id}>
          <Title level={3}>[模板]气泡图</Title>
          <Image
            src={imageSrc("module-scatter.jpg")}
            className={Styling.manualImg}
          />
          <Image
            src={imageSrc("module-scatter1.jpg")}
            className={Styling.manualImg}
          />
        </div>

        <div id={anchorList[2].children![2].children![9].id}>
          <Title level={3}>[模板]折线气泡混合图</Title>
          <Text>折线气泡混合图的设置步骤与折线柱状图类似，气泡图设置部分请参考气泡图。</Text>
        </div>

        <Divider/>

        <div id={anchorList[3].id}>
          <Title>4. 综合查询</Title>
          <br/>
          <Text type="secondary">施工中...</Text>
        </div>

        <Divider/>

        <Paragraph>
          <Text>最后一次更新日期： 2021-1-27</Text>
          <br/>
          <Text>如有任何疑问请联系开发者</Text>
        </Paragraph>

      </Space>
    </Typography>
  )
}

