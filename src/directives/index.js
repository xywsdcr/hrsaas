//管理所有自定义指令

export const imageerror = { //处理头像失效 自定义指令
    inserted(dom, options) { // dom是当前作用的dom对象
        dom.onerror = function() { //dom注册error时间
            dom.src = options.value;
        }
    }
}