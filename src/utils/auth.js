import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token' //唯一key
const timeKey = 'hrsaas-timestamp-key' //唯一时间戳

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

export function getTimeStamp() { //获取token时间戳
    return Cookies.get(timeKey)
}

export function setTimeStamp() { //设置token时间戳
    Cookies.set(timeKey, Date.now())
}