import * as Cesium from "cesium";
import point from './point'
import 'cesium/Build/CesiumUnminified/Widgets/widgets.css'
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MzgwYjJjNy1jY2EyLTQzMWQtYTU4NS1mN2JkMDBiMDY0OTkiLCJpZCI6MTgxOTA3LCJpYXQiOjE3MDE0MTU0NzN9.a2wL9Yz-cEomJ7aCjJo_5WlcE5oiQyOepObHkEYyeWw";

interface Options {
  animation?: boolean, // 控制动画小部件的显示隐藏
  infoBox?: boolean, // 不展示选中实体的时候展示选中的功能
  baseLayerPicker?:boolean,
  fullscreenButton?:boolean,
  vrButton?:boolean,
  geocoder?:boolean | Array<Cesium.GeocoderService>,
  homeButton?: boolean,
  sceneModePicker?: boolean,
  selectionIndicator?: boolean,
  timeline?: boolean,
  navigationHelpButton?: boolean,
  navigationInstructionsInitiallyVisible?: boolean,
  scene3DOnly?: boolean,
  shouldAnimate?: boolean,
  useDefaultRenderLoop? : boolean,
  targetFrameRate?: number,
  showRenderLoopErrors?: boolean,
  useBrowserRecommendedResolution?: boolean,
  automaticallyTrackDataSourceClocks?: boolean,
}
class initCesium {
  Viewer: Cesium.Viewer | null;
  boxName:string
  options: Options
  constructor(boxName: string, options: Options = {}) {
    // 选项中boxname为必填项目
    if (!boxName) {
      console.log("boxName 为必填字段");
      return;
    }
    this.boxName = boxName;
    this.options = {
      infoBox: false,  //信息框
      animation: false, //动画小部件
      baseLayerPicker: false, //地图图层组件
      fullscreenButton: false, //全屏组件
      vrButton: false,
      geocoder: false,    // 搜索
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
    }
    
    this.Viewer = null;
    // 初始化地图
    this.initMap();
  }
  //  初始化地图          
  initMap(): void {
    this.Viewer = new Cesium.Viewer(this.boxName, this.options);
    console.log(this.Viewer)
    // this.Viewer._cesiumWidget._creditContainer.style.display = 'none'
  }
  // cesium 点位打点
  addPoint(){

  }

  // 创建绘制面板

}

export default initCesium;
