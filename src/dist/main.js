"use strict";
exports.__esModule = true;
var vue_1 = require("vue");
var App_vue_1 = require("./App.vue");
var router_1 = require("./router");
var store_1 = require("./store");
// 将所有common文件中导出的方法挂载到全局中
var common_1 = require("@/utils/common/common");
require("@/utils/rem.js");
var qs_1 = require("qs");
var spark_md5_1 = require("spark-md5");
var app = vue_1.createApp(App_vue_1["default"]);
app.config.globalProperties.$func = common_1["default"];
app.config.globalProperties.$qs = qs_1["default"];
app.config.globalProperties.$sparkMd5 = spark_md5_1["default"];
// 外部引入资源
var element_plus_1 = require("element-plus");
require("element-plus/dist/index.css");
app.use(element_plus_1["default"]);
app.use(store_1["default"]).use(router_1["default"]).mount('#app');
