<template>
  <vue-office-excel
    :src="fileSrc"
    @rendered="renderedHandler"
    @error="errorHandler"
    style="height: calc(100vh - 90px)"
  />
</template>

<script>
//引入VueOfficeExcel组件
import VueOfficeExcel from "@vue-office/excel";
//引入相关样式
import "@vue-office/excel/lib/index.css";

export default {
  components: {
    VueOfficeExcel,
  },
  props: {
    fileSrc: {
      type: String,
      default:
        "/api/file/info/36e356a3915c41b58bece8e890328220", //设置文档地址
    },
  },
  data() {
    return {};
  },
  methods: {
    renderedHandler() {
      console.log("渲染完成");
    },
    errorHandler() {
      console.log("渲染失败");
    },
  },
};
</script>