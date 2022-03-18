import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'

const tokenTimeOut = 3600; //token超时时间
const service = axios.create({ // 创建一个axios的实例
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000 //超时时间
})

service.interceptors.request.use( // 请求拦截器
    config => { //请求配置信息
        if (store.getters.token) { //注入token
            if (checkTimeOut()) { //如果token超时
                store.dispatch('user/logOut');
                router.push('/login');
                return Promise.reject(new Error('Token超时'));
            }
            config.headers['Authorization'] = `Bearer ${store.getters.token}`
        }
        return config //必须返回config
    }, error => {
        return Promise.reject(error)
    })

service.interceptors.response.use( // 响应拦截器
    response => {
        const { success, message, data } = response.data;
        if (success) {
            return data;
        } else {
            Message.error(message);
            return Promise.reject(new Error(message)); //返回错误 进入catch
        }
    }, error => {
        //token失效被动介入
        if (error.response && error.response.data && error.response.data.code === 10002) {
            //10002表示token失效
            store.dispatch('user/logOut');
            router.push('/login');
        } else {
            Message.error(error.message); //提示错误信息
        }
        return Promise.reject(error); //返回错误 进入catch
    })

function checkTimeOut() { //检查token是否超时
    let currentTime = Date.now(); //当前时间戳
    let timeStamp = getTimeStamp(); //缓存时间戳
    return (currentTime - timeStamp) / 1000 > tokenTimeOut;
}
export default service // 导出axios实例