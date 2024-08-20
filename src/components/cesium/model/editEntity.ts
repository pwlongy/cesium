
import * as Cesium from "cesium";
import {
  myObject,
  dataSourceList
} from './interfaceBox/interfaceList'
class editEntity{
  viewer: Cesium.Viewer
  dataSource: dataSourceList
  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer;
    // 统一管理实体资源
    this.dataSource = {};
  }

  // 处理自定义颜色
  setColor(color: string):Cesium.Color | ''{
    if(color){
      return Cesium.Color.fromCssColorString(color);
    }
    return ''
  }
  // 添加点位基本信息
  addPoint(lat: number, lng:number, options:myObject = {} , dataSourceName:string) {
    if (!lat && !lng) {
      console.log("请上传点位的经纬度");
      return;
    }
    const viewer:Cesium.Viewer | Cesium.CustomDataSource = this.dataSource[dataSourceName] || this.viewer;
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
  getBillboard(billboard:myObject): myObject {
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
    }else {
      return {}
    }
  }


  // 绘制线条
  addPolyline(lineList:number[] = [], options:myObject = {}, dataSourceName: string) {
    if (lineList.length == 0) {
      console.log("请传递线条的经纬信息");
      return;
    }
    const viewer:Cesium.CustomDataSource | Cesium.Viewer = this.dataSource[dataSourceName] || this.viewer;
    viewer.entities.add({
      name: options.name || "Red line",
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray(lineList),
        width: options.width || 5,
        material: this.setColor(options.color) || Cesium.Color.RED,
      },
    });
  }

  // 绘制平面
  addPolygon(polygonList:number[] = [], options:myObject = {}, dataSourceName:string) {
    if (polygonList.length == 0) {
      console.log("请传递绘制平面的所有经纬信息");
      return;
    }
    const viewer:Cesium.CustomDataSource | Cesium.Viewer = this.dataSource[dataSourceName] || this.viewer;
    viewer.entities.add({
      name: options.name || "Blue polygon",
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArray(polygonList),
        material:
            this.setColor(options.color) || Cesium.Color.BLUE.withAlpha(0.5),
      },
    });
  }


  // 实体的统一管理
  // 统一管理数据源数据
  creatDataSource(dataSourceName:string):void {
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
  removeEntity(dataSourceName:string, entity:Cesium.Entity) {
    this.dataSource[dataSourceName].entities.remove(entity);
  }

  // 通过实体（entity）的id查询到对应实体
  getEntity(dataSourceName:string, id:string) {
    return this.dataSource[dataSourceName].entities.getById(id);
  }

  // 数据源中的所有实体
  getEntityList(dataSourceName:string) {
    return this.dataSource[dataSourceName].entities.values;
  }

  // 控制数据源中的实体的显示与隐藏
  isShowDataSource(dataSourceName:string, isShow: boolean) {
    this.getEntityList(dataSourceName).forEach((entity) => {
      entity.show = isShow;
    });
  }

  // 删除数据源中的所有实体
  removeAllEntity(dataSourceName:string) {
    this.dataSource[dataSourceName].entities.removeAll();
  }

}

export  default  editEntity