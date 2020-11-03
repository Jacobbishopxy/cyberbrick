// https://umijs.org/config/
import {defineConfig} from 'umi'
import defaultSettings from './defaultSettings'
import proxy from './proxy'

const {REACT_APP_ENV} = process.env


export default defineConfig({
  outputPath: "frontend",
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    name: 'CyberBrick',
    locale: true,
    siderWidth: 150,
    logo: '/api/collection/homeLogo',
    ...defaultSettings
  },
  locale: {
    default: 'en-US',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/welcome',
      name: 'welcome',
      icon: 'smile',
      component: './Welcome',
    },
    {
      path: '/admin',
      name: 'admin',
      icon: 'crown',
      access: 'canAdmin',
      component: './Admin',
      routes: [
        {
          path: '/admin/sub-page',
          name: 'sub-page',
          icon: 'smile',
          component: './Welcome',
        },
      ],
    },
    {
      path: "/gallery",
      name: "gallery",
      icon: "BankOutlined",
      access: "canOnline",
      routes: [
        {
          name: "configuration",
          icon: "SettingOutlined",
          path: "/gallery/configuration",
          component: "./gallery/Configuration"
        },
        {
          name: "dataset",
          icon: "DatabaseOutlined",
          path: "/gallery/dataset",
          component: "./gallery/Dataset"
        },
        {
          name: "overview",
          icon: 'ProfileOutlined',
          path: "/gallery/overview",
          component: "./gallery/Overview"
        },
        {
          name: "dashboard",
          icon: 'DashboardOutlined',
          path: "/gallery/dashboard",
          component: "./gallery/Dashboard"
        },
      ]
    },
    {
      path: '/demo',
      name: 'demo',
      icon: 'ExperimentOutlined',
      routes: [
        {
          name: 'local-storage',
          path: '/demo/localstorage',
          component: './demo/LocalStorage',
        },
        {
          name: 'rectangleChart',
          path: '/demo/rectangleChart',
          component: './demo/RectangleChart',
        },
        {
          name: 'charts',
          path: '/demo/charts',
          component: './demo/Charts',
        },
      ],
    },
    {
      path: '/document',
      name: 'document',
      icon: 'BookOutlined',
      routes: [
        {
          name: 'gallery',
          path: '/document/gallery',
          component: './document/Gallery'
        }
      ]
    },
    {
      path: '/',
      redirect: '/welcome',
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
})
