<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24"><p v-html="modalData.dialogIntro" class="mb-8"></p></el-col>
    </el-row>
    <!-- Main modal content -->
    <div class="mb-30">
      <el-form :model="denovoSegmentForm" label-position="top" :rules="rules" ref="denovoSegmentForm">
        <el-row :gutter="20" class="mb-30">
          <el-col :span="8">
            <el-form-item label="Study name:" prop="studyName">
              <el-select
                v-model="denovoSegmentForm.studyName"
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
                v-model="denovoSegmentForm.projectName"
                @change="getAssemblyList"
                :disabled="!denovoSegmentForm.studyName"
                placeholder="Select project"
                class="w-full">
                <el-option v-for="(item, i) in projectsList" :key="i" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Assembly name:" prop="dnaDesignName">
              <el-select
                v-model="denovoSegmentForm.dnaDesignName"
                @change="[getRestrictionEnzymeList(), latestDnaDesign()]"
                :disabled="!denovoSegmentForm.projectName"
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
                <div class="break-word">Choose the features of your assembly vector. Yeast CEN/ARS is automatically assigned. For assemblies 30kb high copy number bacterial vector is permissible.</div>
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
                <div class="break-word">Choose restrictions sites that will flank the segments of your assembly. These RE are non-cutters that should not exist in your assembly (but you will need to check this after finalizing the design).</div>
              </el-popover>
            </h4>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item prop='restrictionEnzyme5'>
                  <el-select
                    v-model="denovoSegmentForm.restrictionEnzyme5"
                    :disabled="!denovoSegmentForm.dnaDesignName"
                    placeholder="5' RE"
                    class="w-full">
                    <el-option v-for="item in restrictionEnzymes" :key="item.name" :label="item.name" :value="item.sequence"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop='restrictionEnzyme3'>
                  <el-select
                    v-model="denovoSegmentForm.restrictionEnzyme3"
                    :disabled="!denovoSegmentForm.dnaDesignName"
                    placeholder="3' RE"
                    class="w-full">
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
            <el-checkbox v-model="type" class="mb-10">Segment by VEGAS adapters</el-checkbox>
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
  type: boolean = false
  assemblyVector: any = { yeastMarker: 'URA3', bacterialCopy: 'pUC' }
  assemblyLength: number = 0
  isSaveAndNext: boolean = false

  denovoSegmentForm: DenovoSegment = {
    studyName: '',
    projectName: '',
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
    studyName: [ { required: true, message: 'Study name is required' } ],
    projectName: [ { required: true, message: 'Project name is required' } ],
    dnaDesignName: [ { required: true, message: 'Assembly name is required' } ],
    restrictionEnzyme5: [ { required: true, message: 'Restriction sites is required' } ],
    restrictionEnzyme3: [ { required: true, message: 'Restriction sites is required' } ]
  }

  $refs!: {
    denovoSegmentForm: HTMLFormElement
    projectSelect: HTMLFormElement
  }

  get sendData () {
    return this.denovoSegmentForm
  }

  @Watch('assemblyVector', { deep: true })
  onChangeYeastMarker () {
    this.denovoSegmentForm.assemblyVectorName = `${this.assemblyVector.yeastMarker},${this.assemblyVector.bacterialCopy}`
  }

  @Watch('type')
  onChangeType () {
    if (this.type) this.denovoSegmentForm.type = 'Vegas'
    else delete this.denovoSegmentForm.type
  }

  /* submit Modal data */
  save (next?: string) {
    this.$refs['denovoSegmentForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: JSON.stringify(this.sendData) }, next === 'next' ? this.modalData.saveAndNext : null)
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
    return httpService.post('query/projectNameList', { study: this.denovoSegmentForm.studyName })
      .then((res: any) => {
        this.projectsList = []
        this.assemblyList = []
        res.data.rows.map((item: any) => this.projectsList.push(item.name))
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  /* Get list of assemblies */
  getAssemblyList () {
    if (this.isSaveAndNext === false) this.$emit('loadOn')
    return httpService.post('query/projectAssemblyList', {
      study: this.denovoSegmentForm.studyName,
      project: this.denovoSegmentForm.projectName
    }).then((res: any) => {
      this.assemblyList = res.data.rows
      this.$emit('loadOff')
    }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  latestDnaDesign () {
    this.$emit('loadOn')
    return httpService.get('query/latestDnaDesign', { study: this.denovoSegmentForm.studyName, project: this.denovoSegmentForm.projectName })
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
          this.isSaveAndNext = true
          this.denovoSegmentForm.studyName = JSON.parse(this.modalData.saveAndNextData).studyName
          this.denovoSegmentForm.projectName = JSON.parse(this.modalData.saveAndNextData).projectName
          this.denovoSegmentForm.dnaDesignName = JSON.parse(this.modalData.saveAndNextData).name
          this.getProjectsList()
          this.getAssemblyList()
          this.getRestrictionEnzymeList()
        }
        this.$emit('loadOff')
      })
  }
}
</script>
