<template>
  <!-- 用户视口 -->
  <div class="itemList" ref="viewport" :style="{height: rowHeight * viewCount + 'px'}" @scroll="onscroll">
    <!-- 滚动条 -->
    <div class="scrllbar" ref="scrllbar" :style="{height: bigList.length * rowHeight + 'px'}"></div>
    <!-- 子元素超出父元素高度才能实现 -->
    <div class="listBox">
      <div v-for="item in newlist" class="item">{{ item.n }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  getCurrentInstance,
} from "vue";
  const props = defineProps({
  list: {
    // 数组列表
    type: Array,
    default: () => [],
  },
  viewCount: {
    // 显示多少数据
    type: Number,
    default: 20,
  },
  rowHeight: {
    // 行高
    type: Number,
    default: 20,
  },
});
  console.log(props)

// 设置默认截取数据位置
let start = ref(0);
let end = ref(20);

// 获取Dom元素对象
let currentInstance = getCurrentInstance();
let viewport = ref()

// 处理高度
onMounted(() => {

});

// 创建海量数据
const list = new Array(200000).fill(null).map((ele, i) => ({ n: i + 1 }));
const bigList = ref(list);
console.log(bigList)

// 计算属性截取数据
let newlist = computed(() => {
  console.log(123456)
  return bigList.value.slice(start, end);
});

// 滚动条滚动
const onscroll = () => {
  console.log(viewport.value.scrollTop)
  // 计算滚动条滚动高度
  const scrollTop = viewport.value.scrollTop;
  // 判断需要从第几条开始截取数据
  start = Math.round(scrollTop / props.rowHeight)
  // 变换数据显示

}
</script>

<style scoped lang="scss">
.itemList {
  width: 300px;
  /* height: 500px;*/
  background-color: bisque;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  overflow-y: auto;

  .scrllbar {
    //height: 3000px;
  }

  .listBox {
    position: absolute;
    left: 0;
    top: 0;

    .item{
      height: 20px;
    }
  }
}
</style>
