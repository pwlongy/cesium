"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
// 创建axios实例AxiosRequestConfig
var service = axios_1["default"].create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000,
    responseType: "json"
});
// 请求拦截器
service.interceptors.request.use(function (config) {
    var _a, _b;
    // 设置请求类型
    if (((_a = config.headers) === null || _a === void 0 ? void 0 : _a.responseType) === "blob" ||
        ((_b = config.headers) === null || _b === void 0 ? void 0 : _b.responseType) === "arraybuffer") {
        config.responseType = config.headers.responseType;
    }
    // Object.keys(config.headers).forEach(item => {
    //   config[item] = config.headers[item]
    // })
    // 设置请求头数据
    config.headers;
    // 这里可以添加token等信息
    var token = localStorage.getItem("token");
    if (token) {
        config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
}, function (error) {
    // 请求错误处理
    return Promise.reject(error);
});
// 响应拦截器
service.interceptors.response.use(function (response) {
    var res = response.data;
    // 未设置状态码则默认成功状态
    var code = res.errCode;
    // 获取错误信息
    var msg = res.errMsg;
    // 二进制数据则直接返回
    if (response.request.responseType === "blob" ||
        response.request.responseType === "arraybuffer") {
        return res;
    }
    else if (code == 0 || code == 200) {
        return res;
    }
    else {
        if (code === 500) {
            // Message({ message: msg, type: "error" });
            return Promise.reject(new Error(msg));
        }
        else if (code === 601) {
            // Message({ message: msg, type: "warning" });
            return Promise.reject("error");
        }
        else if (code !== 200) {
            // Notification.error({ title: msg });
            return Promise.reject("error");
        }
    }
}, function (error) {
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
});
exports["default"] = service;
