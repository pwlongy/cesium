<template>
  <div>
    <vue-office-docx
      :src="fileSrc"
      style="height: 100%; margin: 0; padding: 0"
      @rendered="rendered"
    />
  </div>
</template>

<script>
//引入VueOfficeDocx组件
import VueOfficeDocx from "@vue-office/docx";
//引入相关样式
import "@vue-office/docx/lib/index.css";

export default {
  components: {
    VueOfficeDocx,
  },
  props: {
    fileSrc: {
      type: String,
      default:
        "/api/file/info/36e356a3915c41b58bece8e890328220", //设置文档网络地址，可以是相对地址
    },
  },
  data() {
    return {};
  },
  methods: {
    rendered() {
      console.log("渲染完成");
    },
  },
};
</script>