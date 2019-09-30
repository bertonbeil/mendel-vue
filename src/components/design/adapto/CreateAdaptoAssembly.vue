<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24"><p v-html="modalData.dialogIntro" class="mb-8"></p></el-col>
    </el-row>
    <!-- Main modal content -->
    <div class="mb-30">
      <el-form :model="adaptoAssemblyForm" label-position="top" :rules="rules" ref="adaptoAssemblyForm">
        <el-row :gutter="20" class="mb-30">
          <el-col :span="8">
            <el-form-item label="Study name:" prop="studyName">
              <el-select
                v-model="adaptoAssemblyForm.studyName"
                @change="getProjectsList"
                placeholder="Select study"
                class="w-full">
                <el-option v-for="(item, i) in studyList" :key="i" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Project name:" prop="projectName">
              <el-select
                v-model="adaptoAssemblyForm.projectName"
                @change="getRegionList"
                :disabled="!adaptoAssemblyForm.studyName"
                placeholder="Select project"
                class="w-full">
                <el-option v-for="(item, i) in projectsList" :key="i" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Region name:" prop="locusName">
              <el-select
                v-model="adaptoAssemblyForm.locusName"
                :disabled="!adaptoAssemblyForm.projectName"
                placeholder="Select region"
                class="w-full">
                <el-option v-for="(item, i) in locusNameList" :key="i" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mb-30">
          <el-col :span="6">
            <el-form-item label="Name:" prop="name">
              <el-input
                v-model="adaptoAssemblyForm.name"
                :disabled="!adaptoAssemblyForm.locusName"
                placeholder="Enter assembly name">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="Description:" prop="description">
              <el-input
                v-model="adaptoAssemblyForm.description"
                :disabled="!adaptoAssemblyForm.name"
                placeholder="Enter a short but memorable description for this region">
              </el-input>
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
import { Component, Vue, Prop } from 'vue-property-decorator'
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
    studyName: [ { required: true, message: 'Study name is required' } ],
    projectName: [ { required: true, message: 'Project name is required' } ],
    locusName: [ { required: true, message: 'Region name is required' } ],
    name: [ { required: true, message: 'Assembly name is required' } ],
    description: [ { required: true, message: 'Description is required' } ]
  }

  $refs!: {
    adaptoAssemblyForm: HTMLFormElement
  }

  get sendData () {
    return this.adaptoAssemblyForm
  }

  /* submit Modal data */
  save () {
    this.$refs['adaptoAssemblyForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: JSON.stringify(this.sendData) })
      else return false
    })
  }

  /* load Modal data -> Get list of study */
  getStudyList () {
    this.$emit('loadOn')
    return httpService.get('query/studyNameList')
      .then((res: any) => {
        this.studyList = []
        res.data.rows.map((item: any) => this.studyList.push(item.name))
        this.$emit('loadOff')
      })
  }

  /* Get list of projects */
  getProjectsList () {
    this.$emit('loadOn')
    return httpService.post('query/projectNameList', { study: this.adaptoAssemblyForm.studyName })
      .then((res: any) => {
        this.projectsList = []
        this.locusNameList = []
        res.data.rows.map((item: any) => this.projectsList.push(item.name))
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  /* Get list of assemblies */
  getRegionList () {
    this.$emit('loadOn')
    return httpService.post('query/locusRegionRetriever', {
      study: this.adaptoAssemblyForm.studyName,
      project: this.adaptoAssemblyForm.projectName
    }).then((res: any) => {
      this.locusNameList = []
      this.adaptoAssemblyForm.locusName = ''
      this.locusNameList = res.data.regions
      this.$emit('loadOff')
    }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  created () {
    this.getStudyList()
      .then(() => {
        if (this.modalData.hasOwnProperty('saveAndNextData')) {
          console.log(JSON.parse(this.modalData.saveAndNextData))
          this.adaptoAssemblyForm.studyName = JSON.parse(this.modalData.saveAndNextData).studyName
          this.adaptoAssemblyForm.projectName = JSON.parse(this.modalData.saveAndNextData).projectName
          this.adaptoAssemblyForm.locusName = JSON.parse(this.modalData.saveAndNextData).name
          this.getProjectsList()
        }
      })
  }
}
</script>
