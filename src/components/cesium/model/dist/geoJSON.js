"use strict";
exports.__esModule = true;
var Cesium = require("cesium");
var GeoJSON = /** @class */ (function () {
    function GeoJSON(viewer) {
        this.viewer = viewer;
    }
    // 直接读取本地文件的方式获取数据
    GeoJSON.prototype.setGEOJSON = function (json) {
        var _this = this;
        var promise = Cesium.GeoJsonDataSource.load(json);
        promise.then(function (res) {
            _this.viewer.dataSources.add(res);
            res.entities.values.forEach(function (item) {
                console.log(item.polygon);
            });
            _this.viewer.zoomTo(res);
        });
    };
    return GeoJSON;
}());
exports["default"] = GeoJSON;
