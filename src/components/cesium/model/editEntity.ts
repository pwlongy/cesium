
import * as Cesium from "cesium";
import * as dat from 'dat.gui';
import labelBillboard from './labelBillboard'
import {
  myObject,
  dataSourceList,
  timeObj,
  myProperty,
  cameraObj,
  modelPosition,
  Material,
  layers
} from './interfaceBox/interfaceList'
import * as cesium from "cesium";
class editEntity {
  viewer: Cesium.Viewer
  dataSource: dataSourceList
  manListproperty: myProperty
  ObjPrimitives: myObject
  labelBillboard: typeof labelBillboard
  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer;
    // 统一管理实体资源
    this.dataSource = {};
    
    this.manListproperty = {};
    // 管理图元数据
    this.ObjPrimitives = {}
    this.labelBillboard = labelBillboard
  }

  // 处理自定义颜色
  setColor(color: string): Cesium.Color {
    if (color) {
      return Cesium.Color.fromCssColorString(color);
    }
    // 设置默认传递的颜色为红色
    return cesium.Color.RED
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

  // 绘制晕眩图
  addDizzinessDiagram() {
    let material = new Cesium.Material({
      fabric: {
        type: 'ElevationRamp',
        uniforms: {
          image: '/data/color.png',
          minimumHeight: 0, // 最低高度
          maximumHeight: 500 // 最高高度
        }
      }
    })
    // 设置晕眩图
    this.viewer.scene.globe.material = material
  }

  // cesium 支持多种材质同时渲染
  addMultipleMaterial() {
    let material = new Cesium.Material({
      fabric: {
        type: "MultipleMaterial", // 因为使用的是多种材质，这里的类型名称需要自定义
        materials: {
          contourMaterial: { // 等高线材质(这里的内容（contourMaterial）可以自定名称)
            type : 'ElevationContour',
            uniforms : {
              color : this.setColor("red"), // 颜色
              spacing: 50, // 等高线间距
              width: 2, // 等高线宽度
            }
          },
          dizzinessDiagramMaterial: {// 眩晕图材质
            type: 'ElevationRamp',
            uniforms: {
              image: '/data/color.png',
              minimumHeight: 0, // 最低高度
              maximumHeight: 500 // 最高高度
            }
          }
        },
        components: {
          diffuse: "contourMaterial.alpha == 0.0 ? dizzinessDiagramMaterial.diffuse : contourMaterial.diffuse",
          alpha: "max(contourMaterial.alpha, dizzinessDiagramMaterial.alpha)"
        }
      },
      // translucent: false
    })

    this.viewer.scene.globe.material = material
  }


  // 设置自定义材质
  addCustomizeMaterial(listMaterial?: Material[][]) {
    // 默认值
    let layers = [
      {
        entries: [
          {
            height: 100,
            color: Cesium.Color.BLUE
          },
          {
            height: 200,
            color: Cesium.Color.GREEN
          }
        ]
      },
      {
        entries: [
          {
            height: 400,
            color: Cesium.Color.BLUE
          },
          {
            height: 500,
            color: Cesium.Color.ORANGE
          }
        ]
      },
    ]
    let listlayers:layers[] = []
    listMaterial?.forEach((item => {
      let entriesList:Material[] = []
      listlayers.push({
        entries: entriesList
      })
      item.forEach(obj => {
        entriesList.push({
          height: obj.height,
          color: obj.color
        })
      })
    }))

    let customizeMaterial =  Cesium.createElevationBandMaterial({
      scene: this.viewer.scene,
      layers: listlayers.length ? listlayers : layers
    })
    this.viewer.scene.globe.material = customizeMaterial
  }

  // 添加菜单选项
  addMenu() {
    let controlers = {
      height: 100,
      interal: 100,
      color1: "#FF0000",
      color2: "#00FF00"
    }
    const gui = new dat.GUI();
    let layers: layers[] = [
      {
        entries: [{
          color: Cesium.Color.RED,
          height: 100
        },{
          color: Cesium.Color.RED,
          height: 100
        }],
      }, {
        entries: [{
          color: Cesium.Color.RED,
          height: 100
        },{
          color: Cesium.Color.RED,
          height: 100
        }]
      }
    ]

    gui.domElement.style.cssText = "posation: absolute; top: 10px; right: 10px; height: 500px";
    const folder = gui.addFolder("菜单")
    // 展开菜单
    folder.open()
    // 添加参数对象
    const heightParams = folder.add(controlers, "height", 100, 1000)
    heightParams.onChange((res:number) => {
      layers[0].entries[0].height = res

      console.log(res)
    })
    const interalParams = folder.add(controlers, "interal", 100, 1000)
    interalParams.onChange((res:number) => {
      console.log(res)
    })
    const color1Params = folder.addColor(controlers, "color1")
    color1Params.onChange((res:string) => {
      console.log(res)
    })
    const color2Params = folder.addColor(controlers, "color2")
    color2Params.onChange((res:string) => {
      console.log(res)
    })
  }


  //  渲染白膜数据
  addBuffyCoat() {

  }

  // 世界矩阵
  computeModelMatrix(position:modelPosition):Cesium.Matrix4 {
    const center = Cesium.Cartesian3.fromDegrees(position.lng, position.lat, position.height)
    const matrix = Cesium.Transforms.eastNorthUpToFixedFrame(center)
    return matrix
  }

  // 模型矩阵
  computerEmitterModelMatrix():Cesium.Matrix4 {
    let hpr = Cesium.HeadingPitchRoll.fromDegrees(10,0,20) // 设置粒子的朝向，滚装， 俯仰
    let trs = new Cesium.TranslationRotationScale()
    trs.translation = Cesium.Cartesian3.fromElements(0,0,0)
    trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr)
    let result = Cesium.Matrix4.fromTranslationRotationScale(trs)
    return result
  }



  // 粒子系统，生成粒子效果
  addParticle() {
    let particle = new Cesium.ParticleSystem({
      image: '/OIP-C.png',
      startColor: this.setColor("red"),   // 开始颜色
      endColor: this.setColor("orange"),  // 结束颜色
      startScale: 1,   // 开始图片比例
      endScale: 5,      // 结束图片比例
      minimumParticleLife: 1.5, //粒子生命的可能持续时间的最小范围，在该范围内可以随机选择粒子的实际生命
      maximumParticleLife: 2,  // 粒子生命的可能持续时间的最大范围
      minimumSpeed: 29,  // 粒子的最小速度
      maximumSpeed: 30,   // 粒子的最大速度
      imageSize: new Cesium.Cartesian2(1,1), // 图片大小
      sizeInMeters: true, // 大小是否为米
      emissionRate: 100, // 每分钟生产多少粒子
      emitter: new Cesium.CircleEmitter(10), // 粒子发射器
      modelMatrix: this.computeModelMatrix({lng:-72.0, lat: 40, height: 4}), // 将粒子系统从模型转换为世界坐标的4x4转换矩阵。
      emitterModelMatrix: this.computerEmitterModelMatrix() // 粒子系统局部坐标系内转换粒子系统发射器的4x4转换矩阵。
    })
    this.viewer.scene.primitives.add(particle)

    // this.viewer.camera.setView({
    //   destination: Cesium.Cartesian3.fromDegrees(-72.0, 40, 500)
    // })
  }

  // 创建管线
  addPipeline() {

    function computeCircle(radius:number): Cesium.Cartesian2[] {
      let position = []
      for (let i = 0; i < 360; i++){
        let radians = Cesium.Math.toRadians(i) // 将角度转换成为弧度
        position.push(
            new Cesium.Cartesian2(
                radius * Math.cos(radians),
                radius* Math.sin(radians)
            )
        )
        i += 20
      }
      return position
    }

    // PolylineVolumeGeometry
    this.viewer.entities.add({
      polylineVolume: {
        positions: Cesium.Cartesian3.fromDegreesArray([
          115.01221108836832, 27.581318249016455,
          116.01221108836832, 28.581318249016455,
          116.01221108836832, 27.581318249016455,
        ]), // 管线点的位置
        shape: computeCircle(10), // 设置管线形状， 通过角度转换弧度的方式完成
        material: this.setColor("blue"), // 材质
        outline: true, // 外部边框线条
        outlineColor: this.setColor("red"), // 外部边框线条颜色
        outlineWidth: 2, // 线条宽度
        fill: true, // 是否需要材质填充体积
        cornerType: Cesium.CornerType.MITERED, // 设计拐角样式
      }
    })

  }

  // 当管线出现大量数据的时候，使用Primitive来实现管线的添加
  addPrimitivePipeline() {
    const positions = Cesium.Cartesian3.fromDegreesArray([
      115.01221108836832, 27.581318249016455,
      116.01221108836832, 28.581318249016455,
      116.01221108836832, 27.581318249016455,
    ])

    // 创建几何体
    const pipelineGeometry = new Cesium.PolylineGeometry({
      positions: positions,
      width: 10.0, // 管线宽度
      vertexFormat: Cesium.VertexFormat.POSITION_ONLY
    });

    // 创建外观
    const pipelineAppearance = new Cesium.PolylineMaterialAppearance({
      material: Cesium.Material.fromType('Color', {
        color: Cesium.Color.RED
      })
    });

    // 创建 Primitive
    const pipelinePrimitive = new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: pipelineGeometry
      }),
      appearance: pipelineAppearance,
      asynchronous: false
    });

    // 添加到场景
    this.viewer.scene.primitives.add(pipelinePrimitive);
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

  // 添加自定义广告牌
  setlabelBillboard(position: modelPosition, HtmlResult: Function | string) {
    return new labelBillboard(this.viewer, position, HtmlResult)
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