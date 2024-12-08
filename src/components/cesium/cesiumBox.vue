<template>
  <div id="cesiumcontainer"></div>
</template>

<script setup lang="ts">
import initCesium from "./model/initCesium";

import {
  myObject,
} from './model/interfaceBox/interfaceList'
import { onMounted } from "vue";
// 用于保存实体集合对象的列表
onMounted(() => {
  let options = {
  };
  // 初始化地图
  let viewer = new initCesium("cesiumcontainer", options);
  // 设置点击实体事件
  viewer.setPointClick(clickPoint)
  // viewer.addPoint(115.01221108836832, 27.581318249016455, {
  //   pixelSize: 6,
  //   outlineWidth: 1,
  //   color: '#fff',
  //   outlineColor: "red",
  // })

  // 添加点位
  const editEntity = new initCesium.EditEntity(viewer.viewer)
  // 统一管理实体
  editEntity.creatDataSource('test')
  // 添加点位
  const params = {
    data: {
      name: 'test'
    },
    point: {
      pixelSize: 0
    },
    label: {
      text: '何须问',
      Offsety: -30
    },
    // billboard: {
    //   Offsety: 0
    // }
  }
  editEntity.addPoint(115.01221108836832, 27.581318249016455, params, 'test')


  // 添加轨迹移动
  // 绘制线条
  editEntity.creatDataSource('ManageLine')

  // 点位实时移动
  let pointList = [
    {
      lat: -72.1641667,
      lng: 39.9522222,
      type: 'man',
      id: 1
    },
    {
      lat: -75.1,
      lng: 39.9522222,
      type: 'man',
      id: 1
    },
    {
      lat: -76.1,
      lng: 39.9522222,
      type: 'man',
      id: 2
    },
    {
      lat: -78.1,
      lng: 39.9522222,
      type: 'man',
      id: 2
    },
  ]
  
  editEntity.creatDataSource('man')
  // editEntity.pointMove(pointList, 'man', 5, {})



  // 线条数据
  let lineData = [
    [-72.1641667, 39.9522222],
    [-75.1, 39.57],
    [-76.1, 34.57],
    [-78.1, 28.57],
    [-79.1, 23.57],
    [-80.12, 25.46],
    [-85.12, 26.46],
    [-91.12, 28.46],
    [-100.56, 30.67],
    [-98.56, 34.67],
    [-95.56, 38.67],
    [-91.56, 39.67],
    [-90.75, 40.24],
  ];


  let Lineparams = {

  }
  let timeObj = editEntity.linePlay(lineData, 5, Lineparams, 'ManageLine')
  if(timeObj && Object.keys(timeObj)){
    editEntity.playclock(timeObj.startTime, timeObj.stopTime)
  }
});

// 设置点击实体
let clickPoint= (data: myObject):void =>{
  console.log(121111111, data)
}



// cesium中的坐标
// 1. WGS84弧度坐标 
//  创建方式 new Cesium.Cartographic(lng, lat, height)
//  du = radus/pi * 180
// 弧度转经纬度
// let degrees = Cesium.cesiumMath.toDegree(radians)


</script>

<style lang="scss" scoped>
#cesiumcontainer {
  width: 100%;
  height: 100%;
}
</style>
