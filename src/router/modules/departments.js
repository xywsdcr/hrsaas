//组织架构路由规则
import Layout from '@/layout'
export default {
  path: '/departments',
  name: 'departments',
  component: Layout,
  children: [{
    path: '',
    component: () =>
      import('@/views/departments'),
    //路由元信息
    meta: { title: '组织架构', icon: 'tree' }
  }]
}