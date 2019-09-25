<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24"><p v-html="modalData.dialogIntro" class="mb-8"></p></el-col>
    </el-row>
    <!-- Main modal content -->
    <div class="mb-30">
      <el-form :model="denovoSegmentForm" label-position="top" :rules="rules" ref="denovoSegmentForm">
        <el-row :gutter="20" class="mb-30">
          <StudySelect :getProjectsList='getProjectsList' :studyName.sync='denovoSegmentForm.study' :studyList='studyList' />
          <ProjectSelect :getAssemblyList='getAssemblyList' :projectName.sync='denovoSegmentForm.project' :projectList='projectsList' />
          <el-col :span="8">
            <el-form-item label="Assembly name:" prop="dnaDesignName">
              <el-select v-model="denovoSegmentForm.dnaDesignName"
                @change="[getRestrictionEnzymeList(), latestDnaDesign()]"
                placeholder="Select assembly"
                class="w-full">
                <el-option v-for="(item, i) in assemblyList" :key="i" :label="item.assembly" :value="item.assembly"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24" class="mb-30">
            <h4 class="text-xl text-black mt-3">Segmentation options</h4>
            <p class="break-normal">Select options for this segmentation, such as assembly vector to be used and any desired flanking restriction sites.</p>
          </el-col>

          <el-col :span="8">
            <h4 class="relative inline-block pr-30 text-xl text-black mt-3">Assembly vector:
              <el-popover class="absolute top-0 right-0" placement="top-start" width="300" trigger="hover">
                <i slot="reference" class="el-icon-info cursor-pointer text-green"></i>
                <div>Choose the features of your assembly vector. Yeast CEN/ARS is automatically assigned. For assemblies 30kb high copy number bacterial vector is permissible.</div>
              </el-popover>
            </h4>
            <el-row class="mt-10">
              <el-col :span="9"><p>Yeast marker</p></el-col>
              <el-col :span="15">
                <el-radio-group v-model="assemblyVector.yeastMarker" size="mini">
                  <el-radio-button :label="'URA3'">URA3</el-radio-button>
                  <el-radio-button :label="'LEU2'">LEU2</el-radio-button>
                </el-radio-group>
              </el-col>
            </el-row>
            <el-row class="mt-10">
              <el-col :span="9"><p>Bacterial copy #</p></el-col>
              <el-col :span="15">
                <el-radio-group v-model="assemblyVector.bacterialCopy" size="mini">
                  <el-radio-button :label="'pUC'">High (pUC)</el-radio-button>
                  <el-radio-button :label="'BAC'">Low (BAC)</el-radio-button>
                </el-radio-group>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <h4 class="relative inline-block pr-30 text-xl text-black mt-3">Terminal restriction sites for segments:
              <el-popover class="absolute top-0 right-0" placement="top-start" width="300" trigger="hover">
                <i slot="reference" class="el-icon-info cursor-pointer text-green"></i>
                <div>Choose restrictions sites that will flank the segments of your assembly. These RE are non-cutters that should not exist in your assembly (but you will need to check this after finalizing the design).</div>
              </el-popover>
            </h4>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item prop='restrictionEnzyme5'>
                  <el-select v-model="denovoSegmentForm.restrictionEnzyme5" placeholder="5' RE" class="w-full">
                    <el-option v-for="item in restrictionEnzymes" :key="item.name" :label="item.name" :value="item.sequence"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop='restrictionEnzyme3'>
                  <el-select v-model="denovoSegmentForm.restrictionEnzyme3" placeholder="3' RE" class="w-full">
                    <el-option v-for="item in restrictionEnzymes" :key="item.name" :label="item.name" :value="item.sequence"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <h4 class="text-xl text-black mt-3">Assembly length (bp):</h4>
            <el-input-number v-model="assemblyLength" class="w-full" disabled></el-input-number>
          </el-col>

          <el-col :span="24" class="my-30">
            <h4 class="text-xl text-black mt-3">Segment parameters</h4>
            <p class="break-normal">You can define parameters for segmentation here. The defaults should work for most loci to minimize number of segments and maximize efficiency of assembly.</p>
          </el-col>

          <el-col :span="8">
            <p class="text-xl text-black mb-10">Segment length:</p>
            <el-form-item label="Minimum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="denovoSegmentForm.minLen" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="Maximum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="denovoSegmentForm.maxLen" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="Optimum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="denovoSegmentForm.optLen" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <p class="text-xl text-black mb-10">Overlap length:</p>
            <el-form-item label="Length:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="denovoSegmentForm.overlap" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-checkbox v-model="segmentVegasAdapters" class="mb-10">Segment by VEGAS adapters</el-checkbox>
            <p>This will result in segmentation of your assembly at the VEGAS adapters such that the VEGAS adapters will provide terminal homology for in yeasto assembly. If a transcription unit exceeds 5 kb, it will be segmented into two parts.</p>
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
import { DialogBase, DenovoSegment } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({ name: 'CreateDeNovoSegments' })

export default class CreateDeNovoSegments extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  studyList: string[] = []
  projectsList: string[] = []
  assemblyList: string[] = []
  restrictionEnzymes: object[] = []
  segmentVegasAdapters: boolean = false
  type: string = ''
  assemblyVector: any = { yeastMarker: 'URA3', bacterialCopy: 'pUC' }
  assemblyLength: number = 0

  denovoSegmentForm: DenovoSegment = {
    study: '',
    project: '',
    dnaDesignName: '',
    assemblyVectorName: `${this.assemblyVector.yeastMarker},${this.assemblyVector.bacterialCopy}`,
    maxLen: 5000,
    minLen: 600,
    optLen: 3000,
    overlap: 80,
    restrictionEnzyme5: '',
    restrictionEnzyme3: '',
    loxPsymDistance: 20,
    homopolymerLen: 7,
    homopolymerDistance: 200,
    sequences: 'None'
  }

  rules: object = {
    dnaDesignName: [ { required: true } ],
    restrictionEnzyme5: [ { required: true } ],
    restrictionEnzyme3: [ { required: true } ]
  }

  $refs!: {
    denovoSegmentForm: HTMLFormElement
  }

  get sendData () {
    return this.denovoSegmentForm
  }

  @Watch('assemblyVector', { deep: true })
  onChangeYeastMarker () {
    this.denovoSegmentForm.assemblyVectorName = `${this.assemblyVector.yeastMarker},${this.assemblyVector.bacterialCopy}`
  }

  /* submit Modal data */
  save (next?: string) {
    this.$refs['denovoSegmentForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: this.sendData }, next === 'next' ? this.modalData.saveAndNext : null)
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
    return httpService.post('query/projectNameList', { study: this.denovoSegmentForm.study })
      .then((res: any) => {
        this.denovoSegmentForm.project = ''
        this.denovoSegmentForm.dnaDesignName = ''
        this.projectsList = res.data.rows
        this.assemblyList = []
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  /* Get list of assemblies */
  getAssemblyList () {
    this.$emit('loadOn')
    return httpService.post('query/projectAssemblyList', { study: this.denovoSegmentForm.study, project: this.denovoSegmentForm.project })
      .then((res: any) => {
        this.denovoSegmentForm.dnaDesignName = ''
        this.assemblyList = res.data.rows
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  latestDnaDesign () {
    this.$emit('loadOn')
    return httpService.get('query/latestDnaDesign', { study: this.denovoSegmentForm.study, project: this.denovoSegmentForm.project })
      .then((res: any) => {
        res.data.rows.filter((i: any) => {
          if (i.name === this.denovoSegmentForm.dnaDesignName) this.assemblyLength = i.value.length
          return this.assemblyLength
        })
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  /* load Modal data -> Get list of restriction enzymes */
  getRestrictionEnzymeList () {
    return httpService.get('query/restrictionEnzymeList').then((res: any) => { this.restrictionEnzymes = res.data.rows })
  }

  created () {
    this.getStudyList()
      .then(() => {
        if (this.modalData.hasOwnProperty('saveAndNextData')) {
          this.denovoSegmentForm.study = this.modalData.saveAndNextData.studyName
          this.denovoSegmentForm.project = this.modalData.saveAndNextData.projectName
          this.denovoSegmentForm.dnaDesignName = this.modalData.saveAndNextData.name
        }
      })
  }
}
</script>
