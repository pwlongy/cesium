import * as Cesium from "cesium";
import * as turf from '@turf/turf'

interface option{
  steps?: number,
  units?: 'degrees' | 'radians' | 'miles' | 'kilometers' | 'meters' | 'inches' | 'feet' | 'yards',
  properties?: {
    [key:string]: any
  }
}
class radar{
  viewer: Cesium.Viewer
  position: {lat: number, lng:number}
  radius:number
  constructor(viewer:Cesium.Viewer, lng: number, lat:number, radius:number){
    this.viewer = viewer
    this.position = {
      lng,
      lat
    }
    this.radius = radius

    this.init()
  }

  init() {
    // 获取圆形多边形点位数组
    const center = [this.position.lng, this.position.lat];
    const radius = this.radius;
    const options:option = { steps: 360, units: "kilometers", properties: { foo: "bar" } };

    var circle = turf.circle(center, radius, options);

    // 获取点位列表
    turf.getCoords(circle);
  }
}