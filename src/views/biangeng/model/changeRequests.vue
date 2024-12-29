<!--变更申请表-->
<template>
  <div class="changeRequests">
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
        status-icon
    >
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="变更编号" prop="id">
            <el-input v-model="ruleForm.id" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="变更发起人" prop="name">
            <el-input v-model="ruleForm.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请单位" prop="unit">
            <el-select v-model="ruleForm.unit" placeholder="Select">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
              />
            </el-select>
          </el-form-item></el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="变更名称" prop="changeName">
            <el-input v-model="ruleForm.changeName" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发起日期" prop="InitiateTime">
            <el-date-picker
                v-model="ruleForm.InitiateTime"
                type="date"
                :default-time="new Date()"
                :size="size"
                :disabled-date="disabledDate"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="计划投用日期" prop="CommissioningTime">
            <el-date-picker
                v-model="ruleForm.CommissioningTime"
                type="date"
                :size="size"
                :default-time="new Date()"

            />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
  </div>
</template>

<script setup lang="ts">

import { reactive, ref } from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
interface RuleForm {
  id: string,
  name: string,
  unit: string,
  changeName: string,
  InitiateTime: string,
  CommissioningTime: string
}

// 时间选择区域
const disabledDate = (time: Date) => {
  return time.getTime() < new Date().getTime()
}

const ruleForm = reactive<RuleForm>({
  id: '',
  name: '',
  unit: '',
  changeName: '',
  InitiateTime: '',
  CommissioningTime: ''
})

const rules = reactive<FormRules<RuleForm>>({
  id: [
    {required: true, message: 'Please input Activity name', trigger: 'blur'},
    {min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur'},
  ],
})

// 下拉选择框
const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]

// 将数据直接暴露出去，父组件可以直接获取
defineExpose({
  ruleForm
})
</script>

<style lang="scss" scoped>
  .changeRequests{
    margin-top: 20px;
    background: #fff;

    .el-form{
      padding: 20px;

      .el-row{
        margin-bottom: 20px;
      }
    }
  }
</style>