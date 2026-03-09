export default [
  {
    path: '/dashboard',
    component: () => import('@/layouts/dashboard.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'DBInitView',
        component: () => import('@/views/dashboard/InitView.vue'),
        meta: { moduleName: 'welcome' }
      },
      {
        path: '/dashboard/years',
        name: 'DBYearsView',
        component: () => import('@/views/dashboard/YearsView.vue'),
        meta: { moduleName: 'years' }
      },
      {
        path: '/dashboard/genders',
        name: 'DBGendersView',
        component: () => import('@/views/dashboard/GendersView.vue'),
        meta: { moduleName: 'genders' }
      },
      {
        path: '/dashboard/countries',
        name: 'DBCountriesView',
        component: () => import('@/views/dashboard/CountriesView.vue'),
        meta: { moduleName: 'countries' }

      },
      {
        path: '/dashboard/indicators',
        name: 'DBIndicatorsView',
        component: () => import('@/views/dashboard/IndicatorsView.vue'),
        meta: { moduleName: 'indicators' }
      },
      {
        path: '/dashboard/states',
        name: 'DBStatesView',
        component: () => import('@/views/dashboard/StatesView.vue'),
        meta: { moduleName: 'states' }
      },
      {
        path: '/dashboard/centers',
        name: 'DBCentersView',
        component: () => import('@/views/dashboard/CentersView.vue'),
        meta: { moduleName: 'centers' }
      },
      {
        path: '/dashboard/indicator_categories',
        name: 'DBIndicatorCategoriesView',
        component: () => import('@/views/dashboard/IndicatorCategoriesView.vue'),
        meta: { moduleName: 'indicator_categories' }
      },
      {
        path: '/dashboard/indicator_category_details',
        name: 'DBIndicatorCategoryDetailsView',
        component: () => import('@/views/dashboard/IndicatorCategoryDetailsView.vue'),
        meta: { moduleName: 'indicator_category_details' }
      }
    ]
  }
  // ,
  // {
  //   path: '/2019-2024/mapa',
  //   name: 'MapaCompV1',
  //   component: () => import('@/views/20192024/ArcGISMapView.vue')
  // }
]
