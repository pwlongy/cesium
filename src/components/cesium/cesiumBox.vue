<template>
    <div id="cesiumcontainer"></div>
</template>

<script setup lang="ts">

import initCesium from './model/initCesium'
import {onMounted} from "vue"

onMounted(() => {
    let options = {
      boxName: "cesiumcontainer"
    }

    // 初始化地图
    let Viewer = new initCesium(options)

    console.log(Viewer)
})
</script>

<style lang="scss" scoped>
#cesiumcontainer{
  width: 100%;
  height: 100%;
}
</style>