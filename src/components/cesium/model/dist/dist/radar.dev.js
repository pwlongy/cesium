"use strict";

exports.__esModule = true;

var turf = require("@turf/turf");

var radar =
/** @class */
function () {
  function radar(viewer, lng, lat, radius) {
    this.viewer = viewer;
    this.position = {
      lng: lng,
      lat: lat
    };
    this.radius = radius;
    this.init();
  }

  radar.prototype.init = function () {
    // 获取圆形多边形点位数组
    var center = [this.position.lng, this.position.lat];
    var radius = this.radius;
    var options = {
      steps: 360,
      units: "kilometers",
      properties: {
        foo: "bar"
      }
    };
    var circle = turf.circle(center, radius, options); // 获取点位列表

    turf.getCoords(circle);
  };

  return radar;
}();