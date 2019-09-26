<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24"><p v-html="modalData.dialogIntro" class="mb-8"></p></el-col>
    </el-row>
    <!-- Main modal content -->
    <div class="mb-30">
      <el-form :model="exportAssemblyForm" label-position="top" :rules="rules" ref="exportAssemblyForm">
        <el-row :gutter="20" class="mb-30">
          <el-col :span="8">
            <el-form-item label="Study name:" prop="study">
              <el-select v-model="exportAssemblyForm.study" @change="getProjectsList" placeholder="Select study" class="w-full">
                <el-option v-for="(item, i) in studyList" :key="i" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Project name:" prop="project">
              <el-select v-model="exportAssemblyForm.project" @change="getAssemblyList" placeholder="Select project" class="w-full">
                <el-option v-for="(item, i) in projectsList" :key="i" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Assembly name:" prop="assemblyName">
              <el-select v-model="exportAssemblyForm.assemblyName" placeholder="Select assembly" class="w-full">
                <el-option v-for="(item, i) in assemblyList" :key="i" :label="item.assembly" :value="item.assembly"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
      <el-button type="primary" @click="exportAssembly">Export</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { DialogBase, ExportAssembly } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({ name: 'ExportAssemblies' })

export default class ExportAssemblies extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  studyList: string[] = []
  projectsList: string[] = []
  assemblyList: string[] = []

  exportAssemblyForm: ExportAssembly = {
    study: '',
    project: '',
    assemblyName: ''
  }

  rules: object = {
    study: [ { required: true } ],
    project: [ { required: true } ],
    assemblyName: [ { required: true } ]
  }

  $refs!: {
    exportAssemblyForm: HTMLFormElement
  }

  get dateTime () {
    return `${(new Date().getMonth() + 1)}/${new Date().getDate()}/${new Date().getFullYear()}@${(new Date().getHours() < 10 ? 0 + new Date().getHours() : new Date().getHours())}:${(new Date().getMinutes() < 10 ? 0 + new Date().getMinutes() : new Date().getMinutes())}:${(new Date().getSeconds() < 10 ? 0 + new Date().getSeconds() : new Date().getSeconds())}`
  }

  /* submit Modal data */
  exportAssembly () {
    let zipName = `${this.exportAssemblyForm.assemblyName}_${this.dateTime}`
    // Create request to get .zip file
    let xhr = new XMLHttpRequest()
    xhr.open('POST', 'https://mendel-dev.nyumc.org/query/AssemblyExporter', true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.responseType = 'blob'
    xhr.onload = function () {
      if (this.status === 200) {
        let data = this.response
        if (navigator.appVersion.toString().indexOf('.NET') > 0 && navigator.msSaveBlob) window.navigator.msSaveBlob(new Blob([data]), `${zipName}.zip`)
        else {
          const blob = new Blob([data], { type: 'application/octet-stream' })
          const file = new File([blob], 'file.zip', { type: 'application/zip' })
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(file)
          link.download = `${zipName}.zip`
          document.body.appendChild(link)
          link.click()
          setTimeout(() => link.remove(), 0)
        }
      } else console.log('Internal Error occurred. Please contact Systems Administrator')
    }
    // Send array of links
    xhr.send(JSON.stringify(this.exportAssemblyForm))
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
    return httpService.post('query/projectNameList', { study: this.exportAssemblyForm.study })
      .then((res: any) => {
        this.exportAssemblyForm.project = ''
        this.exportAssemblyForm.assemblyName = ''
        this.projectsList = res.data.rows
        this.assemblyList = []
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  /* Get list of assemblies */
  getAssemblyList () {
    this.$emit('loadOn')
    return httpService.post('query/projectAssemblyList', { study: this.exportAssemblyForm.study, project: this.exportAssemblyForm.project })
      .then((res: any) => {
        this.exportAssemblyForm.assemblyName = ''
        this.assemblyList = res.data.rows
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  created () {
    this.getStudyList()
      .then(() => {
        if (this.modalData.hasOwnProperty('saveAndNextData')) {
          this.exportAssemblyForm.study = JSON.parse(this.modalData.saveAndNextData).studyName
          this.exportAssemblyForm.project = JSON.parse(this.modalData.saveAndNextData).projectName
          this.exportAssemblyForm.assemblyName = JSON.parse(this.modalData.saveAndNextData).dnaDesignName
        }
      })
  }
}
</script>
