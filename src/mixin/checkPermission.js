// 全局混入
import store from '@/store'

export default {
  //混入组件的选项
  methods: {
    //检查权限 key是要检查的权限点
    checkPermission (key) {
      //去用户信息里points找有无权限点
      const { userInfo } = store.state.userInfo
      if (userInfo.roles && userInfo.roles.points) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false;
    }
  }
}