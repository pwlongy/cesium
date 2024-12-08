"use strict";
exports.__esModule = true;
exports.downloadFile = exports.uploadSingle = void 0;
var request_js_1 = require("@/utils/request/request.js");
// 大文件上传
function uploadSingle(file) {
    // 请求主体传递给服务器的数据格式： FormData/x-www-form-urlencoded/json字符串/普通文本字符串/Buffer....
    return request_js_1["default"]({
        method: 'post',
        url: '/upload_single',
        headers: {
            "Content-Type": "multipart/form-data"
        },
        data: file
    });
}
exports.uploadSingle = uploadSingle;
// 下载文件, 获取文件信息
function downloadFile(fileId) {
    return request_js_1["default"]({
        url: "/api/file/download/" + fileId,
        method: "get",
        headers: {
            responseType: "blob"
        }
    });
}
exports.downloadFile = downloadFile;
