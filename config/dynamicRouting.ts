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
        name: "summary",
        path: "/gallery/summary",
        component: "./gallery/Summary"
      },
      {
        name: "dashboard",
        path: "/gallery/dashboard",
        component: "./gallery/Dashboard"
      },
      // unnecessary since it is included in summary
      // {
      //   name: 'literature',
      //   path: '/gallery/literature',
      //   component: './gallery/Literature',
      // },
    ]
  }
]

export function onlineRoutesGenerator() {
  if (DATA_ENV !== "offline" || DATA_ENV === undefined)
    return onlineRoutes
  return []
}

