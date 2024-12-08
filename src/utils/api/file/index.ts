import request from "@/utils/request/request.js";
interface fileType {
  file: File,
  fileName: string
}
// 大文件上传
export function uploadSingle(file:fileType) {
  // 请求主体传递给服务器的数据格式： FormData/x-www-form-urlencoded/json字符串/普通文本字符串/Buffer....
  return request({
    method: 'post',
    url: '/upload_single',
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data: file
  })
}

// 下载文件, 获取文件信息
export function downloadFile(fileId:number|null) {
  return request({
    url: "/api/file/download/" + fileId,
    method: "get",
    headers: {
      responseType: "blob",
    },
  });
}
