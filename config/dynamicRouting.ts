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
        path: "/gallery/configuration",
        component: "./gallery/Configuration"
      },
      {
        name: "overview",
        path: "/gallery/overview",
        component: "./gallery/Overview"
      },
      {
        name: "dashboard",
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

