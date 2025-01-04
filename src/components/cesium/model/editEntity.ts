
import * as Cesium from "cesium";
import {
  myObject,
  dataSourceList,
  timeObj,
  myProperty,
  cameraObj, modelPosition
} from './interfaceBox/interfaceList'
class editEntity {
  viewer: Cesium.Viewer
  dataSource: dataSourceList
  manListproperty: myProperty
  ObjPrimitives: myObject
  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer;
    // 统一管理实体资源
    this.dataSource = {};
    
    this.manListproperty = {};
    // 管理图元数据
    this.ObjPrimitives = {}
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
      point: this.getPoint(options.point),
      properties: {
        
        data: options.data,
      },
      label: this.getPointLabel(options.label),
      billboard: this.getBillboard(options.billboard),
    });
  }
  // 点位配置
  getPoint(point: myObject):myObject {
    if(point && Object.keys(point)){
      return {
        pixelSize: point.pixelSize || 30, // 点位大小
        color: this.setColor(point.color) || Cesium.Color.RED, // 颜色
        outlineColor:
          this.setColor(point.outlineColor) || Cesium.Color.WHITE, // 外边框颜色
        outlineWidth: point.outLineWidth || 2, // 外边框宽度
      }
    }else {
      return {}
    }
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
    if (billboard && Object.keys(billboard).length) {
      return {
        image: billboard.image || require("@/assets/cesium/location2.png"),
        scale: 2.0,
        sizeInMeters: false, // 随着地图的方法而放大，缩小而缩小
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
        width: options.width || 1,
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

  // 绘制路劲回放
  linePlay(lineList: number[][] = [], timeSpace: number, options:myObject = {}, dataSourceName: string): timeObj | undefined {
    // 判断数据是否存在
    if (!lineList.length) {
      console.log("路径路线为必传项")
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

    // 先添加一条原有路径
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
      interpolationDegree: 0.001,
      interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,
    });

    // 添加路径
    const entitidd: Cesium.Entity = viewer.entities.add({
      availability: new Cesium.TimeIntervalCollection([
        new Cesium.TimeInterval({
          start: Cesium.JulianDate.fromDate(startTime),
          stop: Cesium.JulianDate.fromDate(stopTime),
        }),
      ]),
      model: this.getModel(options.modelObj),
      // 朝向
      orientation: new Cesium.VelocityOrientationProperty(property),
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
        width: 5,
      },
    });

    // 镜头是否需要跟随目标移动
    // this.viewer.trackedEntity = entitidd

    return {
      startTime: startTime,
      stopTime: stopTime,
      entitidd: entitidd
    }
  }




  // 添加点位图元集合
  addPointPrimitives(position:modelPosition, params:myObject ) {
    const points = this.viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection())
    points.add({
      position: Cesium.Cartesian3.fromDegrees(position.lng, position.lat, position.height || 0), // 经纬度信息
      color: this.setColor(params.color || 'blue'), // 点位颜色
      outlineColor: this.setColor(params.outlineColor || 'red'), // 外边框颜色
      outlineWidth: params.outlineWidth || 5,
      pixelSize: params.pixelSize || 10, // 设置点的大小
    })
    return points
  }

  // 添加平面的图元集合
  addPolygonPrimitives(positionList: number[],) {
    // 添加平面数据
    let instance = new Cesium.GeometryInstance({  // 图元对象
      geometry : new Cesium.PolygonGeometry({  // 平面图元
        polygonHierarchy : new Cesium.PolygonHierarchy(
            Cesium.Cartesian3.fromDegreesArray(positionList)
        )
      })
    });
    this.viewer.scene.primitives.add(new Cesium.Primitive({
      geometryInstances : instance,
      appearance : new Cesium.EllipsoidSurfaceAppearance({
        material : new Cesium.Material({  // 材质
          // 颜色填充
          // fabric : {
          //   type : 'Color',
          //   uniforms : {
          //     color : new Cesium.Color(1.0, 1.0, 0.0, 1.0)
          //   }
          // }
          // 图片填充
          fabric : {
            type : 'Image',
            uniforms : {
              image: "/data/cesiumImage/Materials/waterNormals.jpg",
              repeat: new Cesium.Cartesian2(10, 10)
            }
          }
        })
      })
    }));
  }

  // 添加贴底线
  addStickGround(positionList?: number[], paramsObj?: myObject ) {
    // 使用GroundPrimitive 完成贴地线的操作

    let instance = new Cesium.GeometryInstance({
      geometry : new Cesium.GroundPolylineGeometry({
        positions : Cesium.Cartesian3.fromDegreesArray([
          115.11221108836832, 27.081318249016455,
          115.21221108836832, 27.181318249016455,
          115.31221108836832, 27.281318249016455,
          115.41221108836832, 27.381318249016455,
          115.51221108836832, 27.481318249016455,
          115.61221108836832, 27.581318249016455,
          115.71221108836832, 27.681318249016455,
          115.81221108836832, 27.781318249016455,
          115.91221108836832, 27.881318249016455,
          115.93122110883632, 27.981318249016455,
          115.94122110883682, 27.10235681318249016455,
        ]),
        width : 4.0
      }),
      // attributes : {
      //   color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString('green').withAlpha(0.7)),
      //   distanceDisplayCondition : new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(1000, 30000)
      // },
    });


    this.viewer.scene.groundPrimitives.add(new Cesium.GroundPolylinePrimitive({
      geometryInstances : instance,
      appearance : new Cesium.PolylineMaterialAppearance({
        material : Cesium.Material.fromType('Color' , {
          color: this.setColor('red')
        })
      })
    }));
  }

  // 绘制动态水面
  addWater(positionList: number[]) {
    // 添加平面数据
    let instance = new Cesium.GeometryInstance({  // 图元对象
      geometry : new Cesium.PolygonGeometry({  // 平面图元
        polygonHierarchy : new Cesium.PolygonHierarchy(
            Cesium.Cartesian3.fromDegreesArray(positionList)
        )
      })
    });
    this.viewer.scene.primitives.add(new Cesium.Primitive({
      geometryInstances : instance,
      appearance : new Cesium.EllipsoidSurfaceAppearance({
        material : new Cesium.Material({  // 材质
          // 配置材料
          fabric : {
            type : 'Water',
            uniforms : {
              normalMap : "/data/cesiumImage/Materials/waterNormals.jpg", // 动态水面的法线图片
              frequency: 200, // 水波纹的数量
              animationSpeed: 0.001, // 水流速度
              amplitude: 10, // 水波纹震幅
              specularIntensity: 20, // 镜面反射强度
            }
          }
        })
      })
    }));
  }

  // 绘制等高线
  addContour() {
    // 设置等高线材质
    let material = new Cesium.Material({
      fabric : {
        type : 'ElevationContour',
        uniforms : {
          color : this.setColor("red"), // 颜色
          spacing: 50, // 等高线间距
          width: 2, // 等高线宽度
        }
      }
    });

    // 为地形数据添加等高线
    this.viewer.scene.globe.material = material
  }

  // 加载地形文件数据
  async addTerrainData(urlPath: string) {
    // 1.107版本之后推荐使用fromUrl
    const terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(
        urlPath, {
          requestWaterMask: true,
          requestVertexNormals: true,
        }
    );

    this.viewer.terrainProvider = terrainProvider;

    // 获取地形高度
    // 将数据信息转换成为弧度
    let pos1 = Cesium.Cartographic.fromDegrees(115.61221108836832, 27.881318249016455)
    let pos2 = Cesium.Cartographic.fromDegrees(115.81221108836832, 28.881318249016455)
    // 位置信息必须使用弧度
    // 获取最精确的高度信息
    Cesium.sampleTerrainMostDetailed(terrainProvider, [pos1, pos2]).then(res => {
      console.log(res, 99999)
    })

  }



  // 返回模型数据
  getModel(modelObj: myObject) {
    if(!Object.keys(modelObj).length) return {}
    
    return {
      url: modelObj.url || "/data/fly/scene.gltf",
      scale: modelObj.scale || 1,
      minimumPixelSize: modelObj.minimumPixelSize || 1000000,
      maximumScale: modelObj.maximumScale || 10000000
    }
  }

  // 播放时间轴
  playclock(startTime: Date, stopTime: Date, entity: Cesium.Entity) {
    this.viewer.clock.onTick.addEventListener(tick => {
      entity.position?.getValue(tick.currentTime)
    })


    this.viewer.clock.currentTime = Cesium.JulianDate.fromDate(startTime) // 修改时间轴为当前时间
    this.viewer.clock.stopTime = Cesium.JulianDate.fromDate(stopTime);
    this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // 只执行一遍
    this.viewer.clock.shouldAnimate = true // 开始播放
  }

  // 点位移动
  // pointMove(moveList: myObject[], dataSourceName?:string, timeSpace:number = 5, options?:myObject) {
  //   const viewer = dataSourceName ? this.dataSource[dataSourceName] : this.viewer;

  //   const startTime = new Date();
  //   const startTimeStamp = startTime.getTime();
  //   moveList.forEach((item) => {
  //     if (item.lng && item.lat) {
  //       const property = this.manListproperty[item.type + item.id]
  //         ? this.manListproperty[item.type + item.id]
  //         : new Cesium.SampledPositionProperty();
  //       const time = item.isFirst
  //         ? new Date(startTimeStamp)
  //         : new Date(startTimeStamp + timeSpace * 1000);
  //       const position = Cesium.Cartesian3.fromDegrees(item.lng, item.lat);
  //       property.addSample(Cesium.JulianDate.fromDate(time), position);

  //       console.log(property, 233333)
  //       // 设置插值算法
  //       if (
  //         property &&
  //         property.interpolationAlgorithm !==
  //         Cesium.LagrangePolynomialApproximation &&
  //         property._property._times.length >= 2
  //       ) {
  //         // 插值算法
  //         property.setInterpolationOptions({
  //           interpolationDegree: 0.01,
  //           interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,
  //         });
  //       }

  //       // 添加实体
  //       if (!this.manListproperty[item.type + item.id]) {
  //         this.manListproperty[item.type + item.id] = property;

  //         viewer.entities.add({
  //           properties: {
  //             data: item,
  //           },
  //           id: item.type + item.id,
  //           position: new Cesium.CallbackProperty(() => {
  //             // 获取实时位置
  //             // 当前时间数据
  //             const timeposition = Cesium.JulianDate.fromDate(new Date());
  //             const cartesian = property.getValue(timeposition)
  //             // 将位置转换成为经纬度
  //             if (cartesian) {
  //               const Cartographic = Cesium.Cartographic.fromCartesian(
  //                   cartesian,
  //                 this.viewer.scene.globe.ellipsoid
  //               );
  //               // Cartographic 获取的为度数，还需要将度数转换成为经纬度
  //               const lng:number = Cesium.Math.toDegrees(Cartographic.longitude);
  //               const lat:number = Cesium.Math.toDegrees(Cartographic.latitude);
  //               const entity: Cesium.Entity | undefined = this.getEntity(item.type, item.type + item.id);
  //               //自定义弹窗跟随移动
  //               if (entity && entity.properties && entity.properties.billboardObj) {
  //                 entity.properties.billboardObj.updataPosition({ lat, lng })
  //                 entity.properties.billboarduser.updataPosition({ lat, lng })
  //                 entity.properties.billboardObj.updateBillboardLocation();
  //                 entity.properties.billboarduser.updateBillboardLocation()
  //               }

  //               // 判断点位是否需要计算周边摄像头位置信息
  //               return property.getValue(timeposition);
  //             }
  //           }, false),
  //           label: this.getPointLabel(options?.label),
  //           billboard: this.getBillboard(options?.billboard),
  //         });
  //       }
  //     }
  //   });
  // }
  
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