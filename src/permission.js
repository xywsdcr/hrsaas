//权限拦截 路由守卫
import router from './router'
import store from '@/store' //引入store实例
import nprogress from 'nprogress' //引入进度条
import 'nprogress/nprogress.css' //引入进度条样式

const whiteList = ['/login', '/404']; //定义白名单

router.beforeEach(async (to, from, next) => { //前置守卫
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