import axios from 'axios'
import {useRouter} from "vue-router";
import api from "../../common/API";
import {showToast} from "vant";

const router = useRouter()
const request = axios.create({
    baseURL: 'http://47.120.59.10:9787/',
    timeout: 40000
})


// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
request.interceptors.request.use(config => {

    if(!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json;charset=utf-8';
    }

    const token = JSON.parse(localStorage.getItem('token') || '{}')
    if (token) {
        // 设置请求头
        config.headers['token'] = token
    }
    return config
}, error => {
    return Promise.reject(error)
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
        let res = response.data;
        // 兼容服务端返回的字符串数据
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }

        return res;
    },
    error => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)


export default request