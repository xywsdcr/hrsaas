//公司设置路由规则
import Layout from '@/layout'
export default {
  path: '/setting',
  name: 'settings',
  component: Layout,
  children: [{
    path: '',
    component: () =>
      import('@/views/setting'),
    //路由元信息
    meta: { title: '公司设置', icon: 'setting' }
  }]
}