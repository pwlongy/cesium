"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var Cesium = require("cesium");
require("cesium/Build/CesiumUnminified/Widgets/widgets.css");
Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MzgwYjJjNy1jY2EyLTQzMWQtYTU4NS1mN2JkMDBiMDY0OTkiLCJpZCI6MTgxOTA3LCJpYXQiOjE3MDE0MTU0NzN9.a2wL9Yz-cEomJ7aCjJo_5WlcE5oiQyOepObHkEYyeWw";
var initCesium = /** @class */ (function () {
    function initCesium(boxName, options) {
        if (options === void 0) { options = {}; }
        // 选项中boxname为必填项目
        if (!boxName) {
            console.log("boxName 为必填字段");
            return;
        }
        this.boxName = boxName;
        this.options = __assign({ infoBox: false, animation: false, baseLayerPicker: false, fullscreenButton: false, vrButton: false, homeButton: false, sceneModePicker: false }, options);
        this.Viewer = null;
        // 初始化地图
        this.initMap();
    }
    //  初始化地图          
    initCesium.prototype.initMap = function () {
        this.Viewer = new Cesium.Viewer(this.boxName, this.options);
    };
    return initCesium;
}());
exports["default"] = initCesium;
