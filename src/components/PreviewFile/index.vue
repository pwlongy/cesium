<template>
  <!-- 文件在线预览 -->
  <div class="PreviewFile">
    <Pdf :fileSrc="curFile.src" v-if="curFile.extend == 'pdf'"></Pdf>
    <Excel
      :fileSrc="curFile.src"
      v-if="curFile.extend == 'xls' || curFile.extend == 'xlsx'"
    ></Excel>
    <Word
      :fileSrc="curFile.src"
      v-if="curFile.extend == 'doc' || curFile.extend == 'docx'"
    ></Word>
    <PPt
      :file="curFile.file"
      v-if="curFile.extend == 'ppt' || curFile.extend == 'pptx'"
    ></PPt>
  </div>
</template>

<script setup lang="ts">
import { PreviewFile } from "./interFaceFile/previewFile";
import { downloadFile } from "@/utils/api/file";
import Pdf from "./components/Pdf/pdf.vue";
import Excel from "./components/excel/Excel.vue";
import Word from "./components/word/word.vue";
import PPt from "./components/PPtx/pptx.vue";
import { onMounted } from "vue";

let fileType: string = "pdf";
let extend: string = ""; // 文件扩展名
let filename: string = ""; // 文件名称
let file: string = ""; // 文件流
let curFile: PreviewFile = {};
// 获取文件后缀名
const getExtend = (name: string) => {
  const dot = name.lastIndexOf(".");
  return name.substr(dot + 1);
};
// 对文件类型进行操作
const switchFileType = (extend: string, file: File) => {
  // console.log("extend :>> ", extend);
  // console.log("file :>> ", file);
  // console.log("URL.createObjectURL(file), :>> ", URL.createObjectURL(file));
  const fileTypes = [
    {
      // 文档类型
      accepts: ["docx", "doc", "xls", "xlsx", "pdf", "ppt", "pptx"],
      data: {
        extend: extend,
        src: URL.createObjectURL(file),
        file: file,
      },
    },
    {
      // 图片类型
      accepts: ["gif", "jpg", "jpeg", "bmp", "tiff", "tif", "png", "svg"],
      data: {
        extend: "image",
        src: URL.createObjectURL(file),
      },
    },
    {
      // 视频类型
      accepts: [
        "avi",
        "mpg",
        "mpe",
        "mpeg",
        "asf",
        "wmv",
        "mov",
        "qt",
        "rm",
        "mp4",
        "flv",
        "m4v",
        "webm",
        "ogv",
        "ogg",
      ],
      data: {
        extend: "video",
        video: {
          src: URL.createObjectURL(file),
        },
      },
    },
    {
      // 音频类型
      accepts: ["mp3", "wav", "wma", "mpa", "ram", "ra", "aac", "aif", "m4a"],
      data: {
        extend: "music",
        musicList: [
          {
            name: file.name,
            artist: "未知歌手",
            cover: "https://upyun.qkongtao.cn/chevereto/2022/09/29/logo.th.png",
            url: URL.createObjectURL(file),
          },
        ],
      },
    },
    {
      // 文本类型

      accepts: [
        "txt",
        "json",
        "java",
        "sql",
        "js",
        "css",
        "xml",
        "html",
        "yaml",
        "md",
        "py",
      ],
      data: { extend: "text", cmMode: extend, codeValue: "" },
    },
  ];

  // 遍历返回
  let flag: number = 0;
  fileTypes.forEach(async (element) => {
    if (element.accepts.indexOf(extend) > -1) {
      // text文件类型特殊处理
      if (element.data.extend == "text") {
        // 同步获取到数据
        const data = await readFileAsync(file);
        element.data.codeValue = data;
      } else if (
        element.data.extend == "ppt" ||
        element.data.extend == "pptx"
      ) {
      }
      curFile = element.data;
      console.log(element.data, 123456);
      flag = 1;
    }
  });
  if (flag == 0) {
    curFile = {};
  }
};

// 读取文本文件内容
const readFileAsync = (file: File) => {
  return new Promise((resolve, reject) => {
    // 读取文件里面的内容返回
    let reader: FileReader = new FileReader();
    // 以文本格式读取文件
    reader.readAsText(file, "UTF-8");
    // reader的 onload 事件处理函数
    reader.onload = function (event) {
      console.log(event.target.result, 123456);
      resolve(event.target.result);
    };
    reader.onerror = function (event) {
      reject(event.target);
    };
  });
};
onMounted(() => {
  downloadFile("36e356a3915c41b58bece8e890328220").then((res: any) => {
    // 通过 Content-Disposition 头字段来告知客户端文件的名称
    const disposition = res.headers["content-disposition"];
    const match = disposition && disposition.match(/filename="(.+)"/);

    if (match && match[1]) {
      // 返回的文件为 URL 编码的文件名
      let filename = match[1];
      // 解码获取文件名称
      filename = decodeURIComponent(filename);
      console.log("Filename:", filename);

      // 获取文件流
      const fileType = res.headers["content-type"];
      const blob = new Blob([res.data], { type: fileType });
      file = new File([blob], filename);
      // 取得扩展名
      extend = getExtend(filename);
      // 对文件类型进行操作
      switchFileType(extend, file);
      // 继续处理文件流
    }
  });
});
</script>

<style scoped lang="scss">
.PreviewFile {
  width: 100%;
  height: 100%;
}
</style>
