
import * as Cesium from "cesium";

// cesium 的基本配置
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
  [key: string]: any
}
//  实体对象类型
interface entitiesObj {
  [key: string]: Cesium.EntityCollection
}
// 点位配置
interface pointObj {
  pixelSize?: number,  // 像素大小
  color?: string, // 颜色
  outlineColor?: string, //  轮廓颜色
  outlineWidth?: number, // 轮廓宽度
  scaleByDistance?: Cesium.NearFarScalar //  根据距离缩放大小
  heightReference?: Cesium.HeightReference,
  disableDepthTestDistance?: number, // 无限远，不进行深度测试
  distanceDisplayCondition?: Cesium.DistanceDisplayCondition, // 在 0 到 100000 米范围内显示
  show?: boolean,
  translucencyByDistance?: Cesium.NearFarScalar, // 距离小于 150 米时完全透明，大于 15000 米时完全不透明
  height?: number, // 指定点的高度
  scale?: number, // 指定点的缩放比例
  image?: string, // 指定点的图像
  entitiesName?: string,  // 添加到指定图层
}
interface myObject{
  [key:string]: any
}

interface myProperty{
  [key:string]: Cesium.SampledPositionProperty
}
// 用于传递坐标位置
interface position {
  x:number,
  y:number,
  z:number
}
interface pointFace{
  lat: number,
  lng:number,
  data?: myObject,
  type?: string,
  imageitem?: File,
  callback?: (option: myObject) => void
}

interface dataSourceList{
  [key:string]: Cesium.CustomDataSource
}

interface timeObj{
  startTime: Date,
  stopTime: Date
}
export {
  Options,
  entitiesObj,
  myObject,
  pointFace,
  pointObj,
  position,
  dataSourceList,
  timeObj,
  myProperty
}