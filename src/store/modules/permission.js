//权限路由模块
import { constantRoutes, asyncRoutes } from '@/router'

const state = {
  routes: constantRoutes //路由表 当前用户所拥有的所有路由 一开始必拥有静态路由权限
}
const mutations = {
  setRoutes (state, newRoutes) {
    //newRoutes表示登陆成功后需要添加的新路由 每次要在 静态路由 基础上加
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  //筛选权限路由 menus为用户所拥有的路由权限
  filterRoutes (context, menus) {
    let routes = []
    // 在asyncRoutes中筛选出和menus一样的动态路由
    menus.forEach(key => {
      // key就是标识
      // asyncRoutes 找 有没有对象中的name属性等于 key的 如果找不到就没权限 如果找到了 要筛选出来
      routes.push(...asyncRoutes.filter(item => item.name === key)) // 得到一个数组 有可能 有元素 也有可能是空数组
    })
    //把动态路由加入
    context.commit('setRoutes', routes)
    return routes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}