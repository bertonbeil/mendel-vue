<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24"><p v-html="modalData.dialogIntro" class="mb-8"></p></el-col>
    </el-row>
    <!-- Main modal content -->
    <div class="mb-30">
      <el-form :model="adaptoAssemblyForm" label-position="top" :rules="rules" ref="adaptoAssemblyForm">
        <el-row :gutter="20" class="mb-30">
          <el-col :span="6">
            <el-form-item label="Study name:" prop="studyName">
              <el-select v-model="adaptoAssemblyForm.studyName" @change="getProjectsList" placeholder="Select study" class="w-full">
                <el-option v-for="(item, i) in studyList" :key="i" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Project name:" prop="projectName">
              <el-select v-model="adaptoAssemblyForm.projectName" @change="getRegionList" placeholder="Select project" class="w-full">
                <el-option v-for="(item, i) in projectsList" :key="i" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Region:" prop="locusName">
              <el-select v-model="adaptoAssemblyForm.locusName" placeholder="Select region" class="w-full">
                <el-option v-for="item in locusNameList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Name:" prop="name">
              <el-input v-model="adaptoAssemblyForm.name" placeholder="Enter assembly name"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24" class="mb-30">
            <el-form-item label="Description:" prop="description">
              <el-input v-model="adaptoAssemblyForm.description" placeholder="Enter a short but memorable description for this region"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
      <el-button type="primary" @click="save">Save</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { DialogBase, AdaptoAssembly } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({ name: 'CreateAdaptoAssembly' })

export default class CreateAdaptoAssembly extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  studyList: string[] = []
  projectsList: string[] = []
  locusNameList: string[] = []

  adaptoAssemblyForm: AdaptoAssembly = {
    studyName: '',
    projectName: '',
    locusName: '',
    name: '',
    description: ''
  }

  rules: object = {
    studyName: [ { required: true } ],
    projectName: [ { required: true } ],
    locusName: [ { required: true } ],
    name: [ { required: true } ],
    description: [ { required: true } ]
  }

  $refs!: {
    adaptoAssemblyForm: HTMLFormElement
  }

  /* submit Modal data */
  save () {
    this.$refs['adaptoAssemblyForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: this.adaptoAssemblyForm })
      else return false
    })
  }

  /* load Modal data -> Get list of study */
  getStudyList () {
    this.$emit('loadOn')
    return httpService.get('query/studyNameList')
      .then((res: any) => {
        this.studyList = res.data.rows
        this.$emit('loadOff')
      })
  }

  /* Get list of projects */
  getProjectsList () {
    this.$emit('loadOn')
    return httpService.post('query/projectNameList', { study: this.adaptoAssemblyForm.studyName })
      .then((res: any) => {
        this.adaptoAssemblyForm.projectName = ''
        this.adaptoAssemblyForm.locusName = ''
        this.projectsList = res.data.rows
        this.locusNameList = []
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  /* Get list of assemblies */
  getRegionList () {
    this.$emit('loadOn')
    return httpService.post('query/locusRegionRetriever', { study: this.adaptoAssemblyForm.studyName, project: this.adaptoAssemblyForm.projectName })
      .then((res: any) => {
        this.adaptoAssemblyForm.locusName = ''
        this.locusNameList = res.data.regions
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  created () {
    this.getStudyList()
  }
}
</script>
