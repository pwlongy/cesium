import * as Cesium from 'cesium'

class initCesium {
    BoxName: String = '';
    constructor(BoxName: String) {
        if (!BoxName) {
            console.log("地图容器盒子为必传字段")
            return
        }
        this.BoxName = BoxName
    }
    //  初始化地图
    initMap(): any {
        let Viewer:any = new Cesium.Viewer(this.BoxName)
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