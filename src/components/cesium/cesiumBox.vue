<template>
  <div id="cesiumcontainer"></div>
</template>

<script setup lang="ts">
import initCesium from "./model/initCesium";

import {
  myObject,
} from './model/interfaceBox/interfaceList'
import { onMounted } from "vue";
import editEntity from "@/components/cesium/model/editEntity";

// 设置所有统一管理的数据源
const dataSource = ["points", "polylines", "polygons"]
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

  const editEntity = new initCesium.EditEntity(viewer.viewer)


  // 加载地形数据
  editEntity.addTerrainData('/data/terrain/xiajiang/')


  // 统一管理实体
  dataSource.forEach(item => {
    editEntity.creatDataSource(item)
  })
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
  editEntity.addPoint(115.01221108836832, 27.581318249016455, params, 'points')

  // 添加线
  let linePoint = [
    [115.01221108836832, 27.581318249016455],
    [115.21221108836832, 27.581318249016455],
    [115.31221108836832, 27.581318249016455],
    [115.41221108836832, 27.581318249016455],
    [115.51221108836832, 27.581318249016455],
  ]
  editEntity.addPolyline(linePoint, {}, "polygon")
  // 添加面
  let polygonPoint = [
  115.01221108836832, 27.981318249016455,
  115.11221108836832, 27.571318249016455,
  115.561221108836832, 27.681318249016455,
  115.96221108836832, 27.5891318249016455,
  115.91221108836832, 27.681318249016455
  ]
  editEntity.addPolygon(polygonPoint, {}, "polygons")

  // 添加轨迹移动
  // 绘制线条
  editEntity.creatDataSource('ManageLine')


  // 添加模型文件
  let modelPosition = {
    lng: 115.01221108836832,
    lat: 27.581318249016455,
    height: 200,
  }
  let url = "/data/fly/scene.gltf"
  // viewer.addentityGltf(modelPosition, url)


  // 添加贴地线
  editEntity.addStickGround()


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
    modelObj: {
      scale: 1
    }
  }
  let timeObj = editEntity.linePlay(lineData, 5, Lineparams, 'ManageLine')
  if (timeObj && Object.keys(timeObj)) {
    editEntity.playclock(timeObj.startTime, timeObj.stopTime, timeObj.entitidd)
  }




// 添加点位图元数据集合
  let position = {
    lng: -72.69,
    lat: 40.23,
    height: 0
  }
  let paramsObj = {
    color: "blue",
    outlineColor: "red",
    outlineWidth: 5
  }
  let points = editEntity.addPointPrimitives(position, paramsObj)


  // 添加平面图元集合
  let list = [
    -72.0, 40.0,
    -70.0, 35.0,
    -75.0, 30.0,
    -70.0, 30.0,
    -68.0, 40.0
  ]
  // editEntity.addPolygonPrimitives(list)



  // 添加动态水面
  editEntity.addWater(list)

  // 为地形数据添加等高线
  // editEntity.addContour()

  // 设置晕眩图
  // editEntity.addDizzinessDiagram()

  // 设置多种材质渲染
  editEntity.addMultipleMaterial()

  // 设置自定义材料
  editEntity.addCustomizeMaterial()

  // 添加菜单
  editEntity.addMenu()

  // 添加粒子效果
  editEntity.addParticle()
});



// 设置点击实体
let clickPoint = (data: myObject): void => {
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
