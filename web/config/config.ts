// https://umijs.org/config/
import { defineConfig } from 'umi'
import defaultSettings from './defaultSettings'
import proxy from './proxy'
import { mainRoutes, errorRoutes } from "./routes"
import { demoRoute } from "./demoRoute"
const { REACT_APP_ENV } = process.env


export default defineConfig({
    outputPath: "frontend",
    hash: true,
    antd: {},
    dva: {
        hmr: true,
        immer: true,
    },
    lessLoader: {
        options: {
            javascriptEnabled: true
        }
    },
    layout: {
        name: 'CyberBrick',
        locale: true,
        // siderWidth: 150,
        logo: '/api/homeLogo',
        ...defaultSettings
    },
    locale: {
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        antd: true,
        baseNavigator: true,
    },
    dynamicImport: {
        loading: '@ant-design/pro-layout/es/PageLoading',
    },
    targets: {
        ie: 11,
    },
    // umi routes: https://umijs.org/docs/routing
    routes: [
        ...mainRoutes,
        ...demoRoute(REACT_APP_ENV),
        ...errorRoutes
    ],
    // Theme for antd: https://ant.design/docs/react/customize-theme-cn
    theme: {
        'primary-color': '#5fa8d3',
        'info-color': '#5fa8d3',
        'link-color': '#5fa8d3',
        'success-color': '#74b384',
        'warning-color': '#e4a554',
        'error-color': '#f55a4e',
        'heading-color': '#212121',
    },
    title: false,
    ignoreMomentLocale: true,
    proxy: proxy[REACT_APP_ENV || 'dev'],
    manifest: {
        basePath: '/',
    },
    nodeModulesTransform: {
        type: 'none',
        exclude: []
    }
})
