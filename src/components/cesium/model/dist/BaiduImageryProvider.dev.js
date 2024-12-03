"use strict";

/*
  由于百度地图与cesium的瓦块切片规则不同，
  其中心点位于地理坐标的0,0点，多数地图的切片是以地图左上角为瓦块切片的起点。
  Cesium中默认的切片地图（UrlTemplateImageryProvider）包括经纬度模式和投影（墨卡托）模式都是以左上角切片为基准。
  所以当我们加载百度地图瓦块地图时，需要自定义地图影像地图类。
*/
BaiduImageryProvider = function BaiduImageryProvider(options) {
  this._errorEvent = new Cesium.Event();
  this._tileWidth = 256;
  this._tileHeight = 256;
  this._maximumLevel = 18;
  this._minimumLevel = 1;
  var southwestInMeters = new Cesium.Cartesian2(-33554054, -33746824);
  var northeastInMeters = new Cesium.Cartesian2(33554054, 33746824);
  this._tilingScheme = new Cesium.WebMercatorTilingScheme({
    rectangleSouthwestInMeters: southwestInMeters,
    rectangleNortheastInMeters: northeastInMeters
  });
  this._rectangle = this._tilingScheme.rectangle;
  this._resource = Cesium.Resource.createIfNeeded(options.url);
  this._tileDiscardPolicy = undefined;
  this._credit = undefined;
  this._readyPromise = undefined;
};

Object.defineProperties(Cesium.gm.BaiduImageryProvider.prototype, {
  url: {
    get: function get() {
      return this._resource.url;
    }
  },
  proxy: {
    get: function get() {
      return this._resource.proxy;
    }
  },
  tileWidth: {
    get: function get() {
      if (!this.ready) {
        throw new Cesium.DeveloperError('tileWidth must not be called before the imagery provider is ready.');
      }

      return this._tileWidth;
    }
  },
  tileHeight: {
    get: function get() {
      if (!this.ready) {
        throw new Cesium.DeveloperError('tileHeight must not be called before the imagery provider is ready.');
      }

      return this._tileHeight;
    }
  },
  maximumLevel: {
    get: function get() {
      if (!this.ready) {
        throw new Cesium.DeveloperError('maximumLevel must not be called before the imagery provider is ready.');
      }

      return this._maximumLevel;
    }
  },
  minimumLevel: {
    get: function get() {
      if (!this.ready) {
        throw new Cesium.DeveloperError('minimumLevel must not be called before the imagery provider is ready.');
      }

      return this._minimumLevel;
    }
  },
  tilingScheme: {
    get: function get() {
      if (!this.ready) {
        throw new Cesium.DeveloperError('tilingScheme must not be called before the imagery provider is ready.');
      }

      return this._tilingScheme;
    }
  },
  tileDiscardPolicy: {
    get: function get() {
      if (!this.ready) {
        throw new Cesium.DeveloperError('tileDiscardPolicy must not be called before the imagery provider is ready.');
      }

      return this._tileDiscardPolicy;
    }
  },
  rectangle: {
    get: function get() {
      if (!this.ready) {
        throw new Cesium.DeveloperError('rectangle must not be called before the imagery provider is ready.');
      }

      return this._rectangle;
    }
  },
  errorEvent: {
    get: function get() {
      return this._errorEvent;
    }
  },
  ready: {
    get: function get() {
      return this._resource;
    }
  },
  readyPromise: {
    get: function get() {
      return this._readyPromise;
    }
  },
  credit: {
    get: function get() {
      if (!this.ready) {
        throw new Cesium.DeveloperError('credit must not be called before the imagery provider is ready.');
      }

      return this._credit;
    }
  }
});

BaiduImageryProvider.prototype.requestImage = function (x, y, level, request) {
  var xTileCount = this._tilingScheme.getNumberOfXTilesAtLevel(level);

  var yTileCount = this._tilingScheme.getNumberOfYTilesAtLevel(level);

  var url = this.url.replace("{x}", x - xTileCount / 2).replace("{y}", yTileCount / 2 - y - 1).replace("{z}", level).replace("{s}", Math.floor(10 * Math.random()));
  console.log("zxy:" + level + ", " + x + ", " + y + "; " + url);
  return Cesium.ImageryProvider.loadImage(this, url);
};