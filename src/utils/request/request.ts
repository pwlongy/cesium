import  axios from "axios";
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError  } from 'axios'

// 创建axios实例AxiosRequestConfig
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基础URL，可根据实际情况配置
  timeout: 5000, // 请求超时时间
  responseType: "json", // 设置默认的响应数据类型为 JSON
});

// 请求拦截器
service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      
      // 设置请求类型
      if (
          config.headers?.responseType === "blob" ||
          config.headers?.responseType === "arraybuffer"
      ) {
        config.responseType = config.headers.responseType;
      }

      // Object.keys(config.headers).forEach(item => {
      //   config[item] = config.headers[item]
      // })

      // 设置请求头数据
      config.headers

      // 这里可以添加token等信息
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
    },
    (error:AxiosError) => {
      // 请求错误处理
      return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse) => {
      const res = response.data;
      // 未设置状态码则默认成功状态
      const code = res.errCode ;
      // 获取错误信息
      const msg = res.errMsg;
      // 二进制数据则直接返回
      if (
          response.request.responseType === "blob" ||
          response.request.responseType === "arraybuffer"
      ) {
        return res;
      } else if (code == 0 || code == 200) {
        return res;
      } else {
        if (code === 500) {
          // Message({ message: msg, type: "error" });
          return Promise.reject(new Error(msg));
        } else if (code === 601) {
          // Message({ message: msg, type: "warning" });
          return Promise.reject("error");
        } else if (code !== 200) {
          // Notification.error({ title: msg });
          return Promise.reject("error");
        }
      }
    },
    (error: AxiosError) => {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            console.error("Bad Request");
            break;
          case 401:
            console.error("Unauthorized");
            break;
          case 403:
            console.error("Forbidden");
            break;
          case 404:
            console.error("Not Found");
            break;
          case 500:
            console.error("Internal Server Error");
            break;
          default:
            console.error(error.message);
        }
      }
      return Promise.reject(error);
    }
);

export default service;
