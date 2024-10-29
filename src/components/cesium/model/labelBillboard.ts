import * as Cesium from "cesium";

interface options{
  [key:string]: any
}
// 自定义label 的显示
export default class labelBillboard {
  options: options
  id: string
  viewer: Cesium.Viewer
  position: Cesium.Cartesian3
  element: string | HTMLDivElement
  maxRenderDis: number
  show: boolean
  constructor(viewer:Cesium.Viewer, position:options, HtmlResult: Function | string, options:options = {}) {
    this.options = options;
    this.id = options.type + options.id;
    // 判断传递过来的数据类型
    let elementObj:string | HTMLDivElement = HtmlResult instanceof Function ? HtmlResult() : HtmlResult;
    // console.log(HtmlResult);
    // 经纬度不存在的时候直接return
    if (!position.lng || !position.lat) return;

    this.viewer = viewer;
    this.position = Cesium.Cartesian3.fromDegrees(
      position.lng,
      position.lat,
      position.height || 0
    );
    this.element = elementObj;
    // 获取相机高度
    this.maxRenderDis =
      Math.round(viewer.camera.positionCartographic.height) * 5;
    this.show = true;

    this.initBillboard();
  }

  initBillboard() {
    // 创建一个div
    let userBox = document.createElement("div");
    // userBox.id = this.id;
    userBox.style.position = "absolute";
    userBox.className = "resultMarker";
    userBox.innerHTML = JSON.stringify(this.element);
    this.element = userBox;
    // 自定义html

    this.viewer.cesiumWidget.container.appendChild(this.element);

    //实时更新 场景渲染完成执行的操作，会一直执行
    // this.viewer.scene.postRender.addEventListener(() => {
    //   this.updateBillboardLocation();
    // });

    // 第一次显示的时候显示
    this.updateBillboardLocation();
    // 实时更新点位位置 相机位置移动时执行方法
    let previousCameraPosition = this.viewer.camera.position.clone();
    this.viewer.scene.postRender.addEventListener(() => {
      // 获取相机位置
      let currentCameraPosition = this.viewer.camera.position;

      // 相机位置发生变化
      this.updateBillboardLocation();

      // 相机位置发生变化时触发label位置更新
      if (!currentCameraPosition.equals(previousCameraPosition)) {
      }
      previousCameraPosition = currentCameraPosition.clone();
    });

    // 相机视角改变时触发, 触发时，执行不是很灵敏
    // this.viewer.camera.changed.addEventListener(() => {
    //    this.updateBillboardLocation();
    //   console.log('视角发生变化')
    // })
  }
  updataPosition(position: options) {
    this.position = Cesium.Cartesian3.fromDegrees(
      position.lng,
      position.lat,
      position.height || 0
    );
  }
  updateBillboardLocation() {
    // 控制自定义label元素的位置
    if (this.element) {
      // 地图盒子的高度
      const canvasHeight = this.viewer.scene.canvas.clientHeight;
      const windowPosition = new Cesium.Cartesian2();
      Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        this.viewer.scene,
        this.position,
        windowPosition
      );
      if(typeof this.element !== 'string' ){
        this.element.style.bottom = canvasHeight - windowPosition.y + "px";
        const elWidth = this.element.offsetWidth;
        this.element.style.left = windowPosition.x - elWidth / 2 + "px";
      }

      const camerPosition = this.viewer.camera.position;
      let height =
        this.viewer.scene.globe.ellipsoid.cartesianToCartographic(
          camerPosition
        ).height;
      height += this.viewer.scene.globe.ellipsoid.maximumRadius;
      if (this.show) {
        if (
          !(
            Cesium.Cartesian3.distance(camerPosition, this.position) > height
          ) &&
          this.viewer.camera.positionCartographic.height < this.maxRenderDis
        ) {
          if(typeof this.element ==='string') return
          this.element.style.display = "block";
        } else {
          if(typeof this.element ==='string') return
          this.element.style.display = "none";
        }
      } else {
        if(typeof this.element ==='string') return
        this.element.style.display = "none";
      }
    }
  }
}
