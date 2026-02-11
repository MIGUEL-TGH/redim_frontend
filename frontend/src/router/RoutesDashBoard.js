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
      }
    //   {
    //     path: '/2019-2024/postales',
    //     name: '20192024PostalesComp',
    //     component: () => import('@/views/20192024/PostCardsView.vue')
    //   },
    //   {
    //     path: '/2019-2024/materiales-didacticos',
    //     name: '20192024MaterialesDidacticosComp',
    //     component: () => import('@/views/20192024/MaterialesDidacticosView.vue')
    //   },
    //   {
    //     path: '/2019-2024/consejos-regionales',
    //     name: '20192024ConsejosRegionalesComp',
    //     component: () => import('@/views/20192024/ConsejosRegionalesView.vue')
    //   },
    //   {
    //     path: '/2019-2024/consejo-estatal',
    //     name: '20192024ConsejoEstatalComp',
    //     component: () => import('@/views/20192024/ConsejoEstatalView.vue')
    //   },
    //   {
    //     path: '/2019-2024/documentales',
    //     name: '20192024DocumentalesComp',
    //     component: () => import('@/views/20192024/DocumentalesView.vue')
    //   },
    //   {
    //     path: '/2019-2024/libros',
    //     name: '20192024LibrosComp',
    //     component: () => import('@/views/20192024/LibrosView.vue')
    //   },
    //   {
    //     path: '/2019-2024/mid',
    //     name: '20192024MidComp',
    //     component: () => import('../views/20192024/MidView.vue')
    //   }
    ]
  }
//   ,
//   {
//     path: '/2019-2024/mapa',
//     name: 'MapaCompV1',
//     component: () => import('@/views/20192024/ArcGISMapView.vue')
//   }
]
