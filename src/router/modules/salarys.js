//工资路由规则
import Layout from '@/layout'
export default {
    path: '/salarys',
    name: 'salarys',
    component: Layout,
    children: [{
        path: '',
        component: () =>
            import ('@/views/salarys'),
        //路由元信息
        meta: { title: '工资', icon: 'money' }
    }]
}