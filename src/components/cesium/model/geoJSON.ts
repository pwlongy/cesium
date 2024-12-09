import * as Cesium from 'cesium'
// 加载GEOJSON数据
// cesium 支持 WGS84的地理数据， 其他投影坐标以及地理坐标不支持
interface json {
  [key:string]: any 
}

class GeoJSON{
  viewer: Cesium.Viewer
  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer
  }
  // 直接读取本地文件的方式获取数据
  setGEOJSON(json:json) {
    let promise = Cesium.GeoJsonDataSource.load(json)
    promise.then(res => {
      this.viewer.dataSources.add(res)
      res.entities.values.forEach(item => {
        console.log(item.polygon)
      })
      this.viewer.zoomTo(res)
    })
  }

  // 通过接口获取geoJSON数据
  // apiSetGEOJSON(){
  //    // 申明一个XMLHttpRequest
  //    var request = new XMLHttpRequest();
  //    // 设置请求方法与路径
  //    request.open("get", './data/hbeiprovince.json');
  //    // 不发送数据到服务器
  //    request.send(null);
  //    //XHR对象获取到返回信息后执行
  //    request.onload = function () {
  //        // 解析获取到的数据
  //        var data = JSON.parse(request.responseText);
        
  //        data.features.forEach(feature=>{
            
  //            feature.geometry.coordinates.forEach(coordinate=>{
  //                console.log(coordinate);
  //               this.Viewer.entities.add({
  //                name:"hbei",
  //               polygon:{
  //                hierarchy:{
  //                    positions:Cesium.Cartesian3.fromDegreesArray(coordinate.flat())
  //                },
  //                height:10000,
  //                extrudedHeight:20000,
  //                material:Cesium.Color.RED,
  //                outline:true,
  //                outlineColor:Cesium.Color.ORANGE
  //               }
  //            })
  //         })

  //         })

  //       }
  // }
}

export default GeoJSON