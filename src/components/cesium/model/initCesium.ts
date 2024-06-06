import * as Cesium from "cesium";
import {getuuid} from '@/utils/common/common'
console.log(getuuid())

import "cesium/Build/CesiumUnminified/Widgets/widgets.css";
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MzgwYjJjNy1jY2EyLTQzMWQtYTU4NS1mN2JkMDBiMDY0OTkiLCJpZCI6MTgxOTA3LCJpYXQiOjE3MDE0MTU0NzN9.a2wL9Yz-cEomJ7aCjJo_5WlcE5oiQyOepObHkEYyeWw";

import {
  Options,
  entitiesObj,
  myObject,
  pointFace,
  pointObj
} from './interfaceBox/interfaceList'
const subdomains: string[] = ["0", "1", "2", "3", "4", "5", "6", "7"];

class initCesium {
  viewer: Cesium.Viewer;
  boxName: string;
  options: Options;
  entitiesObj: entitiesObj
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
          "c9ad47bbc7e1f8dc4b84533ad2f6dbc5",
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
          "c9ad47bbc7e1f8dc4b84533ad2f6dbc5",
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
    this.setCamerPosition()
    // 在windows中挂载获取摄像头视角信息方法
    window.getCameraMessage = ():void => {
      this.getCameraPosition()
      console.log(123456)
    }
  }

  // 实体点击事件
  bindClick():void {
    // 创建 ScreenSpaceEventHandler 对象
    const handler:Cesium.ScreenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
        this.viewer.scene.canvas
    );
    // 绑定鼠标点击事件
    handler.setInputAction((e:Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
      // 获取点击的经纬度
      const position = this.viewer.scene.pickPosition(e.position);
      if (Cesium.defined(position)) {
        const cartographic:Cesium.Cartographic = Cesium.Cartographic.fromCartesian(position);
        // console.log(cartographic);
        const longitude:number = Cesium.Math.toDegrees(cartographic.longitude);
        const latitude:number = Cesium.Math.toDegrees(cartographic.latitude);
        console.log("Clicked at: " + longitude + ", " + latitude);
        console.log(new Cesium.Cartesian2(longitude, latitude));
      }
      const pick = this.viewer.scene.pick(e.position);
      if (pick && pick.id) {
        // 存储点击信息
        // this.tempData = pick.id._properties?._data?._value;
        // console.log(this.tempData);
        // 判断点击的实体是否为视频点位
        if (pick.id._id.indexOf("video") >= 0) {
          // 弹出视频弹窗
          // this.$refs.detailDialog.show = true;
        } else if (pick.id._id.indexOf("work") >= 0) {
          // 判断点击的实体是否为特殊工作
          // this.$refs.workDetail.show = true;
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  // 获取相机位置
  getCameraPosition(){
    const camera = this.viewer.camera
    // 获取相机位置
    const cameraPosition = camera.positionWC
    // 获取相机方向
    const cameraDirection = camera.directionWC
    console.log(cameraPosition, cameraDirection)
  }

  // 设置摄像机位置
  setCamerPosition(){
    this.viewer.camera.flyTo({
      destination: new Cesium.Cartesian3(-2392467.273773407, 5127363.765234839, 2935117.0106312386),
      orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-45.0),
      },
      duration: 10,
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
  addPoint(lng: number, lat: number, options: pointObj):void {
    const point = this.viewer.entities.add({
      name: 'Point',
      position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
      point: {
        pixelSize: 10,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
        scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5), // 根据距离缩放大小
        disableDepthTestDistance: new Cesium.NearFarScalar(1.0, 1000.0, 1000000.0, 2000.0) // 在 1000.0 - 2000.0 距离范围内禁用深度测试
      }
    });
  }

  // cesium 点位打点
  // addPoint(entitiesName:string, pointObj:pointFace):void {
  //
  //   // 如果经度纬度不在直接不往下执行
  //   if (!pointObj.lng || !pointObj.lat) {
  //     console.log("点位经纬度数据为必选项")
  //     return
  //   }
  //
  //   const img_path:File = require("@/assets/cesium/location2.png");
  //   const image:File = pointObj.imageitem ? pointObj.imageitem : img_path;
  //   // 添加点位信息
  //   const id = (pointObj.type === "man" && pointObj.data) ? pointObj.data.id : getuuid();
  //   const position:Cesium.Cartesian3 = Cesium.Cartesian3.fromDegrees(
  //       pointObj.lng,
  //       pointObj.lat,
  //       10
  //   );
  //
  //   // console.log(position);
  //   // 添加基本信息
  //   const entity:Cesium.Entity = new Cesium.Entity({
  //     position: position,
  //     id: pointObj.type ? pointObj.type + id : id,
  //     name: "iconbuild" + id,
  //     properties: { data : pointObj.data ? pointObj.data : "" },
  //     point: {
  //       pixelSize: 30, //点的大小
  //       color: Cesium.Color.RED.withAlpha(0), //点的颜色
  //       outlineWidth: 0, //边框宽度
  //       outlineColor: Cesium.Color.WHITE.withAlpha(0), //边框颜色
  //     },
  //     billboard: {
  //       image: image,
  //       scale: 1.0,
  //       width: 30, // 图标的宽度
  //       height: 30, // 图标的高度
  //       depthTest: false, // 禁用深度测试
  //       disableDepthTestDistance: Number.POSITIVE_INFINITY, // 禁用深度测试
  //       // 调整图标的位置
  //       pixelOffset: new Cesium.Cartesian2(0,0),
  //     },
  //
  //     // label: {
  //     //   text: data.emp_name ? data.emp_name : "",
  //     //   font: "32px",
  //     //   // scale: 0.5,
  //     //   showBackground: true, //是否显示背景颜色
  //     //   backgroundPadding: new Cesium.Cartesian2(10, 5),
  //     //   pixelOffset: new Cesium.Cartesian2(0, -30), // 调整文本位置偏移
  //     //   horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // 水平对齐方式
  //     //   verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 垂直对齐方式
  //     //   fillColor: Cesium.Color.BLACK, // 文本填充颜色
  //     //   backgroundColor: Cesium.Color.WHITE, // 背景颜色
  //     //   outlineWidth: 1.0,
  //     //   // style: Cesium.LabelStyle.FILL_AND_OUTLINE,
  //     //   depthTest: false,
  //     //   disableDepthTestDistance: Number.POSITIVE_INFINITY, // 层级无限大，可以让其他实体无法遮挡
  //     //   show: Boolean(data.emp_name), // 是否显示
  //     // },
  //   });
  //   this.entitiesObj[entitiesName].add(entity);
  //   // callback({ entityId: type + id, type: type, ...data });
  // }

  // 创建绘制面板
}

export default initCesium;
