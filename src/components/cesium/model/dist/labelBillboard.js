"use strict";
exports.__esModule = true;
var Cesium = require("cesium");
// 自定义label 的显示
var labelBillboard = /** @class */ (function () {
    function labelBillboard(viewer, position, HtmlResult, options) {
        if (options === void 0) { options = {}; }
        this.options = options;
        this.id = options.type + options.id;
        // 判断传递过来的数据类型
        var elementObj = HtmlResult instanceof Function ? HtmlResult() : HtmlResult;
        // console.log(HtmlResult);
        // 经纬度不存在的时候直接return
        if (!position.lng || !position.lat)
            return;
        this.viewer = viewer;
        this.position = Cesium.Cartesian3.fromDegrees(position.lng, position.lat, position.height || 0);
        this.element = elementObj;
        // 获取相机高度
        this.maxRenderDis =
            Math.round(viewer.camera.positionCartographic.height) * 5;
        this.show = true;
        this.initBillboard();
    }
    labelBillboard.prototype.initBillboard = function () {
        var _this = this;
        // 创建一个div
        var userBox = document.createElement("div");
        // userBox.id = this.id;
        userBox.style.position = "absolute";
        userBox.className = "resultMarker";
        userBox.innerHTML = JSON.stringify(this.element);
        this.element = userBox;
        // 自定义html
        this.viewer.cesiumWidget.container.appendChild(this.element);
        //实时更新 场景渲染完成执行的操作，会一直执行
        // this.viewer.scene.postRender.addEventListener(() => {
        //   this.updateBillboardLocation();
        // });
        // 第一次显示的时候显示
        this.updateBillboardLocation();
        // 实时更新点位位置 相机位置移动时执行方法
        var previousCameraPosition = this.viewer.camera.position.clone();
        this.viewer.scene.postRender.addEventListener(function () {
            // 获取相机位置
            var currentCameraPosition = _this.viewer.camera.position;
            // 相机位置发生变化
            _this.updateBillboardLocation();
            // 相机位置发生变化时触发label位置更新
            if (!currentCameraPosition.equals(previousCameraPosition)) {
            }
            previousCameraPosition = currentCameraPosition.clone();
        });
        // 相机视角改变时触发, 触发时，执行不是很灵敏
        // this.viewer.camera.changed.addEventListener(() => {
        //    this.updateBillboardLocation();
        //   console.log('视角发生变化')
        // })
    };
    labelBillboard.prototype.updataPosition = function (position) {
        this.position = Cesium.Cartesian3.fromDegrees(position.lng, position.lat, position.height || 0);
    };
    labelBillboard.prototype.updateBillboardLocation = function () {
        // 控制自定义label元素的位置
        if (this.element) {
            // 地图盒子的高度
            var canvasHeight = this.viewer.scene.canvas.clientHeight;
            var windowPosition = new Cesium.Cartesian2();
            Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, this.position, windowPosition);
            this.element.style.bottom = canvasHeight - windowPosition.y + "px";
            var elWidth = this.element.offsetWidth;
            this.element.style.left = windowPosition.x - elWidth / 2 + "px";
            var camerPosition = this.viewer.camera.position;
            var height = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(camerPosition).height;
            height += this.viewer.scene.globe.ellipsoid.maximumRadius;
            if (this.show) {
                if (!(Cesium.Cartesian3.distance(camerPosition, this.position) > height) &&
                    this.viewer.camera.positionCartographic.height < this.maxRenderDis) {
                    this.element.style.display = "block";
                }
                else {
                    this.element.style.display = "none";
                }
            }
            else {
                this.element.style.display = "none";
            }
        }
    };
    return labelBillboard;
}());
exports["default"] = labelBillboard;
