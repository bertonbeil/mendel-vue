<template>
  <div>
    <!-- Main modal content -->
    <div class="mb-30">
      <el-row :gutter="20">
        <el-col :span="18">
          <el-row :gutter="20" class="mb-30">
            <Select
              :name.sync='adaptoSegmentsManipulationForm.studyName'
              :list='studyList'
              :getList='getProjectsList'
              label='Study' />
            <Select
              :name.sync='adaptoSegmentsManipulationForm.projectName'
              :list='projectsList'
              :getList='getRegionList'
              label='Project'
              ref="projectSelect" />
            <Select
              :name.sync='adaptoSegmentsManipulationForm.assemblyName'
              :list='assemblyList'
              label='Assembly'
              ref="assemblySelect" />
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-form :model="adaptoSegmentsManipulationForm" label-position="top" :rules="rules" ref="adaptoSegmentsManipulationForm">
            <el-form-item label="Action:" prop="action">
              <el-select v-model="adaptoSegmentsManipulationForm.action" placeholder="Select region" class="w-full">
                <el-option v-for="item in actionList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
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
import { DialogBase, AdaptoSegmentsManipulation } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({ name: 'CreateAdaptoSegmentsManipulation' })

export default class CreateAdaptoSegmentsManipulation extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  studyList: string[] = []
  projectsList: string[] = []
  assemblyList: string[] = []
  actionList: string[] = [ 'Delete', 'Swap', 'Replace' ]

  adaptoSegmentsManipulationForm: AdaptoSegmentsManipulation = {
    studyName: '',
    projectName: '',
    assemblyName: '',
    action: ''
  }

  rules: object = {
    action: [ { required: true } ]
  }

  $refs!: {
    adaptoSegmentsManipulationForm: HTMLFormElement,
    projectSelect: HTMLFormElement,
    assemblySelect: HTMLFormElement
  }

  /* submit Modal data */
  save () {
    this.$refs['adaptoSegmentsManipulationForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: this.adaptoSegmentsManipulationForm })
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
    return httpService.post('query/projectNameList', { study: this.adaptoSegmentsManipulationForm.studyName })
      .then((res: any) => {
        this.projectsList = []
        this.assemblyList = []
        this.$refs.projectSelect.selectForm.name = ''
        this.$refs.assemblySelect.selectForm.name = ''
        this.adaptoSegmentsManipulationForm.action = ''
        res.data.rows.map((item: any) => this.projectsList.push(item.name))
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  /* Get list of assemblies */
  getRegionList () {
    this.$emit('loadOn')
    return httpService.post('query/locusRegionRetriever', { study: this.adaptoSegmentsManipulationForm.studyName, project: this.adaptoSegmentsManipulationForm.projectName })
      .then((res: any) => {
        this.assemblyList = []
        this.$refs.assemblySelect.selectForm.name = ''
        this.adaptoSegmentsManipulationForm.action = ''
        this.assemblyList = res.data.regions
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  created () {
    this.getStudyList()
  }
}
</script>
