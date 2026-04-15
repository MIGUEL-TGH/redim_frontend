export default [
  {
    path: '/dashboard',
    component: () => import('@/layouts/dashboard.vue'),
    meta: { requiresAuth: true },
    children: [
      // {
      //   path: '',
      //   name: 'DBInitView',
      //   component: () => import('@/views/dashboard/InitView.vue'),
      //   meta: { moduleName: 'welcome', title: 'Inicio - Panel' }
      // },
      // {
      //   path: '',
      //   name: 'DBMyProfileView',
      //   component: () => import('@/views/dashboard/MyProfileView.vue'),
      //   meta: { moduleName: 'welcome', title: 'Mi Perfil - Panel' }
      // },
      {
        path: '',
        name: 'DBUsersView',
        component: () => import('@/views/dashboard/UsersView.vue'),
        meta: { moduleName: 'welcome', title: 'Usuarios - Panel' }
      },
      {
        path: '/dashboard/years',
        name: 'DBYearsView',
        component: () => import('@/views/dashboard/YearsView.vue'),
        meta: { moduleName: 'years', title: 'Años - Panel' }
      },
      {
        path: '/dashboard/genders',
        name: 'DBGendersView',
        component: () => import('@/views/dashboard/GendersView.vue'),
        meta: { moduleName: 'genders', title: 'Sexo - Panel' }
      },
      {
        path: '/dashboard/countries',
        name: 'DBCountriesView',
        component: () => import('@/views/dashboard/CountriesView.vue'),
        meta: { moduleName: 'countries', title: 'Países - Panel' }
      },
      {
        path: '/dashboard/indicators',
        name: 'DBIndicatorsView',
        component: () => import('@/views/dashboard/IndicatorsView.vue'),
        meta: { moduleName: 'indicators', title: 'Indicadores - Panel' }
      },
      {
        path: '/dashboard/states',
        name: 'DBStatesView',
        component: () => import('@/views/dashboard/StatesView.vue'),
        meta: { moduleName: 'states', title: 'Estados - Panel' }
      },
      {
        path: '/dashboard/centers',
        name: 'DBCentersView',
        component: () => import('@/views/dashboard/CentersView.vue'),
        meta: { moduleName: 'centers', title: 'Centros - Panel' }
      },
      {
        path: '/dashboard/indicator_categories',
        name: 'DBIndicatorCategoriesView',
        component: () => import('@/views/dashboard/IndicatorCategoriesView.vue'),
        meta: { moduleName: 'indicator_categories', title: 'Categorías de Indicadores - Panel' }
      },
      {
        path: '/dashboard/indicator_category_details',
        name: 'DBIndicatorCategoryDetailsView',
        component: () => import('@/views/dashboard/IndicatorCategoryDetailsView.vue'),
        meta: { moduleName: 'indicator_category_details', title: 'Detalles de Categoría de Indicador - Panel' }
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
