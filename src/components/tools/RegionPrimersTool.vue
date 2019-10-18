<template>
  <div class="tool-study-collabotators-wrapper">
    <div class="tool-study-collabotators">
      <el-row :gutter="20" class="mb-20">
        <el-col :span="24">
          <h3 class="text-black font-bold">Region primers tool</h3>
        </el-col>
        <el-col :span="24" class="mb-40">
          <p v-html="modalData.dialogIntro"></p>
        </el-col>
        <el-form :model="regionPrimersToolForm" label-position="top" :rules="rules" ref="regionPrimersToolForm">
          <el-row :gutter="10" class="mb-30">
            <el-col :span="8">
              <el-form-item label="Study:" prop="studyName">
                <el-select
                  v-model="regionPrimersToolForm.studyName"
                  @change="getProjects"
                  placeholder="Select study"
                  class="w-full">
                  <el-option v-for="study in studyList" :key="study.name" :label="study.name" :value="study.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="Project:" prop="projectName">
                <el-select
                  v-model="regionPrimersToolForm.projectName"
                  @change="getRegions"
                  placeholder="Select project"
                  class="w-full"
                  :disabled="!regionPrimersToolForm.studyName">
                  <el-option v-for="project in projectList" :key="project.name" :label="project.name" :value="project.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="Region:" prop="dnaDesignName">
                <el-select
                  v-model="regionPrimersToolForm.dnaDesignName"
                  placeholder="Select region"
                  class="w-full"
                  :disabled="!regionPrimersToolForm.projectName">
                  <el-option v-for="region in regionList" :key="region" :label="region" :value="region"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="24" class="mb-30 mt-20">
              <h5 class="text-black font-bold">Primer parameters:</h5>
              <p>You can define your desired parameters for primer design here. The defaults should generally work well for most amplicons amplified with modern high-fidelity polymerases.</p>
            </el-col>

            <el-col :span="5">
              <h5 class="text-black mb-20">Primer length</h5>
              <el-form-item label="Minimum:" class="form-item-label flex items-center text-sm" size="mini">
                <el-input-number v-model="regionPrimersToolForm.minLength" class="ml-10"></el-input-number>
              </el-form-item>
              <el-form-item label="Maximum:" class="form-item-label flex items-center text-sm" size="mini">
                <el-input-number v-model="regionPrimersToolForm.maxLength" class="ml-10"></el-input-number>
              </el-form-item>
            </el-col>

            <el-col :span="5">
              <h5 class="text-black mb-20">Annealing temperature</h5>
              <el-form-item label="Minimum:" class="form-item-label flex items-center text-sm" size="mini">
                <el-input-number v-model="regionPrimersToolForm.minTemperature" class="ml-10"></el-input-number>
              </el-form-item>
              <el-form-item label="Maximum:" class="form-item-label flex items-center text-sm" size="mini">
                <el-input-number v-model="regionPrimersToolForm.maxTemperature" class="ml-10"></el-input-number>
              </el-form-item>
            </el-col>

            <el-col :span="5">
              <h5 class="text-black mb-20">Percent GC</h5>
              <el-form-item label="Minimum:" class="form-item-label flex items-center text-sm" size="mini">
                <el-input-number v-model="regionPrimersToolForm.minPercentGC" class="ml-10"></el-input-number>
              </el-form-item>
              <el-form-item label="Maximum:" class="form-item-label flex items-center text-sm" size="mini">
                <el-input-number v-model="regionPrimersToolForm.maxPercentGC" class="ml-10"></el-input-number>
              </el-form-item>
            </el-col>

            <el-col :span="9">
              <h5 class="text-black mb-20">Base composition</h5>
              <el-form-item label="Maximum homopolymer length:" class="form-item-label flex items-center text-sm" size="mini">
                <el-input-number v-model="regionPrimersToolForm.maxHomopolymerLen" class="ml-10"></el-input-number>
              </el-form-item>
              <el-form-item label="Minimum base representation:" class="form-item-label flex items-center text-sm" size="mini">
                <el-input-number v-model="regionPrimersToolForm.maxPercentGC" class="ml-10"></el-input-number>
              </el-form-item>
              <el-form-item label="Maximum hairpin length:" class="form-item-label flex items-center text-sm" size="mini">
                <el-input-number v-model="regionPrimersToolForm.maxHairpinLen" class="ml-10"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
    </div>

    <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
      <el-button type="success" @click="save">Save</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { DialogBase, RegionPrimersTools } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({ name: 'RegionPrimersTool' })

export default class RegionPrimersTool extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  studyList: string[] = []
  projectList: string[] = []
  regionList: string[] = []

  regionPrimersToolForm: RegionPrimersTools = {
    user: this.$store.state.user.id,
    requestType: 'AdaptoPrimerRequest',
    studyName: '',
    projectName: '',
    primers: '',
    dnaDesignName: '',
    minTemperature: '52',
    maxTemperature: '58',
    saltConcentration: '0.05',
    dnaConcentration: '5',
    minPercentGC: '40',
    maxPercentGC: '60',
    maxHomopolymerLen: '5',
    minBaseRepresentation: '10',
    maxHairpinLen: '8',
    minLength: '18',
    maxLength: '30',
    minDistance: '80',
    maxDistance: '300',
    dimerLength: '5',
    hairpinLength: '5',
    tailMinDistance: '100',
    type: 'Adapto',
    well: 'A1'
  }

  rules: object = {
    studyName: { required: true, message: 'Study is required' },
    projectName: { required: true, message: 'Project name is required' },
    dnaDesignName: { required: true, message: 'Region is required' }
  }

  $refs!: {
    regionPrimersToolForm: HTMLFormElement
  }

  getStudyList () {
    this.$emit('loadOn')
    return httpService.get('query/studyNameList')
      .then((res: any) => { this.studyList = res.data.rows })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  getProjects () {
    this.$emit('loadOn')
    return httpService.post('query/projectNameList', { study: this.regionPrimersToolForm.studyName })
      .then((res: any) => {
        this.regionPrimersToolForm.projectName = ''
        this.regionPrimersToolForm.dnaDesignName = ''
        this.projectList = res.data.rows
      })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  getRegions () {
    this.$emit('loadOn')
    return httpService.post('query/locusRegionRetriever', {
      study: this.regionPrimersToolForm.studyName,
      project: this.regionPrimersToolForm.projectName
    }).then((res: any) => {
      this.regionPrimersToolForm.dnaDesignName = ''
      this.regionList = res.data.regions
    }).catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  get sendData () {
    return this.regionPrimersToolForm
  }

  /* submit Modal data */
  save () {
    this.$refs['regionPrimersToolForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: this.sendData })
      else return false
    })
  }

  created () {
    this.getStudyList()
  }
}
</script>
