
import * as Cesium from "cesium";
import {
  myObject,
  dataSourceList,
  timeObj,
  myProperty,
  cameraObj
} from './interfaceBox/interfaceList'
class editEntity {
  viewer: Cesium.Viewer
  dataSource: dataSourceList
  manListproperty: myProperty
  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer;
    // 统一管理实体资源
    this.dataSource = {};
    
    this.manListproperty = {};
  }

  // 处理自定义颜色
  setColor(color: string): Cesium.Color | '' {
    if (color) {
      return Cesium.Color.fromCssColorString(color);
    }
    return ''
  }
  // 添加点位基本信息
  addPoint(lat: number, lng: number, options: myObject = {}, dataSourceName: string) {
    if (!lat && !lng) {
      console.log("请上传点位的经纬度");
      return;
    }
    const viewer: Cesium.Viewer | Cesium.CustomDataSource = this.dataSource[dataSourceName] || this.viewer;
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(lat, lng),
      // id: id,
      // description: options.data,
      point: {
        pixelSize: options.point?.pixelSize || 30,
        color: this.setColor(options.point?.color) || Cesium.Color.RED,
        outlineColor:
          this.setColor(options.point?.outlineColor) || Cesium.Color.WHITE,
        outlineWidth: options.point?.outLineWidth || 2,
      },
      properties: {
        data: options.data,
      },
      label: this.getPointLabel(options.label),
      billboard: this.getBillboard(options.billboard),
    });
  }

  // 点位label
  getPointLabel(label: myObject): myObject {
    if (label && Object.keys(label).length) {
      return {
        text: label.text || "1111",
        font: label.font || "14pt monospace",
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: this.setColor(label.fillColor) || Cesium.Color.GOLD,
        outlineColor: this.setColor(label.outlineColor) || Cesium.Color.BLACK,
        outlineWidth: label.outlineWidth || 2,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(
          label.Offsetx || 0,
          label.Offsety || 0
        ),
      };
    } else {
      return {}
    }
  }

  // 点位图标
  getBillboard(billboard: myObject): myObject {
    console.log(billboard, 2222);
    if (billboard && Object.keys(billboard).length) {
      return {
        image: billboard.image || require("@/assets/cesium/location2.png"),
        scale: 2.0,
        width: billboard.width || 30, // 图标的宽度
        height: billboard.height || 30, // 图标的高度
        depthTest: false, // 禁用深度测试
        disableDepthTestDistance: Number.POSITIVE_INFINITY, // 禁用深度测试
        // 调整图标的位置
        pixelOffset: {
          x: billboard.Offsetx || 0,
          y: billboard.Offsety || 0,
        },
      };
    } else {
      return {}
    }
  }
  // 设置固定位置
  setFixedPosition(position: cameraObj){
    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(position.lng, position.lat),
      orientation: {
        heading: position.heading ? Cesium.Math.toRadians(position.heading) : undefined,
        pitch: position.pitch ? Cesium.Math.toRadians(position.pitch) : undefined,
        roll: 0.0
      }
    })
  }
  // 设置地图平滑移动
  setFlyTo(position:cameraObj) {
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(position.lng, position.lat),
      orientation: {
        heading: position.heading ? Cesium.Math.toRadians(position.heading) : undefined,  //水平视角
        pitch: position.pitch ? Cesium.Math.toRadians(position.pitch) : undefined,  // 俯仰角度
        roll: position.roll ? position.roll :  0.0 // 旋转角度
      },
      duration: position.duration ? position.duration : 5
    })
  }



  // 绘制线条
  addPolyline(lineList: number[][] = [], options: myObject = {}, dataSourceName: string) {
    if (lineList.length == 0) {
      console.log("请传递线条的经纬信息");
      return;
    }
    const viewer: Cesium.CustomDataSource | Cesium.Viewer = this.dataSource[dataSourceName] || this.viewer;
    viewer.entities.add({
      name: options.name || "Red line",
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray(lineList.flat()),
        width: options.width || 5,
        material: this.setColor(options.color) || Cesium.Color.RED,
      },
    });
  }

  // 绘制平面
  addPolygon(polygonList: number[] = [], options: myObject = {}, dataSourceName: string) {
    if (polygonList.length == 0) {
      console.log("请传递绘制平面的所有经纬信息");
      return;
    }
    const viewer: Cesium.CustomDataSource | Cesium.Viewer = this.dataSource[dataSourceName] || this.viewer;
    viewer.entities.add({
      name: options.name || "Blue polygon",
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArray(polygonList),
        material:
          this.setColor(options.color) || Cesium.Color.BLUE.withAlpha(0.5),
      },
    });
  }

  // 绘制轨迹回放功能
  linePlay(lineList: number[][] = [], timeSpace: number, options = {}, dataSourceName: string): timeObj | undefined {
    // 判断数据是否存在
    if (!lineList.length) {
      console.log("轨迹路线为必传项")
      return
    }
    // 判断数据源是否存在
    const viewer: Cesium.Viewer | Cesium.CustomDataSource = this.dataSource[dataSourceName] || this.viewer
    // 定义路径
    const property: Cesium.SampledPositionProperty = new Cesium.SampledPositionProperty()
    // 定义时间范围
    const startTime: Date = new Date()
    let stopTime: Date = startTime
    const startTimeStamp: number = startTime.getTime()

    // 先添加一条原有轨迹
    this.addPolyline(lineList, {}, 'ManageLine')

    // 添加每一个时间段的位置
    lineList.forEach((item, index) => {
      const time: Date = new Date(startTimeStamp + index * timeSpace * 1000)
      stopTime = time
      const position: Cesium.Cartesian3 = Cesium.Cartesian3.fromDegrees(item[0], item[1]);
      property.addSample(Cesium.JulianDate.fromDate(time), position);
    })

    // 使用插值算法 使得移动的时候平滑过渡
    property.setInterpolationOptions({
      interpolationDegree: 0.01,
      interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,
    });

    // 添加轨迹
    const entitidd: Cesium.Entity = viewer.entities.add({
      availability: new Cesium.TimeIntervalCollection([
        new Cesium.TimeInterval({
          start: Cesium.JulianDate.fromDate(startTime),
          stop: Cesium.JulianDate.fromDate(stopTime),
        }),
      ]),
      position: property,
      billboard: {
        image: require("@/assets/image/icon/videoPoint.png"),
        scale: 0.5,
        pixelOffset: new Cesium.Cartesian2(0, -20),
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
      path: {
        leadTime: 0,
        resolution: 1,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.1,
          color: Cesium.Color.GREEN,
        }),
        width: 30,
      },
    });

    return {
      startTime: startTime,
      stopTime: stopTime
    }
  }

  // 播放时间轴
  playclock(startTime: Date, stopTime: Date) {
    this.viewer.clock.currentTime = Cesium.JulianDate.fromDate(startTime) // 修改时间轴为当前时间
    this.viewer.clock.stopTime = Cesium.JulianDate.fromDate(stopTime);
    this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // 只执行一遍
    this.viewer.clock.shouldAnimate = true // 开始播放
  }

  // 点位移动
  pointMove(moveList: myObject[], dataSourceName?:string, timeSpace:number = 5, options?:myObject) {
    const viewer = dataSourceName ? this.dataSource[dataSourceName] : this.viewer;

    const startTime = new Date();
    const startTimeStamp = startTime.getTime();
    moveList.forEach((item) => {
      if (item.lng && item.lat) {
        const property = this.manListproperty[item.type + item.id]
          ? this.manListproperty[item.type + item.id]
          : new Cesium.SampledPositionProperty();
        const time = item.isFirst
          ? new Date(startTimeStamp)
          : new Date(startTimeStamp + timeSpace * 1000);
        const position = Cesium.Cartesian3.fromDegrees(item.lng, item.lat);
        property.addSample(Cesium.JulianDate.fromDate(time), position);

        console.log(property, 233333)
        // 设置插值算法
        if (
          property &&
          property.interpolationAlgorithm !==
          Cesium.LagrangePolynomialApproximation &&
          property._property._times.length >= 2
        ) {
          // 插值算法
          property.setInterpolationOptions({
            interpolationDegree: 0.01,
            interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,
          });
        }

        // 添加实体
        if (!this.manListproperty[item.type + item.id]) {
          this.manListproperty[item.type + item.id] = property;

          viewer.entities.add({
            properties: {
              data: item,
            },
            id: item.type + item.id,
            position: new Cesium.CallbackProperty(() => {
              // 获取实时位置
              // 当前时间数据
              const timeposition = Cesium.JulianDate.fromDate(new Date());
              // 将位置转换成为经纬度
              if (property.getValue(timeposition)) {
                const Cartographic = Cesium.Cartographic.fromCartesian(
                  property.getValue(timeposition),
                  this.viewer.scene.globe.ellipsoid
                );
                // Cartographic 获取的为度数，还需要将度数转换成为经纬度
                const lng:number = Cesium.Math.toDegrees(Cartographic.longitude);
                const lat:number = Cesium.Math.toDegrees(Cartographic.latitude);
                const entity: Cesium.Entity | undefined = this.getEntity(item.type, item.type + item.id);
                //自定义弹窗跟随移动
                if (entity && entity.properties && entity.properties.billboardObj) {
                  entity.properties.billboardObj.updataPosition({ lat, lng })
                  entity.properties.billboarduser.updataPosition({ lat, lng })
                  entity.properties.billboardObj.updateBillboardLocation();
                  entity.properties.billboarduser.updateBillboardLocation()
                }

                // 判断点位是否需要计算周边摄像头位置信息
                return property.getValue(timeposition);
              }
            }, false),
            label: this.getPointLabel(options?.label),
            billboard: this.getBillboard(options?.billboard),
          });
        }
      }
    });
  }
  
  // 实体的统一管理
  // 统一管理数据源数据
  creatDataSource(dataSourceName: string): void {
    if (this.dataSource[dataSourceName]) {
      console.log("该数据源名称已存在");
      return;
    }
    this.dataSource[dataSourceName] = new Cesium.CustomDataSource(
      dataSourceName
    );
    this.viewer.dataSources.add(this.dataSource[dataSourceName]);
  }


  // 从数据源数据中移除指定 实体（Entity）
  removeEntity(dataSourceName: string, entity: Cesium.Entity) {
    this.dataSource[dataSourceName].entities.remove(entity);
  }

  // 通过实体（entity）的id查询到对应实体
  getEntity(dataSourceName: string, id: string) {
    return this.dataSource[dataSourceName].entities.getById(id);
  }

  // 数据源中的所有实体
  getEntityList(dataSourceName: string) {
    return this.dataSource[dataSourceName].entities.values;
  }

  // 控制数据源中的实体的显示与隐藏
  isShowDataSource(dataSourceName: string, isShow: boolean) {
    this.getEntityList(dataSourceName).forEach((entity) => {
      entity.show = isShow;
    });
  }

  // 删除数据源中的所有实体
  removeAllEntity(dataSourceName: string) {
    this.dataSource[dataSourceName].entities.removeAll();
  }

}

export default editEntity