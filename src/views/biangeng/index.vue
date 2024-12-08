<template>
  <div class="change">
    <div class="steps">
      <el-steps
          :space="200"
          :active="active"
          finish-status="success"
      >
        <el-step title="发起变更" />
        <el-step title="风险辨识" />
        <el-step title="装置配置" />
        <el-step title="变更审批" />
        <el-step title="变更实施" />
        <el-step title="投用前审批" />
        <el-step title="验收与关闭" />
        <el-step title="完结" />
      </el-steps>
    </div>

    <ChengeRequests ref="chengeRequests"></ChengeRequests>

  </div>

</template>

<script setup>
import ChengeRequests from "@/views/biangeng/model/changeRequests.vue";
import {onMounted} from "vue";
// 步骤条
import { ref } from 'vue'
const active = ref(0)


// 获取发起变更数据
onMounted(() => {
  console.log(chengeRequests.value)
})
const chengeRequests = ref(null)

</script>

<style lang="scss" scoped>

.change{
  background: #f0f2f5;
}
.steps{
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 130px;


  :deep(.el-steps){
    .el-step__head{
      width: 200px;
    }
  }
}
</style>