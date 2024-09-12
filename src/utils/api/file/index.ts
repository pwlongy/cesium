import request from "@/utils/request/request.js";
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
