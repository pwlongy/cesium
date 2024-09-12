import * as Cesium from "cesium";

import "cesium/Build/CesiumUnminified/Widgets/widgets.css";
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MzgwYjJjNy1jY2EyLTQzMWQtYTU4NS1mN2JkMDBiMDY0OTkiLCJpZCI6MTgxOTA3LCJpYXQiOjE3MDE0MTU0NzN9.a2wL9Yz-cEomJ7aCjJo_5WlcE5oiQyOepObHkEYyeWw";
import  EditEntity from './editEntity'
import {
  Options,
  entitiesObj,
  myObject,
  pointFace,
  pointObj,
  position
} from './interfaceBox/interfaceList'
const subdomains: string[] = ["0", "1", "2", "3", "4", "5", "6", "7"];

class initCesium {

  static EditEntity = EditEntity

  viewer: Cesium.Viewer;
  boxName: string;
  options: Options;
  entitiesObj: entitiesObj
  pointClick: ((data: myObject) => void) | null
  constructor(boxName: string, options: Options) {
    // 选项中boxname为必填项目
    if (!boxName) {
      console.log("boxName 为必填字段");
      return;
    }
    this.boxName = boxName;
    this.options = {
      infoBox: false, //信息框
      animation: false, //动画小部件
      baseLayerPicker: false, //地图图层组件
      fullscreenButton: false, //全屏组件
      vrButton: false,
      geocoder: false, // 搜索
      homeButton: false, //首页组件
      sceneModePicker: false, //场景模式
      selectionIndicator: false, //场景模式
      timeline: false, // 时间轴
      navigationHelpButton: false, //场景模式
      navigationInstructionsInitiallyVisible: false,
      scene3DOnly: false,
      shouldAnimate: false,
      useDefaultRenderLoop: true,
      showRenderLoopErrors: false,
      automaticallyTrackDataSourceClocks: false,
      ...options,
    };
    // 用于保存实体集合对象的列表
    this.entitiesObj = {}
    this.pointClick = null
    // 初始化地图
    this.initMap();
  }
  //  初始化地图
  initMap(): void {
    this.viewer = new Cesium.Viewer(this.boxName, this.options);
    // 加载影像地图
    this.viewer.imageryLayers.addImageryProvider(
      new Cesium.WebMapTileServiceImageryProvider({
        url:
          "http://t{s}.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=" +
          "38ff10ec6e54ac30476a21a6bbf61fe4",
        subdomains: subdomains,
        layer: "tdtImgLayer",
        style: "default",
        format: "image/jpeg",
        maximumLevel: 18,
        tileMatrixSetID: "GoogleMapsCompatible", // 使用谷歌的瓦片切片方式
        // show: true,
      })
    );
    // 加载矢量底图
    this.viewer.imageryLayers.addImageryProvider(
      new Cesium.WebMapTileServiceImageryProvider({
        // 影像注记
        url:
          "http://t{s}.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=" +
          "38ff10ec6e54ac30476a21a6bbf61fe4",
        subdomains: subdomains,
        layer: "tdtCiaLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
        // show: true,
      })
    );

    // 添加点击事件
    this.bindClick()
    this.setCamerPosition({x: -2392480.60956927, y: 5127431.693189062, z: 2934902.146746033}, {x: -2392609.893707916, y: 5127106.880787394, z: 2934661.692260771})
    // 在windows中挂载获取摄像头视角信息方法
    window.getCameraMessage = ():void => {
      this.getCameraPosition()
    }
  }
  // 设置点击实体执行的方法
  setPointClick(callBack:(data: myObject) => void):void {
    this.pointClick = callBack
  }
  // 实体点击事件
  bindClick():void {
    // 创建 ScreenSpaceEventHandler 对象
    const handler:Cesium.ScreenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
        this.viewer.scene.canvas
    );
    // 绑定鼠标点击事件
    handler.setInputAction((e:Cesium.ScreenSpaceEventHandler.PositionedEvent):void => {
      // 获取点击的经纬度
      const position = this.viewer.scene.pickPosition(e.position);
      if (Cesium.defined(position)) {
        const cartographic:Cesium.Cartographic = Cesium.Cartographic.fromCartesian(position);
        // console.log(cartographic);
        const longitude:number = Cesium.Math.toDegrees(cartographic.longitude);
        const latitude:number = Cesium.Math.toDegrees(cartographic.latitude);
        console.log("Clicked at: " + longitude + ", " + latitude);
      }
      const pick = this.viewer.scene.pick(e.position);
      if (pick && pick.id) {
        if (typeof (this.pointClick) === 'function') {
          // 将点位信息发送给自定义方法中
          this.pointClick(pick.id.properties?.data._value.data);
        }
        // 存储点击信息
        // this.tempData = pick.id._properties?._data?._value;
        // console.log(this.tempData);
        // 判断点击的实体是否为视频点位
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK); 
  }

  // 获取相机位置
  getCameraPosition(){
    const camera:Cesium.Camera = this.viewer.camera
    // 获取相机位置
    const cameraPosition:Cesium.Cartesian3 = camera.positionWC
    // 获取相机方向
    const cameraDirection:Cesium.Cartesian3 = camera.directionWC
    console.log(cameraPosition, cameraDirection)
  }

  // 设置摄像机位置
  setCamerPosition(newCurrentPosition:position, newCurrentDirection:position):void{
    const currentPosition:Cesium.Cartesian3 = new Cesium.Cartesian3(newCurrentPosition.x, newCurrentPosition.y, newCurrentPosition.z)
    const currentDirection:Cesium.Cartesian3 = new Cesium.Cartesian3(newCurrentDirection.x, newCurrentDirection.y, newCurrentDirection.z)
    const targetPosition :Cesium.Cartesian3 = Cesium.Cartesian3.add(currentPosition, currentDirection, new Cesium.Cartesian3());
    this.viewer.camera.flyTo({
      destination: currentPosition ,
      orientation: {
        heading: Cesium.Math.toRadians(0.0), // 方向
        pitch: Cesium.Math.toRadians(-45.0), // 倾斜角
        roll : 0  //  // 翻滚角
      },
      duration: 3, // 时间
    });
  }
  // 添加指定集合列表
  setEntitiesObj(entitiesName: string):void{
    this.entitiesObj[entitiesName] = new Cesium.EntityCollection();
    this.viewer.entities.add(this.entitiesObj[entitiesName])
  }
  // 清除指定集合列表
  clearEntitiesObj(entitiesName:string):void {
    this.entitiesObj[entitiesName].removeAll()
  }
  // 清除所有集合中的数据
  clearAllEntitiesObj():void{
    for(const key in Object.keys(this.entitiesObj)){
      this.entitiesObj[key].removeAll()
    }
  }

  // 添加点位
  /*
  *
  * */
  addPoint(lng: number, lat: number, options: pointObj = {}):void {
    // 判断是否添加到指定集合列表中
    const point:Cesium.Entity = this.viewer.entities.add({
      name: 'Point',
      position: Cesium.Cartesian3.fromDegrees(lng, lat),
      point: {
        pixelSize: options.pixelSize ? options.pixelSize :10,
        color: options.color ? Cesium.Color.fromCssColorString(options.color) :Cesium.Color.RED,
        outlineColor: options.outlineColor ? Cesium.Color.fromCssColorString(options.outlineColor) : Cesium.Color.WHITE,
        outlineWidth: options.outlineWidth ? options.outlineWidth : 0,
        scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5), // 根据距离缩放大小
        disableDepthTestDistance:Number.POSITIVE_INFINITY // 在 1000.0 - 2000.0 距离范围内禁用深度测试
      },
      label: {
        text: '何须问',
        font: '12px Arial', // 标签字体
        fillColor: Cesium.Color.YELLOW, // 标签填充颜色
        outlineColor: Cesium.Color.BLACK, // 标签边框颜色
        outlineWidth: 0, // 标签边框宽度
        style: Cesium.LabelStyle.FILL_AND_OUTLINE, // 标签样式
        pixelOffset: new Cesium.Cartesian2(0, -20) // 标签偏移量
      }

    });
  }

}

export default initCesium;
