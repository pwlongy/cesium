<template>
  <div id="cesiumcontainer"></div>
</template>

<script setup lang="ts">
import initCesium from "./model/initCesium";
import { onMounted } from "vue";

onMounted(() => {
  
  let options = {
  };
  // 初始化地图
  let viewer = new initCesium("cesiumcontainer", options);

  // console.log(viewer);
});
</script>

<style lang="scss" scoped>
#cesiumcontainer {
  width: 100%;
  height: 100%;
}
</style>
