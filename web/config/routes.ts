/**
 * Created by Jacob Xie on 2/2/2021
 */

export const mainRoutes = [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: "login",
        icon: "SettingOutlined",
        path: "/user/login",
        component: "./user/login"
      },
      {
        name: "registration",
        icon: 'DashboardOutlined',
        path: "/user/registration",
        component: "./user/login"
      },
      {
        name: "logout",
        icon: "DatabaseOutlined",
        path: "/user/logout",
        component: "./user/login"
      },
      {
        name: "invitation",
        icon: "DatabaseOutlined",
        path: "/user/invitation/register",
        component: "./user/login"
      },
    ]
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  // {
  //   path: '/admin',
  //   name: 'admin',
  //   icon: 'crown',
  //   access: 'canAdmin',
  //   component: './Admin',
  //   routes: [
  //     {
  //       path: '/admin/sub-page',
  //       name: 'sub-page',
  //       icon: 'smile',
  //       component: './Welcome',
  //     },
  //   ],
  // },
  {
    path: "/gallery",
    name: "gallery",
    icon: "BankOutlined",
    access: "canOnline",
    component: "./gallery",
    layout: {
      hideFooter: true
    },
    routes: [
      {
        name: "configuration",
        icon: "SettingOutlined",
        path: "/gallery/configuration",
        component: "./gallery/Configuration"
      },
      {
        name: "dashboardTemplate",
        icon: 'DashboardOutlined',
        path: "/gallery/dashboardTemplate",
        component: "./gallery/DashboardTemplate"
      },
      {
        name: "dataset",
        icon: "DatabaseOutlined",
        path: "/gallery/dataset",
        component: "./gallery/Dataset"
      },
      // {
      //   name: "overview",
      //   icon: 'ProfileOutlined',
      //   path: "/gallery/overview",
      //   component: "./gallery/Overview"
      // },
      {
        name: "dashboard",
        icon: 'DashboardOutlined',
        path: "/gallery/dashboard",
        component: "./gallery/Dashboard"
      },
    ]
  },
  {
    path: '/document',
    name: 'document',
    icon: 'BookOutlined',
    component: "./document",
    routes: [
      {
        name: 'manual',
        icon: "FileMarkdownOutlined",
        path: '/document/manual',
        component: './document/Manual'
      },
      {
        name: 'menu',
        icon: "CodeOutlined",
        path: '/document/menu',
        component: './document/Menu'
      },
      {
        name: 'gallery',
        icon: "CodeOutlined",
        path: '/document/gallery',
        component: './document/Gallery'
      },
    ]
  },
]

export const errorRoutes = [
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
]

