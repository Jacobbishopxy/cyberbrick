import { Settings as LayoutSettings } from '@ant-design/pro-layout'

const Settings: LayoutSettings & {
    pwa?: boolean
    logo?: string
} = {
    navTheme: 'light',
    layout: 'top',
    contentWidth: 'Fluid',
    fixedHeader: true,
    fixSiderbar: true,
    colorWeak: false,
    menu: {
        locale: true,
    },
    title: 'CyberBrick',
    pwa: false,

    iconfontUrl: '',
    splitMenus: true,
} as LayoutSettings & {
    pwa: boolean
}

export default Settings
