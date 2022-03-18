// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })

//权限拦截 路由守卫
import router from './router'
import store from '@/store' //引入store实例
import nprogress from 'nprogress' //引入进度条
import 'nprogress/nprogress.css' //引入进度条样式

const whiteList = ['/login', '/404']; //定义白名单

router.beforeEach(async(to, from, next) => { //前置守卫
    nprogress.start(); //开启进度条
    if (store.getters.token) { //如果有token
        if (to.path === '/login') { //如果去登录页面
            next('/');
        } else {
            if (!store.getters.userId) {
                await store.dispatch('user/getUserInfo');
            }
            next();
        }
    } else { //没有token
        if (whiteList.indexOf(to.path) > -1) { //是否去白名单
            next();
        } else {
            next('/login');
        }
    }
    nprogress.done(); //强制关闭
})
router.afterEach(() => { //后置守卫
    nprogress.done(); //关闭进度条
})