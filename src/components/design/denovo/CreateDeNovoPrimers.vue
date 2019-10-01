<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24"><p v-html="modalData.dialogIntro" class="mb-8"></p></el-col>
    </el-row>
    <!-- Main modal content -->
    <div class="mb-30">
      <el-form :model="denovoPrimersForm" label-position="top" :rules="rules" ref="denovoPrimersForm">
        <el-row :gutter="20" class="mb-30">
          <el-col :span="8">
            <el-form-item label="Study name:" prop="studyName">
              <el-select
                v-model="denovoPrimersForm.studyName"
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
                v-model="denovoPrimersForm.projectName"
                :disabled="!denovoPrimersForm.studyName"
                @change="getAssemblyList"
                placeholder="Select project"
                class="w-full">
                <el-option v-for="item in projectsList" :key="item.name" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Assembly name:" prop="dnaDesignName">
              <el-select
                v-model="denovoPrimersForm.dnaDesignName"
                :disabled="!denovoPrimersForm.projectName"
                placeholder="Select assembly"
                class="w-full">
                <el-option v-for="item in assemblyList" :key="item.assembly" :label="item.assembly" :value="item.assembly"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="mb-30">
          <el-col :span="24" class="mb-30">
            <h4 class="text-xl text-black mt-3">Primer parameters:</h4>
            <p class="break-normal">You can define your desired parameters for primer design here. The defaults should generally work well for most amplicons amplified with modern high-fidelity polymerases.</p>
          </el-col>

          <el-col :span="6">
            <h4 class="text-xl text-black mb-20">Primer length:</h4>
            <el-form-item label="Minimum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="denovoPrimersForm.minLength" class="ml-10" :min="0" :max="10000"></el-input-number>
            </el-form-item>
            <el-form-item label="Maximum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="denovoPrimersForm.maxLength" class="ml-10" :min="0" :max="10000"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <h4 class="text-xl text-black mb-20">Annealing temperature:</h4>
            <el-form-item label="Minimum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="denovoPrimersForm.minTemperature" class="ml-10" :min="0" :max="10000"></el-input-number>
            </el-form-item>
            <el-form-item label="Maximum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="denovoPrimersForm.maxTemperature" class="ml-10" :min="0" :max="10000"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <h4 class="text-xl text-black mb-20">Percent GC:</h4>
            <el-form-item label="Minimum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="denovoPrimersForm.minPercentGC" class="ml-10" :min="0" :max="10000"></el-input-number>
            </el-form-item>
            <el-form-item label="Maximum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="denovoPrimersForm.maxPercentGC" class="ml-10" :min="0" :max="10000"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <h4 class="text-xl text-black mb-20">Amplicon length:</h4>
            <el-form-item label="Minimum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="denovoPrimersForm.minDistance" class="ml-10" :min="0" :max="10000"></el-input-number>
            </el-form-item>
            <el-form-item label="Maximum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="denovoPrimersForm.maxDistance" class="ml-10" :min="0" :max="10000"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
      <el-button type="success" @click="save('next')">Save and Export</el-button>
      <el-button type="primary" @click="save">Save</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { DialogBase, DenovoPrimers } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({ name: 'CreateDeNovoPrimers' })

export default class CreateDeNovoPrimers extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  studyList: string[] = []
  projectsList: string[] = []
  assemblyList: string[] = []

  denovoPrimersForm: DenovoPrimers = {
    studyName: '',
    projectName: '',
    primers: '',
    dnaDesignName: '',
    minLength: 18,
    maxLength: 30,
    minTemperature: 52,
    maxTemperature: 58,
    minPercentGC: 40,
    maxPercentGC: 60,
    minDistance: 80,
    maxDistance: 300,
    saltConcentration: 0.05,
    dnaConcentration: 5,
    dimerLength: 5,
    hairpinLength: 5,
    tailMinDistance: 200,
    well: 'A1'
  }

  rules: object = {
    studyName: [ { required: true, message: 'Study name is required' } ],
    projectName: [ { required: true, message: 'Project name is required' } ],
    dnaDesignName: [ { required: true, message: 'Assembly name is required' } ]
  }

  $refs!: {
    denovoPrimersForm: HTMLFormElement
  }

  get sendData () {
    return JSON.stringify(this.denovoPrimersForm)
  }

  /* submit Modal data */
  save (next?: string) {
    this.$refs['denovoPrimersForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: this.sendData }, next === 'next' ? this.modalData.saveAndNext : null)
      else return false
    })
  }

  /* load Modal data -> Get list of study */
  getStudyList () {
    this.$emit('loadOn')
    return httpService.get('query/studyNameList')
      .then((res: any) => { this.studyList = res.data.rows })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  /* Get list of projects */
  getProjectsList () {
    this.$emit('loadOn')
    return httpService.post('query/projectNameList', { study: this.denovoPrimersForm.studyName })
      .then((res: any) => {
        this.assemblyList = []
        this.denovoPrimersForm.projectName = ''
        this.denovoPrimersForm.dnaDesignName = ''
        this.projectsList = res.data.rows
      })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  /* Get list of assemblies */
  getAssemblyList () {
    this.$emit('loadOn')
    return httpService.post('query/projectAssemblyList', { study: this.denovoPrimersForm.studyName, project: this.denovoPrimersForm.projectName })
      .then((res: any) => {
        this.denovoPrimersForm.dnaDesignName = ''
        this.assemblyList = res.data.rows
      })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  created () {
    this.getStudyList()
  }
}
</script>
