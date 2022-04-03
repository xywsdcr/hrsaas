//社保路由规则
import Layout from '@/layout'
export default {
  path: '/social',
  name: 'social_securitys',
  component: Layout,
  children: [{
    path: '',
    component: () =>
      import('@/views/social'),
    //路由元信息
    meta: { title: '社保', icon: 'table' }
  }]
}