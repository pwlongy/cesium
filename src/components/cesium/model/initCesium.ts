import * as Cesium from "cesium";
import point from './point'
import 'cesium/Build/CesiumUnminified/Widgets/widgets.css'
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MzgwYjJjNy1jY2EyLTQzMWQtYTU4NS1mN2JkMDBiMDY0OTkiLCJpZCI6MTgxOTA3LCJpYXQiOjE3MDE0MTU0NzN9.a2wL9Yz-cEomJ7aCjJo_5WlcE5oiQyOepObHkEYyeWw";

interface Options {
  boxName: string;
}
class initCesium {
  boxName: string;
  Viewer: Cesium.Viewer | null;
  constructor(options: Options) {
    // 选项中boxname为必填项目
    if (!options.boxName) {
      console.log("boxName 为必填字段");
      return;
    }
    this.boxName = options.boxName;
    this.Viewer = null;
    // 初始化地图
    this.initMap();
  }
  //  初始化地图
  initMap(): void {
    this.Viewer = new Cesium.Viewer(this.boxName, {
      infoBox: false
    });
  }
  // cesium 点位打点
  addPoint(){

  }

  // 创建绘制面板

}

export default initCesium;
