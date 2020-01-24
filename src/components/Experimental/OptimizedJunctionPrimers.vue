<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24">
        <h3 class="text-black font-bold">Optimized unction Primers</h3>
      </el-col>
    </el-row>

    <el-form :model="OptimizedJunctionForm" label-position="top" :rules="rules" ref="OptimizedJunctionForm">
      <el-row :gutter="20" class="mb-30">
        <el-col :span="8">
            <el-form-item label="Study name:" prop="studyName">
              <el-select
                v-model="OptimizedJunctionForm.studyName"
                @change="getProjectsList"
                placeholder="Select study"
                class="w-full">
                <el-option v-for="item in studyList" :key="item.name" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Project name:" prop="projectName">
              <el-select
                v-model="OptimizedJunctionForm.projectName"
                :disabled="!OptimizedJunctionForm.studyName"
                @change="getAssemblyList"
                placeholder="Select project"
                class="w-full">
                <el-option v-for="item in projectsList" :key="item.name" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Assembly name:" prop="name">
              <el-select
                v-model="OptimizedJunctionForm.name"
                filterable
                allow-create
                default-first-option
                placeholder="Select assembly"
                class="w-full"
                :disabled="!OptimizedJunctionForm.projectName">
                <el-option v-for="(item, index) in assemblyList" :key="index" :label="item.assembly" :value="item.assembly"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { httpService } from '@/services/http.service'
import { OptimizedJunction } from '@/utils/interfaces'

@Component({ name: 'OptimizedJunctionPrimers' })

export default class OptimizedJunctionPrimers extends Vue {
  studyList: string[] = []
  projectsList: string[] = []
  assemblyList: string[] = []

  OptimizedJunctionForm: OptimizedJunction = {
    studyName: '',
    projectName: '',
    name: ''
  }

  rules: object = {
    studyName: [ { required: true, message: 'Study name is required' } ],
    projectName: [ { required: true, message: 'Project name is required' } ],
    name: [ { required: true, message: 'Assembly name is required' } ]
  }

  $refs!: {
    OptimizedJunctionForm: HTMLFormElement
  }

  getProjectsList () {
    this.$emit('loadOn')
    return httpService.post('query/projectNameList', { study: this.OptimizedJunctionForm.studyName })
      .then((res: any) => {
        this.projectsList = res.data.rows
      })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  getAssemblyList () {
    this.$emit('loadOn')
    return httpService.post('query/projectAssemblyList', {
      study: this.OptimizedJunctionForm.studyName,
      project: this.OptimizedJunctionForm.projectName
    }).then((res: any) => {
      this.assemblyList = res.data.rows
    })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  /* load Modal data -> Get list of study */
  getStudyList () {
    return httpService.get('query/studyNameList')
      .then((res: any) => { this.studyList = res.data.rows })
      .catch((err: any) => { throw new Error(err) })
  }

  created () {
    this.getStudyList()
  }
}
</script>
