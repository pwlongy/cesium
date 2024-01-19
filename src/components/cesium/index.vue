<template>
  <div id="cesiumContainer" style="width: 100%; height: 100%;"></div>
</template>


<script setup >

import { onMounted } from 'vue';

let cesiumAsset = '你的资源'
let TDU_Key = 'c9ad47bbc7e1f8dc4b84533ad2f6dbc5' // 天地图的key
let viewer


onMounted(() => {
  viewer = new Cesium.Viewer("cesiumContainer", {
    // terrainProvider: Cesium.createWorldTerrain()
    scene3DOnly: true,
    infoBox: false,
    selectionIndicator: false
  });
  addMarker()
  cameraFly()
  clickHeader()


  // var TDU_Key = "a89df02c93e5474e9ebeb81a32fcb487"//天地图申请的密钥

  //在线天地图影像服务地址(墨卡托投影)
  var TDT_IMG_W = "http://{s}.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
    "&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
    "&style=default&format=tiles&tk=" + TDU_Key;
  //在线天地图矢量地图服务(墨卡托投影) 
  var TDT_VEC_W = "http://{s}.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
    "&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
    "&style=default&format=tiles&tk=" + TDU_Key;
  //在线天地图影像中文标记服务(墨卡托投影)  
  var TDT_CIA_W = "http://{s}.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
    "&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
    "&style=default.jpg&tk=" + TDU_Key
  //在线天地图矢量中文标记服务(墨卡托投影)            
  var TDT_CVA_W = "http://{s}.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
    "&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
    "&style=default.jpg&tk=" + TDU_Key;



  let Img = new Cesium.WebMapTileServiceImageryProvider({   //调用影响中文服务
    url: TDT_IMG_W,//url地址
    layer: "img_w",	//WMTS请求的层名称
    style: "default",//WMTS请求的样式名称
    format: "tiles",//MIME类型，用于从服务器检索图像
    tileMatrixSetID: "GoogleMapsCompatible",//	用于WMTS请求的TileMatrixSet的标识符
    subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],//天地图8个服务器
    minimumLevel: 0,//最小层级
    maximumLevel: 18,//最大层级
  })

  viewer.imageryLayers.addImageryProvider(Img)//添加到cesium图层上


  let cia = new Cesium.WebMapTileServiceImageryProvider({   //调用影响中文注记服务
    url: TDT_CIA_W,
    layer: "cia_w",
    style: "default",
    format: "tiles",
    tileMatrixSetID: "GoogleMapsCompatible",
    subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],//天地图8个服务器
    minimumLevel: 0,
    maximumLevel: 18,
  })

  viewer.imageryLayers.addImageryProvider(cia)//添加到cesium图层上
})


// 给实体添加点击事件
let clickHeader = () => {
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction((event) => {
    // 获取 pick 拾取对象
    let pick = viewer.scene.pick(event.position);
    console.log(pick)
    // 判断是否获取到了 pick 
    if (Cesium.defined(pick)) {
      // 修改拾取到的entity的样式
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}









// 服务负载子域
// let subdomains = ['0', '1', '2', '3', '4', '5', '6', '7'];
// Cesium.Ion.defaultAccessToken = cesiumAsset
// onMounted(async() => {
//   Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MzgwYjJjNy1jY2EyLTQzMWQtYTU4NS1mN2JkMDBiMDY0OTkiLCJpZCI6MTgxOTA3LCJpYXQiOjE3MDE0MTU0NzN9.a2wL9Yz-cEomJ7aCjJo_5WlcE5oiQyOepObHkEYyeWw';
//   viewer = await new Cesium.Viewer('cesiumContainer', {
//     infoBox: false
//   });

//   cameraFly()
// })

// 将三维球定位到中国
let cameraFly = () => {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 17850000),
    orientation: {
      heading: Cesium.Math.toRadians(348.4202942851978),
      pitch: Cesium.Math.toRadians(-89.74026687972041),
      roll: Cesium.Math.toRadians(0)
    },
    complete: function callback() {
      // 定位完成之后的回调函数
    }
  });
}


// 进行点位操作
let pointInfo = [
  {
    id: "392f7fbb-ae25-4eef-ac43-58fd91148d1f",
    latitude: "31.87532",
    longitude: "120.55538",
    psName: "有限公司1",
  },
  {
    id: "0278a88c-b4f4-4d64-9ccb-65831b3fb19d",
    latitude: "31.991057",
    longitude: "120.700713",
    psName: "有限公司2",
  },
  {
    id: "248f6853-2ced-4aa6-b679-ea6422a5f3ac",
    latitude: "31.94181",
    longitude: "120.51517",
    psName: "有限公司3",
  },
  {
    id: "F8DADA95-A438-49E1-B263-63AE3BD7DAC4",
    latitude: "31.97416",
    longitude: "120.56132",
    psName: "有限公司4",
  },
  {
    id: "9402a911-78c5-466a-9162-d5b04d0e48f0",
    latitude: "31.91604",
    longitude: "120.57771",
    psName: "有限公司5",
  },
  {
    id: "EB392DD3-6998-437F-8DCB-F805AD4DB340",
    latitude: "31.88727",
    longitude: "120.48887",
    psName: "有限公司6",
  },
];

// 点位的加载
let addMarker = () => {
  // 清除上一次点位
  viewer.entities.removeAll()
  // 通过循环添加点位
  pointInfo.forEach(item => {
    viewer.entities.add({
      name: item.psName,
      code: item.id,
      id: item.id,
      position: Cesium.Cartesian3.fromDegrees(item.longitude * 1, item.latitude * 1),
      // 添加点位
      point: {
        pixelSize: 5,
        color: Cesium.Color.RED,
        outerHeight: Cesium.Color.WHILE,
        outlineWidth: 2
      },
      // 添加文字标签
      label: {
        // show: false,
        text: item.psName,
        font: "12px monospace",
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: Cesium.Color.LIME,
        outlineWidth: 4,     // 轮廓宽度的数字属性
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 垂直方向以底部来计算标签的位置
        pixelOffset: new Cesium.Cartesian2(0, -20), // 偏移量
      },
      // 图标
      billboard: {
        image: require("@/assets/logo.png"),
        width: 18,
        height: 24,
      },

    })
  })




  // 增加实体模型
  viewer.entities.add({
    name: "Blue box",
    position: Cesium.Cartesian3.fromDegrees(120.55538, 31.87532, 100.0),
    box: {
      // new Cesium.Cartesian3(长, width, height)
      dimensions: new Cesium.Cartesian3(11140.0, 111100.0, 11150.0),
      material: Cesium.Color.BLUE, // 配置颜色
      // material: Cesium.Color.RED.withAlpha(0.5), // 配置颜色透明度
      // fill: false, // 配置 是否填满
      // outline: true, // 配置 是否显示外边框线
      // outlineColor: Cesium.Color.YELLOW, // 配置 设置外边框线颜色
    },
  });
  viewer.zoomTo(viewer.entities); // 定位到实体

}

</script>


<style lang="less" scoped></style>