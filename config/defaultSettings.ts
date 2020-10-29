import { Settings as LayoutSettings } from '@ant-design/pro-layout'

export default {
  navTheme: 'light',
  primaryColor: '#1890ff',
  headerHeight: 40,
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: true,
  },
  title: 'JacobBishop',
  pwa: false,
  iconfontUrl: '',
  splitMenus: true
} as LayoutSettings & {
  pwa: boolean;
}
