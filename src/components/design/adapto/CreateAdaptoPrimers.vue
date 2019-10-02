<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24">
        <h3 class="text-black">Create new Junction primers</h3>
      </el-col>
      <el-col :span="24">
        <p v-html="modalData.dialogIntro" class="mb-8 break-word"></p>
      </el-col>
    </el-row>
    <!-- Main modal content -->
    <div class="mb-30">
      <el-form :model="adaptoPrimersForm" label-position="top" :rules="rules" ref="adaptoPrimersForm">
        <el-row :gutter="20" class="mb-30">
          <el-col :span="8">
            <el-form-item label="Study name:" prop="studyName">
              <el-select
                v-model="adaptoPrimersForm.studyName"
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
                v-model="adaptoPrimersForm.projectName"
                @change="getAssemblyList"
                :disabled="!adaptoPrimersForm.studyName"
                placeholder="Select project"
                class="w-full">
                <el-option v-for="item in projectsList" :key="item.name" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Assembly name:" prop="dnaDesignName">
              <el-select
                v-model="adaptoPrimersForm.dnaDesignName"
                :disabled="!adaptoPrimersForm.projectName"
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
          <el-col :span="8">
            <p class="text-xl text-black mb-10">Primer length:</p>
            <el-form-item label="Minimum:" class="form-item-label flex items-center text-sm" size="mini">
              <el-input-number v-model="adaptoPrimersForm.minLength" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="Maximum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="adaptoPrimersForm.maxLength" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <p class="text-xl text-black mb-10">Annealing temperature:</p>
            <el-form-item label="Minimum:" class="form-item-label flex items-center text-sm" size="mini">
              <el-input-number v-model="adaptoPrimersForm.minTemperature" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="Maximum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="adaptoPrimersForm.maxTemperature" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <p class="text-xl text-black mb-10">Percent GC:</p>
            <el-form-item label="Minimum:" class="form-item-label flex items-center text-sm" size="mini">
              <el-input-number v-model="adaptoPrimersForm.minPercentGC" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="Maximum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="adaptoPrimersForm.maxPercentGC" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <p class="text-xl text-black mb-10">Amplicon length:</p>
            <el-form-item label="Minimum:" class="form-item-label flex items-center text-sm" size="mini">
              <el-input-number v-model="adaptoPrimersForm.minDistance" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="Maximum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="adaptoPrimersForm.maxDistance" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <p class="text-xl text-black mb-10">Base composition:</p>
            <el-form-item label="Maximum homopolymer length:" class="form-item-label flex items-center text-sm" size="mini">
              <el-input-number v-model="adaptoPrimersForm.maxHomopolymerLen" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="Minimum base representation:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="adaptoPrimersForm.minBaseRepresentation" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="Maximum hairpin length:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="adaptoPrimersForm.hairpinLength" class="ml-10" :min="1"></el-input-number>
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
import { DialogBase, AdaptoPrimers } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({
  name: 'CreateAdaptoPrimers'
})

export default class CreateAdaptoPrimers extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  studyList: string[] = []
  projectsList: string[] = []
  assemblyList: string[] = []

  adaptoPrimersForm: AdaptoPrimers = {
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
    minDistance: 200,
    maxDistance: 600,
    maxHomopolymerLen: 4,
    minBaseRepresentation: 15,
    hairpinLength: 8,
    saltConcentration: 0.05,
    dnaConcentration: 5,
    dimerLength: 5,
    tailMinDistance: 200,
    well: 'A1'
  }

  rules: object = {
    studyName: [ { required: true, message: 'Study name is required' } ],
    projectName: [ { required: true, message: 'Project name is required' } ],
    dnaDesignName: [ { required: true, message: 'Assembly name is required' } ]
  }

  $refs!: {
    adaptoPrimersForm: HTMLFormElement
  }

  get sendData () {
    return JSON.stringify(this.adaptoPrimersForm)
  }

  /* submit Modal data */
  save (next?: string) {
    this.$refs['adaptoPrimersForm'].validate((valid: boolean) => {
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
    return httpService.post('query/projectNameList', { study: this.adaptoPrimersForm.studyName })
      .then((res: any) => {
        this.assemblyList = []
        this.adaptoPrimersForm.projectName = ''
        this.adaptoPrimersForm.dnaDesignName = ''
        this.projectsList = res.data.rows
      })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  /* Get list of assemblies */
  getAssemblyList () {
    this.$emit('loadOn')
    return httpService.post('query/projectAssemblyList', {
      study: this.adaptoPrimersForm.studyName,
      project: this.adaptoPrimersForm.projectName
    }).then((res: any) => {
      this.adaptoPrimersForm.dnaDesignName = ''
      this.assemblyList = res.data.rows
    }).catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  getInitialData () {
    this.getStudyList()
      .then(() => {
        if (this.modalData.hasOwnProperty('saveAndNextData')) {
          this.adaptoPrimersForm.studyName = this.modalData.saveAndNextData.studyName
          this.adaptoPrimersForm.projectName = this.modalData.saveAndNextData.projectName
          this.adaptoPrimersForm.dnaDesignName = this.modalData.saveAndNextData.name
        }
      })
  }

  created () {
    this.getInitialData()
  }
}
</script>
