import * as Cesium from 'cesium'

class initCesium {
    BoxName: string;
    constructor(BoxName: string) {
        this.BoxName = BoxName

        // 初始化地图
        this.initMap()
    }
    //  初始化地图
    initMap(): any {
        let Viewer = new Cesium.Viewer(this.BoxName)
        return Viewer
    }

    // 添加地图点位
    addPoint(): void {

    }

    // 点位移动
    pointMove(): void {

    }


}

export default initCesium