<template>
  <!-- 用户视口 -->
  <div class="itemList" ref="viewport">
    <!-- 滚动条 -->
    <div class="scrllbar" ref="scrllbar"></div>
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
let start: number = 0;
let end: number = 20;

// 获取Dom元素对象
let currentInstance = getCurrentInstance();

// 处理高度
onMounted(() => {});

// 创建海量数据
const list = new Array(200000).fill(null).map((ele, i) => ({ n: i + 1 }));
const bigList = ref(list);

// 计算属性截取数据
let newlist = computed(() => {
  return bigList.value.slice(start, end);
});
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
    /* height: 3000px;*/
  }

  .listBox {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
