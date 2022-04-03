import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import Components from '@/components'
import * as filters from '@/filters'
import checkPermission from './mixin/checkPermission'

import * as directives from '@/directives'
import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key]) //注册自定义时间
})
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]) //注册自定义过滤器
})

//注册组件
Vue.use(Components)

//全局混入 所有的组件都拥有了checkPermission方法
Vue.mixin(checkPermission)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})