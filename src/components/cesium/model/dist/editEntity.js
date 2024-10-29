"use strict";
exports.__esModule = true;
var Cesium = require("cesium");
var editEntity = /** @class */ (function () {
    function editEntity(viewer) {
        this.viewer = viewer;
        // 统一管理实体资源
        this.dataSource = {};
        this.manListproperty = {};
    }
    // 处理自定义颜色
    editEntity.prototype.setColor = function (color) {
        if (color) {
            return Cesium.Color.fromCssColorString(color);
        }
        return '';
    };
    // 添加点位基本信息
    editEntity.prototype.addPoint = function (lat, lng, options, dataSourceName) {
        var _a, _b, _c, _d;
        if (options === void 0) { options = {}; }
        if (!lat && !lng) {
            console.log("请上传点位的经纬度");
            return;
        }
        var viewer = this.dataSource[dataSourceName] || this.viewer;
        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(lat, lng),
            // id: id,
            // description: options.data,
            point: {
                pixelSize: ((_a = options.point) === null || _a === void 0 ? void 0 : _a.pixelSize) || 30,
                color: this.setColor((_b = options.point) === null || _b === void 0 ? void 0 : _b.color) || Cesium.Color.RED,
                outlineColor: this.setColor((_c = options.point) === null || _c === void 0 ? void 0 : _c.outlineColor) || Cesium.Color.WHITE,
                outlineWidth: ((_d = options.point) === null || _d === void 0 ? void 0 : _d.outLineWidth) || 2
            },
            properties: {
                data: options.data
            },
            label: this.getPointLabel(options.label),
            billboard: this.getBillboard(options.billboard)
        });
    };
    // 点位label
    editEntity.prototype.getPointLabel = function (label) {
        if (label && Object.keys(label).length) {
            return {
                text: label.text || "1111",
                font: label.font || "14pt monospace",
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                fillColor: this.setColor(label.fillColor) || Cesium.Color.GOLD,
                outlineColor: this.setColor(label.outlineColor) || Cesium.Color.BLACK,
                outlineWidth: label.outlineWidth || 2,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(label.Offsetx || 0, label.Offsety || 0)
            };
        }
        else {
            return {};
        }
    };
    // 点位图标
    editEntity.prototype.getBillboard = function (billboard) {
        console.log(billboard, 2222);
        if (billboard && Object.keys(billboard).length) {
            return {
                image: billboard.image || require("@/assets/cesium/location2.png"),
                scale: 2.0,
                width: billboard.width || 30,
                height: billboard.height || 30,
                depthTest: false,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                // 调整图标的位置
                pixelOffset: {
                    x: billboard.Offsetx || 0,
                    y: billboard.Offsety || 0
                }
            };
        }
        else {
            return {};
        }
    };
    // 设置固定位置
    editEntity.prototype.setFixedPosition = function (position) {
        this.viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(position.lng, position.lat),
            orientation: {
                heading: position.heading ? Cesium.Math.toRadians(position.heading) : undefined,
                pitch: position.pitch ? Cesium.Math.toRadians(position.pitch) : undefined,
                roll: 0.0
            }
        });
    };
    // 设置地图平滑移动
    editEntity.prototype.setFlyTo = function (position) {
        this.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(position.lng, position.lat),
            orientation: {
                heading: position.heading ? Cesium.Math.toRadians(position.heading) : undefined,
                pitch: position.pitch ? Cesium.Math.toRadians(position.pitch) : undefined,
                roll: position.roll ? position.roll : 0.0 // 旋转角度
            },
            duration: position.duration ? position.duration : 5
        });
    };
    // 绘制线条
    editEntity.prototype.addPolyline = function (lineList, options, dataSourceName) {
        if (lineList === void 0) { lineList = []; }
        if (options === void 0) { options = {}; }
        if (lineList.length == 0) {
            console.log("请传递线条的经纬信息");
            return;
        }
        var viewer = this.dataSource[dataSourceName] || this.viewer;
        viewer.entities.add({
            name: options.name || "Red line",
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray(lineList.flat()),
                width: options.width || 5,
                material: this.setColor(options.color) || Cesium.Color.RED
            }
        });
    };
    // 绘制平面
    editEntity.prototype.addPolygon = function (polygonList, options, dataSourceName) {
        if (polygonList === void 0) { polygonList = []; }
        if (options === void 0) { options = {}; }
        if (polygonList.length == 0) {
            console.log("请传递绘制平面的所有经纬信息");
            return;
        }
        var viewer = this.dataSource[dataSourceName] || this.viewer;
        viewer.entities.add({
            name: options.name || "Blue polygon",
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArray(polygonList),
                material: this.setColor(options.color) || Cesium.Color.BLUE.withAlpha(0.5)
            }
        });
    };
    // 绘制轨迹回放功能
    editEntity.prototype.linePlay = function (lineList, timeSpace, options, dataSourceName) {
        if (lineList === void 0) { lineList = []; }
        if (options === void 0) { options = {}; }
        // 判断数据是否存在
        if (!lineList.length) {
            console.log("轨迹路线为必传项");
            return;
        }
        // 判断数据源是否存在
        var viewer = this.dataSource[dataSourceName] || this.viewer;
        // 定义路径
        var property = new Cesium.SampledPositionProperty();
        // 定义时间范围
        var startTime = new Date();
        var stopTime = startTime;
        var startTimeStamp = startTime.getTime();
        // 先添加一条原有轨迹
        this.addPolyline(lineList, {}, 'ManageLine');
        // 添加每一个时间段的位置
        lineList.forEach(function (item, index) {
            var time = new Date(startTimeStamp + index * timeSpace * 1000);
            stopTime = time;
            var position = Cesium.Cartesian3.fromDegrees(item[0], item[1]);
            property.addSample(Cesium.JulianDate.fromDate(time), position);
        });
        // 使用插值算法 使得移动的时候平滑过渡
        property.setInterpolationOptions({
            interpolationDegree: 0.01,
            interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
        });
        // 添加轨迹
        var entitidd = viewer.entities.add({
            availability: new Cesium.TimeIntervalCollection([
                new Cesium.TimeInterval({
                    start: Cesium.JulianDate.fromDate(startTime),
                    stop: Cesium.JulianDate.fromDate(stopTime)
                }),
            ]),
            position: property,
            billboard: {
                image: require("@/assets/image/icon/videoPoint.png"),
                scale: 0.5,
                pixelOffset: new Cesium.Cartesian2(0, -20),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            },
            path: {
                leadTime: 0,
                resolution: 1,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.1,
                    color: Cesium.Color.GREEN
                }),
                width: 30
            }
        });
        return {
            startTime: startTime,
            stopTime: stopTime
        };
    };
    // 播放时间轴
    editEntity.prototype.playclock = function (startTime, stopTime) {
        this.viewer.clock.currentTime = Cesium.JulianDate.fromDate(startTime); // 修改时间轴为当前时间
        this.viewer.clock.stopTime = Cesium.JulianDate.fromDate(stopTime);
        this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // 只执行一遍
        this.viewer.clock.shouldAnimate = true; // 开始播放
    };
    // 点位移动
    editEntity.prototype.pointMove = function (moveList, dataSourceName, timeSpace, options) {
        var _this = this;
        if (timeSpace === void 0) { timeSpace = 5; }
        var viewer = dataSourceName ? this.dataSource[dataSourceName] : this.viewer;
        var startTime = new Date();
        var startTimeStamp = startTime.getTime();
        moveList.forEach(function (item) {
            if (item.lng && item.lat) {
                var property_1 = _this.manListproperty[item.type + item.id]
                    ? _this.manListproperty[item.type + item.id]
                    : new Cesium.SampledPositionProperty();
                var time = item.isFirst
                    ? new Date(startTimeStamp)
                    : new Date(startTimeStamp + timeSpace * 1000);
                var position = Cesium.Cartesian3.fromDegrees(item.lng, item.lat);
                property_1.addSample(Cesium.JulianDate.fromDate(time), position);
                console.log(property_1, 233333);
                // 设置插值算法
                if (property_1 &&
                    property_1.interpolationAlgorithm !==
                        Cesium.LagrangePolynomialApproximation &&
                    property_1._property._times.length >= 2) {
                    // 插值算法
                    property_1.setInterpolationOptions({
                        interpolationDegree: 0.01,
                        interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
                    });
                }
                // 添加实体
                if (!_this.manListproperty[item.type + item.id]) {
                    _this.manListproperty[item.type + item.id] = property_1;
                    viewer.entities.add({
                        properties: {
                            data: item
                        },
                        id: item.type + item.id,
                        position: new Cesium.CallbackProperty(function () {
                            // 获取实时位置
                            // 当前时间数据
                            var timeposition = Cesium.JulianDate.fromDate(new Date());
                            // 将位置转换成为经纬度
                            if (property_1.getValue(timeposition)) {
                                var Cartographic = Cesium.Cartographic.fromCartesian(property_1.getValue(timeposition), _this.viewer.scene.globe.ellipsoid);
                                // Cartographic 获取的为度数，还需要将度数转换成为经纬度
                                var lng = Cesium.Math.toDegrees(Cartographic.longitude);
                                var lat = Cesium.Math.toDegrees(Cartographic.latitude);
                                var entity = _this.getEntity(item.type, item.type + item.id);
                                //自定义弹窗跟随移动
                                if (entity && entity.properties && entity.properties.billboardObj) {
                                    entity.properties.billboardObj.updataPosition({ lat: lat, lng: lng });
                                    entity.properties.billboarduser.updataPosition({ lat: lat, lng: lng });
                                    entity.properties.billboardObj.updateBillboardLocation();
                                    entity.properties.billboarduser.updateBillboardLocation();
                                }
                                // 判断点位是否需要计算周边摄像头位置信息
                                return property_1.getValue(timeposition);
                            }
                        }, false),
                        label: _this.getPointLabel(options === null || options === void 0 ? void 0 : options.label),
                        billboard: _this.getBillboard(options === null || options === void 0 ? void 0 : options.billboard)
                    });
                }
            }
        });
    };
    // 实体的统一管理
    // 统一管理数据源数据
    editEntity.prototype.creatDataSource = function (dataSourceName) {
        if (this.dataSource[dataSourceName]) {
            console.log("该数据源名称已存在");
            return;
        }
        this.dataSource[dataSourceName] = new Cesium.CustomDataSource(dataSourceName);
        this.viewer.dataSources.add(this.dataSource[dataSourceName]);
    };
    // 从数据源数据中移除指定 实体（Entity）
    editEntity.prototype.removeEntity = function (dataSourceName, entity) {
        this.dataSource[dataSourceName].entities.remove(entity);
    };
    // 通过实体（entity）的id查询到对应实体
    editEntity.prototype.getEntity = function (dataSourceName, id) {
        return this.dataSource[dataSourceName].entities.getById(id);
    };
    // 数据源中的所有实体
    editEntity.prototype.getEntityList = function (dataSourceName) {
        return this.dataSource[dataSourceName].entities.values;
    };
    // 控制数据源中的实体的显示与隐藏
    editEntity.prototype.isShowDataSource = function (dataSourceName, isShow) {
        this.getEntityList(dataSourceName).forEach(function (entity) {
            entity.show = isShow;
        });
    };
    // 删除数据源中的所有实体
    editEntity.prototype.removeAllEntity = function (dataSourceName) {
        this.dataSource[dataSourceName].entities.removeAll();
    };
    return editEntity;
}());
exports["default"] = editEntity;
