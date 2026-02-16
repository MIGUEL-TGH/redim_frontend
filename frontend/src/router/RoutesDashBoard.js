export default [
  {
    path: '/dashboard',
    component: () => import('@/layouts/dashboard.vue'),
    children: [
      {
        path: '',
        name: 'DBInitView',
        component: () => import('@/views/dashboard/InitView.vue')
      },
      {
        path: '/dashboard/years',
        name: 'DBYearsView',
        component: () => import('@/views/dashboard/YearsView.vue')
      },
      {
        path: '/dashboard/genders',
        name: 'DBGendersView',
        component: () => import('@/views/dashboard/GendersView.vue')
      },
      {
        path: '/dashboard/countries',
        name: 'DBCountriesView',
        component: () => import('@/views/dashboard/CountriesView.vue')
      },
      {
        path: '/dashboard/indicators',
        name: 'DBIndicatorsView',
        component: () => import('@/views/dashboard/IndicatorsView.vue')
      },
      {
        path: '/dashboard/states',
        name: 'DBStatesView',
        component: () => import('@/views/dashboard/StatesView.vue')
      }
    ]
  }
//   ,
//   {
//     path: '/2019-2024/mapa',
//     name: 'MapaCompV1',
//     component: () => import('@/views/20192024/ArcGISMapView.vue')
//   }
]
