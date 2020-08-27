import { Settings as LayoutSettings } from '@ant-design/pro-layout'

export default {
  navTheme: 'light',
  primaryColor: '#1890ff',
  headerHeight: 40,
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: true,
  },
  title: 'JacobBishop',
  pwa: false,
  iconfontUrl: '',
} as LayoutSettings & {
  pwa: boolean;
}
