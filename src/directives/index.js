//管理所有自定义指令

export const imageerror = { //处理头像失效 自定义指令
  inserted (dom, options) { // dom是当前作用的dom对象
    dom.src = dom.src || options.value
    dom.onerror = function () { //dom注册error时间
      dom.src = options.value;
    }
  },
  //在自定义指令作用的组件更新完成后执行 应为inserted只会执行一次
  componentUpdated (dom, options) {
    dom.src = dom.src || options.value
  }
}