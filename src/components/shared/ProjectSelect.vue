<template>
  <el-col :span="8">
    <el-form :model="projectSelectForm" label-position="top" :rules="rules">
      <el-form-item label="Project name:" prop="projectName">
        <el-select v-model="projectSelectForm.projectName" @change="assemblyList" placeholder="Select project" class="w-full">
          <el-option v-for="(item, i) in projectList" :key="i" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-col>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { httpService } from '@/services/http.service'

@Component({ name: 'ProjectSelect' })

export default class ProjectSelect extends Vue {
  @Prop({ required: true }) getAssemblyList!: any
  @Prop({ required: true }) projectList!: any

  projectSelectForm: any = {
    projectName: ''
  }

  rules: object = {
    projectName: [ { required: true } ]
  }

  assemblyList () {
    this.$emit('update:projectName', this.projectSelectForm.projectName)
    this.getAssemblyList()
  }
}
</script>
