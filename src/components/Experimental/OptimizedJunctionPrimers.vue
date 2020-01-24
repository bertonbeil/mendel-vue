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
                :disabled="!OptimizedJunctionForm.projectName"
                @change="testFillDraggable">
                <el-option v-for="(item, index) in assemblyList" :key="index" :label="item.assembly" :value="item.assembly"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
      </el-row>
      <div v-if="isShowDraggable">
        <el-row :gutter="20" class="mb-20">
          <el-col :span="6">
            <p class="text-xl text-black">Constarint Pallete</p>
          </el-col>
          <el-col :span="6">
            <p class="text-xl text-black">Requirement</p>
          </el-col>
          <el-col :span="6">
            <p class="text-xl text-black">Strong Preference</p>
          </el-col>
          <el-col :span="6">
            <p class="text-xl text-black">Soft Preference</p>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="mb-20">
          <el-col :span="6">
            <draggable class="el-card is-never-shadow p-10" v-model="OptimizedJunctionForm.constarintPallete" group="collaborators">
              <div class="inline-block w-1/2 p-1 cursor-pointer" v-for="constarint in OptimizedJunctionForm.constarintPallete" :key="constarint">
                <el-card shadow="hover" body-style="padding:10px">{{ constarint }}</el-card>
              </div>
            </draggable>
          </el-col>
          <el-col :span="6">
            <draggable class="min-h-full el-card is-never-shadow p-10" v-model="OptimizedJunctionForm.requirements" group="collaborators">
              <div class="inline-block w-1/2 p-1 cursor-pointer" v-for="requirement in OptimizedJunctionForm.requirements" :key="requirement">
                <el-card shadow="hover" body-style="padding:10px">{{ requirement }}</el-card>
              </div>
            </draggable>
          </el-col>
          <el-col :span="6">
            <draggable class="min-h-full el-card is-never-shadow p-10" v-model="OptimizedJunctionForm.strongPreferences" group="collaborators">
              <div class="inline-block w-1/2 p-1 cursor-pointer" v-for="strongPreference in OptimizedJunctionForm.strongPreferences" :key="strongPreference">
                <el-card shadow="hover" body-style="padding:10px">{{ strongPreference }}</el-card>
              </div>
            </draggable>
          </el-col>
          <el-col :span="6">
          <draggable class="min-h-full el-card is-never-shadow p-10" v-model="OptimizedJunctionForm.softPreferences" group="collaborators">
            <div class="inline-block w-1/2 p-1 cursor-pointer" v-for="softPreference in OptimizedJunctionForm.softPreferences" :key="softPreference">
              <el-card shadow="hover" body-style="padding:10px">{{ softPreference }}</el-card>
            </div>
          </draggable>
          </el-col>
        </el-row>
      </div>
    </el-form>

    <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
      <el-button type="success" @click="save">Save</el-button>
    </div>
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
  isShowDraggable: boolean = false

  OptimizedJunctionForm: OptimizedJunction = {
    studyName: '',
    projectName: '',
    name: '',
    constarintPallete: [],
    isShowDraggable: [],
    requirements: [],
    softPreferences: []
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

  get sendData () {
    return this.OptimizedJunctionForm
  }

  /* submit Modal data */
  save (next?: string) {
    return httpService.post('query/assemblyNameChecker', {
      studyName: this.OptimizedJunctionForm.studyName,
      projectName: this.OptimizedJunctionForm.projectName,
      name: this.OptimizedJunctionForm.name
    }).then((res: any) => {
      this.$refs['OptimizedJunctionForm'].validate((valid: boolean) => {
        if (valid) this.$emit('save', { data: this.sendData })
        else return false
      })
    })
  }

  testFillDraggable () {
    this.isShowDraggable = true
    this.OptimizedJunctionForm.constarintPallete = ['test1', 'test2,', 'test3', 'test354']
    this.OptimizedJunctionForm.requirements = ['test12', 'test25,', 'test36', 'test31']
    this.OptimizedJunctionForm.strongPreferences = ['test13', 'test266,', 'test334', 'test356']
    this.OptimizedJunctionForm.softPreferences = ['test122', 'test223,', 'test361', 'test3144']
  }

  created () {
    this.getStudyList()
  }
}
</script>
