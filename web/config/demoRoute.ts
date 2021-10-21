/**
 * Created by Jacob Xie on 1/18/2021
 */


export const demoRoute = (env?: string) => env === "dev" ?
  [
    {
      path: '/demo',
      name: 'demo',
      icon: 'ExperimentOutlined',
      component: "./demo",
      layout: {
        hideFooter: true
      },
      routes: [
        {
          name: 'local-storage',
          path: '/demo/local-storage',
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
          name: 'grid-layout',
          path: '/demo/grid-layout',
          component: './demo/GridLayout',
        },
        {
          name: 'redirect-test',
          path: '/demo/redirect-test',
          component: './demo/RedirectTest',
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
        {
          name: 'nested-module-test',
          path: '/demo/nested-module-test',
          component: './demo/NestedModuleTest',
        },
        {
          name: 'consensus-distribution-chart',
          path: '/demo/consensus-distribution-chart',
          component: './demo/ConsensusDistributionChart',
        },
      ],
    },
  ] : []
