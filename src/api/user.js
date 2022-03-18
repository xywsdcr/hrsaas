import request from '@/utils/request'

export function login(data) { //登录接口封装
    return request({
        url: '/sys/login',
        method: 'POST',
        data
    })
}

export function getUserInfo() { //获取用户资料接口
    return request({
        url: '/sys/profile',
        method: 'POST',
    })
}

export function getUserDetailsById(id) { //获取用户详情接口
    return request({
        url: `/sys/user/${id}`
    })
}

export function logout() {

}