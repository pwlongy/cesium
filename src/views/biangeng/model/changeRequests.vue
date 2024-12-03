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
          <el-form-item label="变更发起人" prop="id">
            <el-input v-model="ruleForm.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请单位" prop="id">
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
        </el-col>
        <el-col :span="6">

        </el-col>
        <el-col :span="6">
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
}
const ruleForm = reactive<RuleForm>({
  id: '',
  name: '',
  unit: '',
  changeName: '',
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
    value: 'Option2',
    label: 'Option2',
    disabled: true,
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]
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