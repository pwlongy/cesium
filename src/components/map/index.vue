<template>
  <div class="map">
    <div id="mapDiv">
    </div>
    <div class="operate">
      <!-- 地图操作的放大缩小 -->
      <div class="upAndDown">
        <button @click="changeMap(1)">放大地图</button>
        <button @click="changeMap(0)">缩小地图</button>
      </div>
      <!-- 地图位移 -->
      <div class="displacement">
        <button @click="changeAddress">地图位移</button>
      </div>
      <!-- 设置地图等级 -->
      <div class="setZoom">
        <button @click="setZoom">设置地图等级</button>
      </div>

      <!-- 设置地图拖拽 -->
      <div class="setDrag">
        <button @click="setDrag(1)">禁止拖拽</button>
        <button @click="setDrag(0)">允许拖拽</button>
      </div>

      <!-- 获取地图范围 -->
      <div class="getrange">
        <button @click="getrange">获取地图范围</button>
      </div>

      <div>
        <button @click="setupMap(1)">允许双击放大地图</button>
        <button @click="setupMap(0)">禁止双击放大地图</button>
        <button @click="setupMap(2)">允许鼠标放大地图</button>
        <button @click="setupMap(3)">禁止鼠标放大地图</button>
      </div>

      <div>
        <button @click="setMouDrag(1)">允许鼠标惯性拖动</button>
        <button @click="setMouDrag(0)">禁止鼠标惯性拖动</button>
      </div>

      <div>
        <button @click="setZoomLevels(1, 18)">设置地图显示级别</button>
      </div>

      <br />
      <div>
        <button @click="setMaker">添加标注</button>
        <button @click="setUserMarker">自定义标注图片</button>
      </div>

      <div>
        <button @click="setLay">添加文字标注</button>
      </div>

      <div>
        <button @click="setline">添加线</button>
        <button @click="setpolygon">添加多边形</button>
        <button @click="setpolygonlon">添加带洞多边形</button>
      </div>

      <div>
        <button @click="addBound">添加矩形</button>
        <button @click="addcircle">添加圆</button>
        <button @click="addinfoWin">添加信息窗口</button>
      </div>

      <div>
        <button @click="setUserInfoWin">自定义窗口信息</button>
      </div>

      <div>
        <button @click="editLine">启用编辑线</button>
        <button @click="disableLine">禁用编辑线</button>
        <button @click="editpolygon">启用编辑面</button>
        <button @click="disablepolygon">禁用编辑面</button>
      </div>

      <div>
        <button @click="clearAll">清除覆盖物</button>
      </div>

      <div>
        <button @click="openMarker">启用点拖拽</button>
        <button @click="closeMarker">关闭点拖拽</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

let map: any = null
let T: any = window.T;

let zoom = 12

// 设置控件位置
let controlPosition = [T_ANCHOR_TOP_LEFT, T_ANCHOR_TOP_RIGHT, T_ANCHOR_BOTTOM_LEFT, T_ANCHOR_BOTTOM_RIGHT]

// 需要操作的线段
let line:any
// 需要操作的面
let polygon:any
// 操作点标记
let marker:any

// 初始化地图
const init = () => {
  map = new T.Map("mapDiv", {
    projection: 'EPSG:4326'
  });
  map.setMapType(window.TMAP_SATELLITE_MAP);
  map.centerAndZoom(new T.LngLat(116.40769, 39.89945), zoom);   //设置显示地图的中心点和级别

  //创建缩放平移控件对象
  let control = new T.Control.Zoom();
  control.setPosition(controlPosition[1]);
  //添加缩放平移控件
  map.addControl(control);


  //创建比例尺控件对象
  let scale = new T.Control.Scale();
  //添加比例尺控件
  map.addControl(scale);


  // 添加鹰眼控件
  let miniMap = new T.Control.OverviewMap({
    isOpen: true,
    size: new T.Point(150, 150)
  });
  map.addControl(miniMap);


  //添加地图类型控件
  let ctrl = new T.Control.MapType();
  //添加控件
  map.addControl(ctrl);
};



onMounted(() => {
  init()
})

// 地图的放大缩小
let changeMap = (type: number) => {
  if (type === 1) {
    map.zoomIn()
  } else {
    map.zoomOut()
  }
}

// 地图位移地址
let changeAddress = () => {
  map.panTo(new T.LngLat(116.64899, 40.12948));
}

// 设置地图等级
let setZoom = () => {
  map.setZoom(16)
}

// 控制地图拖拽
let setDrag = (type: number) => {
  if (type === 1) {
    map.disableDrag();
  } else {
    map.enableDrag();
  }
}

// 获取地图范围
let getrange = () => {
  let bs = map.getBounds();   //获取可视区域
  let bssw = bs.getSouthWest();   //可视区域左下角
  let bsne = bs.getNorthEast();   //可视区域右上角
  alert("当前地图可视范围是：" + bssw.lng + "," + bssw.lat + "到" + bsne.lng + "," + bsne.lat);
}


// 设置地图双击放大地图
let setupMap = (type: number) => {
  if (type === 1) {
    map.enableDoubleClickZoom()
  } else if (type === 0) {
    map.disableDoubleClickZoom()
  } else if (type === 2) {
    map.enableScrollWheelZoom()
  } else {
    map.disableScrollWheelZoom()
  }
}

// 设置鼠标惯性拖动
let setMouDrag = (type: number) => {
  if (type === 1) {
    map.enableInertia()
  } else {
    map.disableInertia()
  }
}

// 设置地图显示级别范围
let setZoomLevels = (min: number, max: number) => {
  map.setMinZoom(min);
  map.setMaxZoom(max);
}


// 添加标注
let setMaker = () => {
  //创建标注对象
  marker = new T.Marker(new T.LngLat(116.411794, 39.9068));
  //向地图上添加标注
  map.addOverLay(marker);
}

// 自定义标注图片
let setUserMarker = () => {
  var icon = new T.Icon({
    iconUrl: "http://api.tianditu.gov.cn/img/map/markerA.png",
    iconSize: new T.Point(19, 27),    // 图片大小（图片宽度，图片高度）
    iconAnchor: new T.Point(10, 25)   // 图片锚点，偏移位置
  });
  //向地图上添加自定义标注
  var marker = new T.Marker(new T.LngLat(116.411794, 39.9068), { icon: icon });
  map.addOverLay(marker);
}


// 添加文字标注
let setLay = () => {
  var latlng = new T.LngLat(116.420837, 39.902395);
  var label = new T.Label({
    text: "天地图：<a href='https://www.tianditu.gov.cn'  target='_blank'>https://www.tianditu.gov.cn </a>",    // 设置文本内容
    position: latlng,   // 设置文本经纬度
    offset: new T.Point(-9, 0)  // 设置文本标注偏移量
  });
  //创建地图文本对象
  map.addOverLay(label);
}

// 添加线
let setline = () => {
  // 保存点位经纬度
  let points = [];
  points.push(new T.LngLat(116.41136, 39.97569));
  points.push(new T.LngLat(116.411794, 39.9068));
  points.push(new T.LngLat(116.32969, 39.92940));
  points.push(new T.LngLat(116.385438, 39.90610));
  //创建线对象
  line = new T.Polyline(points);
  //向地图上添加线
  map.addOverLay(line);
}

//添加多边形
let setpolygon = () => {
  // 保存点位经纬度
  var points = [];
  points.push(new T.LngLat(116.41136, 39.97569));
  points.push(new T.LngLat(116.411794, 39.9068));
  points.push(new T.LngLat(116.32969, 39.92940));
  points.push(new T.LngLat(116.385438, 39.90610));
  //创建面对象
  polygon = new T.Polygon(points, {
    color: "blue",  // 线条颜色
    weight: 3,     // 线条宽度
    opacity: 0.5,  // 透明度
    fillColor: "#FFFFFF",  // 填充颜色
    fillOpacity: 0.5 // 填充颜色透明度
  });
  //向地图上添加面
  map.addOverLay(polygon);
}


// 添加一个带洞多边形
let setpolygonlon = () => {
  let points = [];
  points.push(new T.LngLat(116.315000, 39.964750));
  points.push(new T.LngLat(116.303330, 39.960810));
  points.push(new T.LngLat(116.306760, 39.866270));
  points.push(new T.LngLat(116.328740, 39.847560));
  points.push(new T.LngLat(116.366500, 39.855730));
  points.push(new T.LngLat(116.442380, 39.856520));
  points.push(new T.LngLat(116.455080, 39.865480));
  points.push(new T.LngLat(116.456110, 39.950020));
  points.push(new T.LngLat(116.428990, 39.967390));

  let points1 = [];
  points1.push(new T.LngLat(116.349330, 39.941590));
  points1.push(new T.LngLat(116.350620, 39.900650));
  points1.push(new T.LngLat(116.353110, 39.898670));
  points1.push(new T.LngLat(116.413880, 39.899990));
  points1.push(new T.LngLat(116.418340, 39.903150));
  points1.push(new T.LngLat(116.429330, 39.903940));
  points1.push(new T.LngLat(116.427270, 39.947910));
  points1.push(new T.LngLat(116.365810, 39.946600));
  //创建面对象
  let polygon = new T.Polygon([points, points1], {
    color: "black", weight: 3, opacity: 0.2, fillColor: "blue", fillOpacity: 0.5
  });
  //向地图上添加面
  map.addOverLay(polygon);
}

// 添加矩形
let addBound = () => {
  var bounds = new T.LngLatBounds(
    new T.LngLat(116.36231, 39.87784),
    new T.LngLat(116.43954, 39.92841)
  );
  // 创建一个矩形对象
  var rect = new T.Rectangle(bounds);
  // 将创建的矩形添加至地图中
  map.addOverLay(rect);
}


// 添加一个圆
let addcircle = () => {
  var circle = new T.Circle(new T.LngLat(116.40093, 39.90313),   // 中心点位
    5000,   // 半径
    {
      color: "blue",  // 线条颜色
      weight: 5,      // 线条宽度
      opacity: 0.5,   // 线条透明度
      fillColor: "#FFFFFF",   // 填充颜色
      fillOpacity: 0.5,   // 填充透明度
      lineStyle: "solid"  // 线条状态
    });
  //向地图上添加圆
  map.addOverLay(circle);
}


// 添加创口信息
let addinfoWin = () => {
  // 创建点位
  var lnglat = new T.LngLat(116.40969, 39.94940);
  //创建信息窗口对象
  var infoWin = new T.InfoWindow();
  infoWin.setLngLat(lnglat);
  //设置信息窗口要显示的内容
  infoWin.setContent("添加的信息窗口");
  //向地图上添加信息窗口
  map.addOverLay(infoWin);
}


// 设置自定义窗口信息
let setUserInfoWin = () => {
  
  // 创建点位
  var lnglat = new T.LngLat(116.40969, 39.94940);
  let infoWin = new T.InfoWindow();
  infoWin.setLngLat(lnglat);
  let sContent =
    "<div style='margin:0px;'>" +
    "<div style='margin:10px 10px; '>" +
    "<img style='float:left;margin:0px 10px' src='http://lbs.tianditu.gov.cn/images/logo.png' width='101' height='49' title='天安门'/>" +
    "<div style='margin:10px 0px 10px 120px;'>电话 : (010)88187700 <br>地址：北京市顺义区机场东路国门商务区地理信息产业园2号楼天地图大厦" +
    "</div>" +
    "<input  id='keyWord' value='机场' type='text' style='border: 1px solid #cccccc;width: 180px;height: 20px;line-height: 20px;padding-left: 10px;display: block;float: left;'>" +
    "<input style='margin-left:195px;  width: 80px;height: 24px; text-align: center; background: #5596de;color: #FFF;border: none;display: block;cursor: pointer;' type='button' value='周边搜索'  onClick=\"localsearch.searchNearby(document.getElementById('keyWord').value,center,radius)\">" +
    "</div>" +
    "</div>";
  infoWin.setContent(sContent);
    //向地图上添加信息窗口
  map.addOverLay(infoWin);
}



// 启用编辑线
let editLine = () =>{
  line.enableEdit()
}

// 禁用线段编辑
let disableLine = () => {
  line.disableEdit()
}

// 启用面编辑
let editpolygon = () => {
  polygon.enableEdit();
}

// 关闭面编辑
let disablepolygon = () => {
  polygon.disableEdit();
}


// 清除所有覆盖物
let clearAll = () => {
  map.clearOverLays()
}

// 开启点拖拽功能
let openMarker = () => {
  marker.enableDragging();
}


// 关闭点拖拽功能
let closeMarker = () => {
  marker.disableDragging();
}
</script>


<style lang="less" scoped>
.map {
  position: relative;
  width: 100%;
  height: 100%;

  #mapDiv {
    width: 100%;
    height: 100%;
  }

  .operate {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99999;
  }
}
</style>