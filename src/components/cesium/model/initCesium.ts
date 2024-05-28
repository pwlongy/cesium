import * as Cesium from "cesium";
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
      infoBox: false, 
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      vrButton: false,
      geocode: false,
      homeButton: false,
      sceneModePicker: false,
      ...options,
    }
    
    this.Viewer = null;
    // 初始化地图
    this.initMap();
  }
  //  初始化地图          
  initMap(): void {
    this.Viewer = new Cesium.Viewer(this.boxName, this.options); 
  }
}

export default initCesium;
