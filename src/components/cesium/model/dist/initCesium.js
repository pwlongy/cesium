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
var common_1 = require("@/utils/common/common");
console.log(common_1.getuuid());
require("cesium/Build/CesiumUnminified/Widgets/widgets.css");
Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MzgwYjJjNy1jY2EyLTQzMWQtYTU4NS1mN2JkMDBiMDY0OTkiLCJpZCI6MTgxOTA3LCJpYXQiOjE3MDE0MTU0NzN9.a2wL9Yz-cEomJ7aCjJo_5WlcE5oiQyOepObHkEYyeWw";
var subdomains = ["0", "1", "2", "3", "4", "5", "6", "7"];
var initCesium = /** @class */ (function () {
    function initCesium(boxName, options) {
        // 选项中boxname为必填项目
        if (!boxName) {
            console.log("boxName 为必填字段");
            return;
        }
        this.boxName = boxName;
        this.options = __assign({ infoBox: false, animation: false, baseLayerPicker: false, fullscreenButton: false, vrButton: false, geocoder: false, homeButton: false, sceneModePicker: false, selectionIndicator: false, timeline: false, navigationHelpButton: false, navigationInstructionsInitiallyVisible: false, scene3DOnly: false, shouldAnimate: false, useDefaultRenderLoop: true, showRenderLoopErrors: false, automaticallyTrackDataSourceClocks: false }, options);
        // 用于保存实体集合对象的列表
        this.entitiesObj = {};
        // 初始化地图
        this.initMap();
    }
    //  初始化地图
    initCesium.prototype.initMap = function () {
        var _this = this;
        this.viewer = new Cesium.Viewer(this.boxName, this.options);
        // 加载影像地图
        this.viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
            url: "http://t{s}.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=" +
                "c9ad47bbc7e1f8dc4b84533ad2f6dbc5",
            subdomains: subdomains,
            layer: "tdtImgLayer",
            style: "default",
            format: "image/jpeg",
            maximumLevel: 18,
            tileMatrixSetID: "GoogleMapsCompatible"
        }));
        // 加载矢量底图
        this.viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
            // 影像注记
            url: "http://t{s}.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=" +
                "c9ad47bbc7e1f8dc4b84533ad2f6dbc5",
            subdomains: subdomains,
            layer: "tdtCiaLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible"
        }));
        // 添加点击事件
        this.bindClick();
        this.setCamerPosition();
        // 在windows中挂载获取摄像头视角信息方法
        window.getCameraMessage = function () {
            _this.getCameraPosition();
            console.log(123456);
        };
    };
    // 实体点击事件
    initCesium.prototype.bindClick = function () {
        var _this = this;
        // 创建 ScreenSpaceEventHandler 对象
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        // 绑定鼠标点击事件
        handler.setInputAction(function (e) {
            // 获取点击的经纬度
            var position = _this.viewer.scene.pickPosition(e.position);
            if (Cesium.defined(position)) {
                var cartographic = Cesium.Cartographic.fromCartesian(position);
                // console.log(cartographic);
                var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                console.log("Clicked at: " + longitude + ", " + latitude);
                console.log(new Cesium.Cartesian2(longitude, latitude));
            }
            var pick = _this.viewer.scene.pick(e.position);
            if (pick && pick.id) {
                // 存储点击信息
                // this.tempData = pick.id._properties?._data?._value;
                // console.log(this.tempData);
                // 判断点击的实体是否为视频点位
                if (pick.id._id.indexOf("video") >= 0) {
                    // 弹出视频弹窗
                    // this.$refs.detailDialog.show = true;
                }
                else if (pick.id._id.indexOf("work") >= 0) {
                    // 判断点击的实体是否为特殊工作
                    // this.$refs.workDetail.show = true;
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };
    // 获取相机位置
    initCesium.prototype.getCameraPosition = function () {
        var camera = this.viewer.camera;
        // 获取相机位置
        var cameraPosition = camera.positionWC;
        // 获取相机方向
        var cameraDirection = camera.directionWC;
        console.log(cameraPosition, cameraDirection);
    };
    // 设置摄像机位置
    initCesium.prototype.setCamerPosition = function () {
        this.viewer.camera.flyTo({
            destination: new Cesium.Cartesian3(-2392467.273773407, 5127363.765234839, 2935117.0106312386),
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-45.0)
            },
            duration: 10
        });
    };
    // 添加指定集合列表
    initCesium.prototype.setEntitiesObj = function (entitiesName) {
        this.entitiesObj[entitiesName] = new Cesium.EntityCollection();
        this.viewer.entities.add(this.entitiesObj[entitiesName]);
    };
    // 清除指定集合列表
    initCesium.prototype.clearEntitiesObj = function (entitiesName) {
        this.entitiesObj[entitiesName].removeAll();
    };
    // 清除所有集合中的数据
    initCesium.prototype.clearAllEntitiesObj = function () {
        for (var key in Object.keys(this.entitiesObj)) {
            this.entitiesObj[key].removeAll();
        }
    };
    // 添加点位
    initCesium.prototype.addPoint = function (lng, lat, options) {
        var point = this.viewer.entities.add({
            name: 'Point',
            position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
            point: {
                pixelSize: 10,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
                disableDepthTestDistance: new Cesium.NearFarScalar(1.0, 1000.0, 1000000.0, 2000.0) // 在 1000.0 - 2000.0 距离范围内禁用深度测试
            }
        });
    };
    return initCesium;
}());
exports["default"] = initCesium;
