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
var BaiduImageryProvider_js_1 = require("@/components/cesium/model/BaiduImageryProvider.js");
require("cesium/Build/CesiumUnminified/Widgets/widgets.css");
Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MzgwYjJjNy1jY2EyLTQzMWQtYTU4NS1mN2JkMDBiMDY0OTkiLCJpZCI6MTgxOTA3LCJpYXQiOjE3MDE0MTU0NzN9.a2wL9Yz-cEomJ7aCjJo_5WlcE5oiQyOepObHkEYyeWw";
var editEntity_1 = require("./editEntity");
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
        this.pointClick = null;
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
                "38ff10ec6e54ac30476a21a6bbf61fe4",
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
                "38ff10ec6e54ac30476a21a6bbf61fe4",
            subdomains: subdomains,
            layer: "tdtCiaLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible"
        }));
        // 百度地图引用底图
        var baiduImageryProvider = new BaiduImageryProvider_js_1.BaiduImageryProvider({
            url: "http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46"
        });
        // 添加点击事件
        this.bindClick();
        // this.setCamerPosition({x: -2392480.60956927, y: 5127431.693189062, z: 2934902.146746033}, {x: -2392609.893707916, y: 5127106.880787394, z: 2934661.692260771})
        // 在windows中挂载获取摄像头视角信息方法
        window.getCameraMessage = function () {
            _this.getCameraPosition();
        };
    };
    // 设置点击实体执行的方法
    initCesium.prototype.setPointClick = function (callBack) {
        this.pointClick = callBack;
    };
    // 实体点击事件
    initCesium.prototype.bindClick = function () {
        var _this = this;
        // 创建 ScreenSpaceEventHandler 对象
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        // 绑定鼠标点击事件
        handler.setInputAction(function (e) {
            var _a;
            console.log("屏幕坐标：" + e.position);
            // 屏幕坐标转笛卡尔世界坐标
            var rany = _this.viewer.camera.getPickRay(e.position);
            if (rany) {
                var cartesian3 = _this.viewer.scene.globe.pick(rany, _this.viewer.scene);
                console.log("世界坐标： " + cartesian3);
                if (!cartesian3)
                    return;
                // 世界坐标转弧度坐标
                var cartograpgic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian3);
                console.log("WGS84坐标系:" + cartograpgic);
            }
            // 获取点击的经纬度
            var position = _this.viewer.scene.pickPosition(e.position);
            if (Cesium.defined(position)) {
                var cartographic = Cesium.Cartographic.fromCartesian(position);
                // console.log(cartographic);
                var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                console.log("Clicked at: " + longitude + ", " + latitude);
            }
            var pick = _this.viewer.scene.pick(e.position);
            if (pick && pick.id) {
                if (typeof (_this.pointClick) === 'function') {
                    // 将点位信息发送给自定义方法中
                    _this.pointClick((_a = pick.id.properties) === null || _a === void 0 ? void 0 : _a.data._value.data);
                }
                // 存储点击信息
                // this.tempData = pick.id._properties?._data?._value;
                // console.log(this.tempData);
                // 判断点击的实体是否为视频点位
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };
    // 添加3dtitle 斜切摄影
    initCesium.prototype.set3dTitles = function (url) {
        // try{
        //   let tileset = new Cesium.Cesium3DTileset({
        //     url: url,
        //     maximumScreenSpaceError: 16, // 这个数据越大在里的很远的时候模糊，越近越清晰
        //   });
        //   this.viewer.scene.primitives.add(tileset)
        //   this.viewer.zoomTo(tileset)
        // }catch(err) {
        // }
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
    initCesium.prototype.setCamerPosition = function (newCurrentPosition, newCurrentDirection) {
        var currentPosition = new Cesium.Cartesian3(newCurrentPosition.x, newCurrentPosition.y, newCurrentPosition.z);
        var currentDirection = new Cesium.Cartesian3(newCurrentDirection.x, newCurrentDirection.y, newCurrentDirection.z);
        var targetPosition = Cesium.Cartesian3.add(currentPosition, currentDirection, new Cesium.Cartesian3());
        this.viewer.camera.flyTo({
            destination: currentPosition,
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-45.0),
                roll: 0 //  // 翻滚角
            },
            duration: 3
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
    /*
    *
    * */
    initCesium.prototype.addPoint = function (lng, lat, options) {
        if (options === void 0) { options = {}; }
        // 判断是否添加到指定集合列表中
        var point = this.viewer.entities.add({
            name: 'Point',
            position: Cesium.Cartesian3.fromDegrees(lng, lat),
            point: {
                pixelSize: options.pixelSize ? options.pixelSize : 10,
                color: options.color ? Cesium.Color.fromCssColorString(options.color) : Cesium.Color.RED,
                outlineColor: options.outlineColor ? Cesium.Color.fromCssColorString(options.outlineColor) : Cesium.Color.WHITE,
                outlineWidth: options.outlineWidth ? options.outlineWidth : 0,
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
                disableDepthTestDistance: Number.POSITIVE_INFINITY // 在 1000.0 - 2000.0 距离范围内禁用深度测试
            },
            label: {
                text: '何须问',
                font: '12px Arial',
                fillColor: Cesium.Color.YELLOW,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 0,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -20) // 标签偏移量
            }
        });
    };
    initCesium.EditEntity = editEntity_1["default"];
    return initCesium;
}());
exports["default"] = initCesium;
