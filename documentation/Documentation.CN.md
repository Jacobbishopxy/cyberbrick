# Cyberbrick 项目说明

## 简介

Cyberbrick 是一个用于提取、转换、存储和可视化业务数据的平台。在分析 excel 中的业务数据时，cyberbrick 充当 ETL(提取、转换和加载)工具，将数据持久化到数据库中。然后，cyberbrick 还提供了一个用于可视化业务和表示业务信息的仪表板。仪表板的一些核心功能包括绘制可随数据变化自动更新的图表、编辑和显示文章，以及可搜索的可标记文件的文件系统。

## 项目结构

![structure](structure.png)

## 项目介绍

Cyberbrick 由一个前端 web 客户端和许多用 Rust、Golang 或 Nodejs 编写的微服务组成。微服务是相互独立的，各自有自己的 docker 文件。它们可能共享一些 env 文件/变量。

- web 客户端源代码位于'./web'。在生产模式下，它由位于'web/server'的 golang 代理服务器提供服务。服务器所做的是将 http 请求转发到 nodejs 服务器或 api-gateway。我们正在将发送到 nodejs 的请求迁移到 api-gateway。一旦我们完成迁移，所有的 http 请求应该被转发到 api-gateway。
- Cyberbrick 的微服务包括：
  1. `server-nodejs`: 服务器用于服务 web 客户端。它几乎负责从 web 客户端发送的每个 API 请求。例如，持久化 web 应用用户生成的数据、存储 web 应用布局信息、将文件上传/提取转发到另一个服务器等。
  2. `inn`: 在 web 应用欢迎页面中持久化公告的 SQLite 服务。
  3. `server-go`: 一个 golang 服务器，使用 MongoDB 执行数据查询和数据操纵。现在它被用于持久化 web 客户端生成的图像、文本或 JSON 数据。Nodejs 服务器负责向`server-go`转发和检索"指针"数据。
     Server-go 使用“mux/gorilla”和“go-mongo-driver”作为依赖项。它读取一个配置文件，连接到 MongoDB，然后监听 HTTP 请求。它可以创建、更新、更新、获取和删除 MongoDB 中的数据。
  4. `server-python`: 用于处理文件 I/O 的服务器，主要处理 Excel 和 CSV。它使用了'pandas'和'sqlAlchemy'库。文件 I/O 是 cyberbrick 的核心特性。因为我们没有人来手动清理和加载原始数据到数据库中，所以我们持久化业务数据的唯一方法是直接提取 Excel 文件中的数据。
     然而，python 不支持多线程，这意味着当服务器处理一个巨大的文件时，它会停止处理其他用户的请求。另外，“pandas”不支持流动文件 I/O。当用户上传一个巨大的 Excel 文件时，“pandas”会将文件中的所有信息加载到内存中再进行数据处理。这对于内存的负担很大。因此，我们正在将 server-python 的功能迁移到子模块'ubiquity -alchemy'中的'ubiquity-data-server'中。我们正在用 Rust 重写这个服务，以便对 Excel 文件的 I/O 有更多的控制。
  5. `ubiquitous-alchemy`:Cyberbrick 项目中的一个子模块。它包含多个 web 客户端服务，如身份验证和 API 网关。“ubiquitous-alchemy”里面的所有服务都应该由“api-gateway”来处理。Cyberbrick 只需要将 HTTP 请求转发到“api-gateway”，然后等待 api-gateway 响应返回。

## 网页客户端(Web Client)

在开发模式下，web 客户端的 API 请求是通过[代理](../web/config/proxy.ts)处理的。在生产环境中，web 客户端由一个[Golang 服务器](../web/server/main.go)提供服务。

客户端项目结构：

1. `config`: web 客户端的配置文件，包括代理、路由、布局主题等
2. `server`: Golang 服务器，在生产环境中服务于 web 应用程序
3. `src`: 响应处理用户交互和发送 API 请求的 React 组件

网页客户端的依赖主要有：脚手架‘umi’和 React UI 库‘antd’。

#### src

src 文件结构为：

1. `App.ts`: 运行时配置模块，在运行时提供可扩展性。例如路由器，渲染更新。当 cookie 过期时强制用户登录。另外，也定义了错误处理返回的信息。
2. `global.less`: 全局 CSS 文件
3. `locales`: 双语配置。Cyberbrick 支持中英文切换。
4. `models`: 仪表板模块重定向。这个特性正在构建中。主要用于产业链预览的回调重定向。当用户单击某个行业/公司时，它应该将用户重定向到该行业/公司的相应仪表板。
5. `services`: 所有 API 请求以及请求数据结构都在这里定义。用户登录/注册 API 请求以路径'/gateway'开头，而其他 API 请求以路径'/api'开头。
6. `pages`: 路由器映射到的组件路径.
   1. `demo`: 用于演示目的。只在开发模式下可见.
   2. `文档document`: 显示用户手册和项目文档.
   3. `展馆gallery`: 这是网页应用和 Cyberbrick 的核心功能。它包含四个子页面:配置(Configuration)，数据集(Dataset)，仪表盘(Dahsboard)和模板库(DahsboardTemplate)。
      1. `欢迎Welcome`: 显示公告的主页。用户还可以编辑公告。权限系统正在建设中。以后只有管理员有权限编辑公告。
      2. `配置Configuration`:配置数据库连接和仪表板的三层导航。
      3. `数据集Dataset`: 数据可视化的界面。在这个页面上，用户可以查询表或上传文件来替换/插入表。
      4. `Dahsboard`: 支持和执行三个级别的导航。第一级叫“类别”，第二级叫“仪表板”，第三级叫“界面”。当所有三个级别都被定义并选中后，用户可以在“界面”页面下查看和更新模块。
      5. `模板库DahsboardTemplate`: 仪表板页面的“模板库”。类似于仪表板的结构，它也强制执行三层导航。当定义并选择所有三个级别时，用户不需要编辑模块元素的实际内容，而是需要编辑模板：如元素的大小、类型和位置等。模板库中的元素的样式与“Dahsboard”页面中的元素不同（用于区分模板和实际模块）。用户还可以为每个元素输入备注/描述，指出元素应该包含什么类型的内容。
   4. `user/login`: 用户登录、注册和邀请(从邀请电子邮件重定向页面)页面。
7. `utilities`: 其他辅助函数和钩子，比如时间戳字符串生成器。
8. `util`: Web 开发辅助函数，例如本地存储辅助函数。
9. `components`: 响应处理用户交互的 React 组件。请参见下一节的详细内容。

#### components

1. Editor: 编辑器控件的抽象。定义一个可切换按钮，可以切换来表示“编辑”或“完成”。按钮类型可以是图标、文本、链接等。
2. TextEditor: 使用了 `ReactQuill`, 一个富文本编辑器。在编辑模式下菜单栏可见，选择菜单栏中的选项来定义文章字体样式。在展示模式下，文章为只读。
3. Article: 在欢迎页面中定义公告编辑器和演示者的组件。在编辑模式下，将弹出一个带有文本编辑器、日期选择器和标记选择器的模式。在演示器模式下，文章将根据文本编辑器中定义的样式以及标题、日期和标记显示。
4. Login: 使用了 `antd pro form`. 定义了登录和注册用户需要填写的表单。
5. 展馆 Gallery: `pages/gallery`中所有用到的组件：
   - `Configuration`: 在 `pages/gallery/configuration`中显示配置信息的表格。 用户也可编辑配置信息。
   - `Dataset`: 显示用户上传文件数据的表格。也支持用户查询或更新这些数据。
   - `Dashboard`: Cyberbrick 的核心模块，且用户交互最多的模块。该模块由两部分组成： `Container` 和 `Controller`.
     `Controller` 允许用户导航到特定的标签页，检查该页面的内容，和/或编辑该页面的内容。它还定义了[弹出表单](../web/src/components/Gallery/Dashboard/DashboardController/AddModuleModal.tsx)，在这里用户可以选择创建新的模块元素。用户还可以导入在其他界面或模板库中定义的元素布局。“Controller”还控制了当前页面的模式:编辑模式或展示模式。
     `Container` 显示选定的界面。界面包含多个模块元素 elements。每个元素 element 都有标题 title、id、日期 date、类型 type 和布局属性 layout prop(x,y,w,h)。我们使用“react-grid-layout”库来展示模块元素，所以每个模块元素都是可拖动和可调整大小的。每个模块元素都有内容 content。内容 content 在“ModulePanel”中定义(参见下面的章节)。'Container'处理模块元素的属性 property 的更新和内容 content 的更新。'Container'还处理发送 API 请求获取模块元素信息的逻辑。
   - `ModulePanel`: 定义元素的内容。**请注意，仪表板导航的第 3 层称为界面。一个界面有多个模块元素 elements。每个元素 element 由一个模块面板 modulePanel 组成。模块 modulePanel 面板由 3 个部件组成。普通面板有面板头 header、面板内容 body 和面板页脚 footer，而模板面板有面板头 header、面板描述 description 和面板内容 body**。
     面板头 header 包含标题 title 和面板控制器 panelController(拖拽按钮改变模块位置，编辑按钮切换面板的编辑模式和展示模式，删除按钮删除当前模块)。
     模块主体的内容取决于模块元素的类型和当前模式。模块主体是由 HOC 'ModuleGenerator'生成的。所有的模块主体都应该有一个“编辑模式”和“展示模式”。并且编辑模式和展示模式的组件的 props 都应该相同。所有的主体内容都在'ModulePanel/Collections'中定义，主要有四种类型:
     1. `graph`: 在编辑模式下选择数据绘图;在展示模式下显示图表。
     2. `table`: 在编辑模式下上传 Excel, CSV，或从“数据集”中选择数据;在展示模式下显示生成的表
     3. `file`: 开发中。文件系统允许给文件打标签和通过标签搜索文件。
     4. `miscellaneous`:
        1. `article`:在编辑模式下编辑文章;在显示模式下显示文章。
        2. `image`: 开发中。展示图像
        3. `link`:在编辑模式输入需要嵌入的链接;在展示模式中显示嵌入链接对应的内容。
        4. `targetPrice`: 在编辑模式中输入投资建议和目标价格;展示模式下以投资建议对应的 style 显示目标价格。
        5. `fieldSeparator`: 带有透明背景的分隔标题。用于分隔同一界面中的模块元素。在编辑模式下，用户可以编辑文本、字体大小和字体对齐方式。在展示模式下，用户可以看到选定字体和对齐方式的文本。
        6. `nestedModule`: 包含两部分的模块:带有多个标签 tabs 的头 header 和嵌入式模块 embed module。每个标签 tab 对应一个嵌入式模块 module。嵌入式模块 module 可以是除'nestedModule'上面提到的任何类型。头部 header 使用“react-grid-layout”，所以在编辑模式下，头部的每个标签 tab 都是可拖动和可调整大小的。标签的内容可以是图标 icon、文本 text 或数字 number。在展示模式下，用户可以通过点击不同的标签 tabs 来切换嵌入的模块 module。
