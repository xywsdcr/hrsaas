//审批路由规则
import Layout from '@/layout'
export default {
  path: '/approvals',
  name: 'approvals',
  component: Layout,
  children: [{
    path: '',
    component: () =>
      import('@/views/approvals'),
    //路由元信息
    meta: { title: '审批', icon: 'tree-table' }
  }]
}