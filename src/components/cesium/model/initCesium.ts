import * as Cesium from "cesium";
import point from "./point";
import "cesium/Build/CesiumUnminified/Widgets/widgets.css";
import * as cesium from "cesium";
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MzgwYjJjNy1jY2EyLTQzMWQtYTU4NS1mN2JkMDBiMDY0OTkiLCJpZCI6MTgxOTA3LCJpYXQiOjE3MDE0MTU0NzN9.a2wL9Yz-cEomJ7aCjJo_5WlcE5oiQyOepObHkEYyeWw";

interface Options {
  animation?: boolean; // 控制动画小部件的显示隐藏
  infoBox?: boolean; // 不展示选中实体的时候展示选中的功能
  baseLayerPicker?: boolean;
  fullscreenButton?: boolean;
  vrButton?: boolean;
  geocoder?: boolean | Array<Cesium.GeocoderService>;
  homeButton?: boolean;
  sceneModePicker?: boolean;
  selectionIndicator?: boolean;
  timeline?: boolean;
  navigationHelpButton?: boolean;
  navigationInstructionsInitiallyVisible?: boolean;
  scene3DOnly?: boolean;
  shouldAnimate?: boolean;
  useDefaultRenderLoop?: boolean;
  targetFrameRate?: number;
  showRenderLoopErrors?: boolean;
  useBrowserRecommendedResolution?: boolean;
  automaticallyTrackDataSourceClocks?: boolean;
}
const subdomains: string[] = ["0", "1", "2", "3", "4", "5", "6", "7"];

class initCesium {
  viewer: Cesium.Viewer;
  boxName: string;
  options: Options;
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

  // 在
  // cesium 点位打点
  addPoint() {}

  // 创建绘制面板
}

export default initCesium;
