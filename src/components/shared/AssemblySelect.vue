<template>
  <el-col :span="8">
    <el-form :model="assemblySelectForm" label-position="top" :rules="rules">
      <el-form-item label="Assembly name:" prop="assemblyName">
        <el-select v-model="assemblySelectForm.assemblyName"
          @change="$emit('update:assemblyName', assemblySelectForm.assemblyName)"
          placeholder="Select assembly"
          class="w-full">
          <el-option v-for="(item, i) in assemblyList" :key="i" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-col>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { httpService } from '@/services/http.service'

@Component({ name: 'AssemblySelect' })

export default class AssemblySelect extends Vue {
  @Prop({ required: true }) assemblyList!: any

  assemblySelectForm: any = {
    assemblyName: ''
  }

  rules: object = {
    assemblyName: [ { required: true } ]
  }
}
</script>
