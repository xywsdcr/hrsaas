import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailsById } from '@/api/user'
import { resetRouter } from '@/router';

const state = {
  token: getToken(), //共享token 初始化vuex时 从缓存读取
  userInfo: {}
}
const mutations = {
  setToken (state, token) {
    state.token = token; //设置token
    setToken(token); //同步给缓存
  },
  removeToken (state) { //删除token
    state.token = null;
    removeToken(); //同步给缓存
  },
  setUserInfo (state, result) {
    state.userInfo = result
  },
  removeUserInfo (state) {
    state.userInfo = {}
  }
}
const actions = {
  async login (context, data) { //调用登录接口
    const result = await login(data);
    context.commit("setToken", result); //调用mutations的setToken
    //拿到token说明登录成功 设置当前时间戳
    setTimeStamp();
  },
  async getUserInfo (context) {
    const result = await getUserInfo(); //获取用户信息
    const userDetails = await getUserDetailsById(result.userId); //获取用户详情
    context.commit("setUserInfo", { ...result, ...userDetails }); //合并用户资料
    return result; //权限管理需要
  },
  logOut (context) {
    //删除token
    context.commit('removeToken');
    //删除资料
    context.commit('removeUserInfo');
    //重置路由
    resetRouter()
    //权限模块下的路由重置 由于加了命名空间 子模块不能直接调用子模块
    //利用父模块调用子模块
    context.commit('permission/setRoutes', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}