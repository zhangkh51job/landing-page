import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/homeView',
  },
  {
    path: '/homeView',
    name: 'home',
    component: () => import(/* webpackChunkName: "homeView" */ '../views/HomeView2.vue'),
    meta: { require_footer: true, no_require_auth: true }
  },
  // {
  //   path: '/imgPage',
  //   name: 'imgPage',
  //   component: () => import(/* webpackChunkName: "imgPage" */ '../views/ImgPage.vue'),
  //   meta: { require_header: true, no_require_auth: true }
  // },

  // // ----------------------
  // {
  //   path: '/pageMine',
  //   name: 'pageMine',
  //   component: () => import(/* webpackChunkName: "pageMine" */ '../views/PageMine.vue'),
  //   meta: { require_footer: true }
  // },
  // {
  //   path: '/pageCustomer',
  //   name: 'pageCustomer',
  //   component: () => import(/* webpackChunkName: "pageCustomer" */ '../views/PageCustomer.vue'),
  //   meta: { require_header: false, no_require_auth: true, title: '客服中心' }
  // },
  // {
  //   path: '/pageRebate',
  //   name: 'pageRebate',
  //   component: () => import(/* webpackChunkName: "record" */ '../views/RebateRecord.vue'),
  //   meta: { require_header: true,  title: '流水结算记录' }
  // },
  // {
  //   path: '/betRecord',
  //   name: 'betRecord',
  //   component: () => import(/* webpackChunkName: "record" */ '../views/BetRecord.vue'),
  //   meta: { require_header: false,  title: '投注记录' }
  // },
  // {
  //   path: '/commissionRecord',
  //   name: 'commissionRecord',
  //   component: () => import(/* webpackChunkName: "record" */ '../views/CommissionRecord.vue'),
  //   meta: { title: '佣金结算记录' }
  // },
  //   {
  //     path: '/login',
  //     name: 'login',
  //     component: () => import(/* webpackChunkName: "pageLogin" */ '../views/PageLogin.vue'),
  //     meta: { no_require_auth: true, title: '登录' }
  //   },
  //   {
  //     path: '/register',
  //     name: 'register',
  //     component: () => import(/* webpackChunkName: "pageRegister" */ '../views/PageRegister.vue'),
  //     meta: { require_header: true, no_require_auth: true, title: '注册' }
  //   },
  //   {
  //     path: '/share',
  //     name: 'share',
  //     component: () => import(/* webpackChunkName: "share" */ '../views/PageShare.vue'),
  //     meta: { require_header: false, title: '' }
  //   },
  //   {
  //     path: '/promote',
  //     name: 'promote',
  //     component: () => import(/* webpackChunkName: "promote" */ '../views/PagePromote.vue'),
  //     meta: { require_footer: true, title: '' }
  //   },
  //   {
  //     path: '/rebate',
  //     name: 'rebate',
  //     component: () => import(/* webpackChunkName: "rebate" */ '../views/PageRebate.vue'),
  //     meta: { require_footer: true, title: '' }
  //   },
  //   {
  //     path: '/pageDiscount',
  //     name: 'pageDiscount',
  //     component: () => import(/* webpackChunkName: "rebate" */ '../views/PageDiscount.vue'),
  //     meta: { no_require_auth: true, require_footer: true, title: '' }
  //   },
  //   {
  //     path: '/pageDiscountDetail',
  //     name: 'pageDiscountDetail',
  //     component: () => import(/* webpackChunkName: "rebate" */ '../views/PageDiscountDetail.vue'),
  //     meta: { no_require_auth: true, require_header: true, title: '优惠详情' }
  //   },
  //   {
  //     path: '/betMap',
  //     name: 'betMap',
  //     component: () => import(/* webpackChunkName: "betMap" */ '../views/subViews/BetMap.vue'),
  //     meta: { require_header: true, title: '路单图' }
  //   }
]

const router = createRouter({
  history: createWebHashHistory(), //createWebHistory(process.env.BASE_URL),
  routes
})

// router.beforeEach((to, from, next) => {
//   window.scrollTo(0, 0);
//   // 在路由全局钩子beforeEach中，根据keepAlive属性，统一设置页面的缓存性
//   // 作用是每次进入该组件，就将它缓存
//   let token = localStorage.getItem('token');
//   if (!to.meta.no_require_auth) {
//       // 判断该路由是否需要登录权限
//       if (token) {
//           // 通过vuex state获取当前的token是否存在
//           next();
//       } else {
//           next({
//               path: "/login",
//           });
//           // 将跳转的路由path作为参数，登录成功后跳转到该路由
//       }
//   } else {
//     next();
//   }
// });
// router.onError(err =>{
//   const pattern =  /Loading chunk chunk-([a-z0-9])+ failed/g;//匹配资源丢失的文件
//   const isChunkLoadFailed = err.message.match(pattern);
//   if(isChunkLoadFailed){
//       location.reload();
//       // router.replace(targetPath)//会陷入死循环
//   }
// })

// export default router
