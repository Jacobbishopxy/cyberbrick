/**
 * Created by Jacob Xie on 1/18/2021
 */


export const demoRoute = (env?: string) => env === "dev" ?
  [
    {
      path: '/demo',
      name: 'demo',
      icon: 'ExperimentOutlined',
      routes: [
        {
          name: 'localstorage',
          path: '/demo/localstorage',
          component: './demo/LocalStorage',
        },
        {
          name: 'rectangle-chart',
          path: '/demo/rectangle-chart',
          component: './demo/RectangleChart',
        },
        {
          name: 'charts',
          path: '/demo/charts',
          component: './demo/Charts',
        },
        {
          name: 'module-test',
          path: '/demo/module-test',
          component: './demo/GalleryModuleTest',
        },
        {
          name: 'component-test',
          path: '/demo/component-test',
          component: './demo/ComponentTest',
        },
      ],
    },
  ] : []
