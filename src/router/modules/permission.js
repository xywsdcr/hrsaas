//权限管理路由规则
import Layout from '@/layout'
export default {
    path: '/permission',
    name: 'permission',
    component: Layout,
    children: [{
        path: '',
        component: () =>
            import ('@/views/permission'),
        //路由元信息
        meta: { title: '权限管理', icon: 'lock' }
    }]
}