/**
 * Created by Jacob Xie on 9/14/2020.
 */

const { DATA_ENV } = process.env

const onlineRoutes = [
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
  }
]

export function onlineRoutesGenerator() {
  if (DATA_ENV !== "offline" || DATA_ENV === undefined)
    return onlineRoutes
  return []
}

