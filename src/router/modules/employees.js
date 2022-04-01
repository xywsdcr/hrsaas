//员工路由规则
import Layout from '@/layout'
export default {
  path: '/employees',
  name: 'employees',
  component: Layout,
  children: [{
    path: '',
    component: () => import('@/views/employees'),
    //路由元信息
    meta: { title: '员工管理', icon: 'people' }
  }, {
    path: 'detail/:id?', //动态路由传参
    component: () => import('@/views/employees/detail'),
    hidden: true,
    meta: {
      title: '员工详情'
    }
  }, {
    path: 'print/:id',
    component: () => import('@/views/employees/print'),
    hidden: true,
    meta: {
      title: '员工打印',
    }
  }]
}