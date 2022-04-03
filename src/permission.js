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
      //如果没有用户id 需要获取用户资料
      if (!store.getters.userId) {
        const { roles } = await store.dispatch('user/getUserInfo');
        //筛选当前用户可用的动态路由
        const routes = await store.dispatch('permission/filterRoutes', roles.menus);
        //添加动态路由到路由表
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]);
        //相当于跳到对应地址
        next(to.path);
      } else {
        next();
      }
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