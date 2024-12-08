"use strict";
exports.__esModule = true;
var vue_router_1 = require("vue-router");
var index_vue_1 = require("@/views/cesium/index.vue");
var index_vue_2 = require("@/components/bigFileUpload/index.vue");
var routes = [
    {
        path: "/",
        redirect: "/cesium"
    },
    {
        path: "/cesium",
        name: "cesium",
        component: index_vue_1["default"]
    },
    {
        path: "/bigFileUpload",
        name: "bigFileUpload",
        component: index_vue_2["default"]
    },
    {
        path: "/VirtualScrolling",
        name: "VirtualScrolling",
        component: function () { return Promise.resolve().then(function () { return require("@/views/VirtualScrolling/VirtualScrolling.vue"); }); }
    },
    {
        path: "/biangeng",
        name: 'biangeng',
        component: function () { return Promise.resolve().then(function () { return require("@/views/biangeng/index.vue"); }); }
    }
];
var router = vue_router_1.createRouter({
    history: vue_router_1.createWebHistory(process.env.BASE_URL),
    routes: routes
});
exports["default"] = router;
