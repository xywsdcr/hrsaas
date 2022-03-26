//考勤路由规则
import Layout from '@/layout'
export default {
    path: '/attendances',
    name: 'attendances',
    component: Layout,
    children: [{
        path: '',
        component: () =>
            import ('@/views/attendances'),
        //路由元信息
        meta: { title: '考勤', icon: 'skill' }
    }]
}