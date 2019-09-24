<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24"><p v-html="modalData.dialogIntro" class="mb-8"></p></el-col>
    </el-row>
    <!-- Main modal content -->
    <div class="mb-30">
      <el-row :gutter="20" class="mb-30">
        <Select
          :name.sync='adaptoAssemblyForm.studyName'
          :list='studyList'
          :getList='getProjectsList'
          label='Study' />
        <Select
          :name.sync='adaptoAssemblyForm.projectName'
          :list='projectsList'
          :getList='getRegionList'
          label='Project'
          ref="projectSelect" />
        <Select
          :name.sync='adaptoAssemblyForm.locusName'
          :list='locusNameList'
          label='Assembly'
          ref="regionSelect" />
      </el-row>
      <el-form :model="adaptoAssemblyForm" label-position="top" :rules="rules" ref="adaptoAssemblyForm">
        <el-row :gutter="20" class="mb-30">
          <el-col :span="6">
            <el-form-item label="Name:" prop="name">
              <el-input v-model="adaptoAssemblyForm.name" placeholder="Enter assembly name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="Description:" prop="description">
              <el-input v-model="adaptoAssemblyForm.description" placeholder="Enter a short but memorable description for this region"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row :gutter="20" v-if="$store.state.debug">
        <el-col :span="24" class="p-10 mb-30 border-t-2 border-b-2 border-solid border-grey">
          <p class="text-xl text-black">Debug</p>
          <pre>{{ sendData }}</pre>
        </el-col>
      </el-row>
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
import ProjectSelect from '../../shared/Select.vue'

@Component({ name: 'CreateAdaptoAssembly' })

export default class CreateAdaptoAssembly extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  studyList: string[] = []
  projectsList: string[] = []
  locusNameList: string[] = []
  assemblyName: string = ''

  adaptoAssemblyForm: AdaptoAssembly = {
    studyName: '',
    projectName: '',
    locusName: this.assemblyName,
    name: '',
    description: ''
  }

  rules: object = {
    locusName: [ { required: true } ],
    name: [ { required: true } ],
    description: [ { required: true } ]
  }

  $refs!: {
    adaptoAssemblyForm: HTMLFormElement,
    projectSelect: HTMLFormElement,
    regionSelect: HTMLFormElement
  }

  get sendData () {
    return this.adaptoAssemblyForm
  }

  /* submit Modal data */
  save () {
    this.$refs['adaptoAssemblyForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: this.sendData })
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
        this.$refs.projectSelect.selectForm.name = ''
        this.$refs.regionSelect.selectForm.name = ''
        res.data.rows.map((item: any) => this.projectsList.push(item.name))
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  /* Get list of assemblies */
  getRegionList () {
    this.$emit('loadOn')
    return httpService.post('query/locusRegionRetriever', { study: this.adaptoAssemblyForm.studyName, project: this.adaptoAssemblyForm.projectName })
      .then((res: any) => {
        this.locusNameList = []
        this.$refs.regionSelect.selectForm.name = ''
        this.locusNameList = res.data.regions
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  created () {
    this.getStudyList()
  }
}
</script>
