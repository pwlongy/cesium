"use strict";
/*
  在cesium中，将经纬度转换成位世界笛卡尔三维坐标去处理
  cesium.Cartesian3.forDegrees(经度, 纬度, 高度)


  du(度) = radus(弧度)/pi*180
  
  
  1. WGS84弧度坐标（cartographic）
  对象创建： new Cesium.Cartographic(lng, lat, height)

  2. 笛卡尔空间直角坐标系（cartesian3）
  对象创建 new Cesium.cartesian3(x,y,z)

  3. 笛卡尔平面坐标系(cartesian2)
  对象创建： new Cesium.cartesian2(x, y)


*/
exports.__esModule = true;
/*
  1. 坐标之间的转换
   1.1. 弧度与经纬度之间的转换
   let degrees = Cesium.Cesium.CesimMath.toDegree(radians)
   1.2. 经纬度转弧度
   let radians = new Cesium.CesiumMath.toRadianc(degrees)

   2. WGS84坐标构建
   2.1 由弧度创建
   let cartographic = new Cesium.Cartographic(lng, lat, alt)
   静态函数
   let cartogrographic = Cesium.Cartogrophic.fromRadians(lng, lat, alt)

   let cartogrographic = Cesium.cartogrophic.fromDegrees(lng, lat, alt)

   3. WGS84弧度坐标系与笛卡尔空间直角坐标系之间的转换
   let cartesian3 = Cesium.Cartesian3.fromDegrees(lng, lat, alt)
   没有高度
   let cartesian3 = Cesium.Cartesian3.fromDegreesArray([lng, lat])
   有高度
   let cartesian3 = Cesium.Cartesian3.fromDegreesArrayHeight([lng, lat, height])
   


*/
var positionChange = /** @class */ (function () {
    function positionChange() {
    }
    return positionChange;
}());
exports["default"] = positionChange;