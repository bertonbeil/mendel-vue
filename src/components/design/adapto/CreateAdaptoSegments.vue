<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24"><p v-html="modalData.dialogIntro" class="mb-8"></p></el-col>
    </el-row>
    <!-- Main modal content -->
    <div class="mb-30">
      <el-form :model="segmentRequest" label-position="top" :rules="rules" ref="segmentRequest">
        <el-row :gutter="20" class="mb-30">
          <el-col :span="8">
            <el-form-item label="Study name:" prop="study">
              <el-select v-model="segmentRequest.study" @change="getProjectsList" placeholder="Select study" class="w-full">
                <el-option v-for="(item, i) in studyList" :key="i" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Project name:" prop="project">
              <el-select v-model="segmentRequest.project" @change="getAssemblyList" placeholder="Select project" class="w-full">
                <el-option v-for="(item, i) in projectsList" :key="i" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Assembly name:" prop="dnaDesignName">
              <el-select v-model="dnaDesignName" @change="getRestrictionEnzymeList" placeholder="Select assembly" class="w-full">
                <el-option v-for="(item, i) in assemblyList" :key="i" :label="item.assembly" :value="item.assembly"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24" class="mb-30">
            <h4 class="text-xl text-black mt-3">Segmentation options</h4>
            <p class="break-normal">Select options for this segmentation, such as assembly vector to be used and any desired flanking restriction sites.</p>
          </el-col>

          <el-col :span="12" class="mb-30">
            <h4 class="relative inline-block pr-30 text-xl text-black mt-3">Assembly vector:
              <el-popover class="absolute top-0 right-0" placement="top-start" width="300" trigger="hover">
                <i slot="reference" class="el-icon-info cursor-pointer text-green"></i>
                <div>All vectors are kanamycin resistant for bacterial selection, and are inducible to high copy number in bacteria for isolation. All contain CEN/ARS for low copy yeast maintenance.</div>
              </el-popover>
            </h4>
            <div class="flex items-center mt-10">
              <p class="mr-20">Yeast marker</p>
              <el-radio-group v-model="segmentRequest.assemblyVectorName" size="mini">
                <el-radio-button :label="'URA3'">URA3</el-radio-button>
                <el-radio-button :label="'LEU2'">LEU2</el-radio-button>
              </el-radio-group>
            </div>
          </el-col>
          <el-col :span="12" class="mb-30">
            <h4 class="relative inline-block pr-30 text-xl text-black mt-3">Upload .bed formatted mask file:</h4>
            <el-upload action="https://jsonplaceholder.typicode.com/posts/" :file-list="fileList" class="mt-10">
              <el-button size="mini" type="primary">Click to upload</el-button>
            </el-upload>
          </el-col>

          <el-col :span="24" class="mb-30">
            <h4 class="text-xl text-black mt-3">Segment parameters:</h4>
            <p class="break-normal">You can define parameters for segmentation here. The defaults should work for most loci to minimize number of segments and maximize efficiency of assembly.</p>
          </el-col>

          <el-col :span="12">
            <p class="text-xl text-black mb-10">Segment length</p>
            <el-form-item label="Minimum:" class="flex items-center text-sm" size="mini">
              <el-input-number v-model="segmentRequest.minLen" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="Maximum:" class="flex items-center" size="mini">
              <el-input-number v-model="segmentRequest.maxLen" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="Optimum:" class="flex items-center" size="mini">
              <el-input-number v-model="segmentRequest.optLen" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <p class="text-xl text-black mb-10">Overlap length</p>
            <el-form-item label="Minimum:" class="flex items-center text-sm" size="mini">
              <el-input-number v-model="segmentRequest.minOverlap" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="Maximum:" class="flex items-center" size="mini">
              <el-input-number v-model="segmentRequest.maxOverlap" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="Optimum:" class="flex items-center" size="mini">
              <el-input-number v-model="segmentRequest.optOverlap" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
          </el-col>

          <el-col :span="24" class="mb-30">
            <h4 class="text-xl text-black mt-3">Primer parameters:</h4>
            <p class="break-normal">You can define your desired parameters for primer design here. The defaults should generally work well for most amplicons amplified with modern high-fidelity polymerases.</p>
          </el-col>

          <el-col :span="6">
            <p class="text-xl text-black mb-10">Primer length</p>
            <el-form-item label="Minimum:" class="flex items-center text-sm" size="mini">
              <el-input-number v-model="primersRequest.minLength" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="Maximum:" class="flex items-center" size="mini">
              <el-input-number v-model="primersRequest.maxLength" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <p class="text-xl text-black mb-10">Annealing temperature</p>
            <el-form-item label="Minimum:" class="flex items-center text-sm" size="mini">
              <el-input-number v-model="primersRequest.minTemperature" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="Maximum:" class="flex items-center" size="mini">
              <el-input-number v-model="primersRequest.maxTemperature" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <p class="text-xl text-black mb-10">Percent GC</p>
            <el-form-item label="Minimum:" class="flex items-center text-sm" size="mini">
              <el-input-number v-model="primersRequest.minPercentGC" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="Maximum:" class="flex items-center" size="mini">
              <el-input-number v-model="primersRequest.maxPercentGC" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <p class="text-xl text-black mb-10">Base composition</p>
            <el-form-item label="Minimum:" class="flex items-center text-sm" size="mini">
              <el-input-number v-model="primersRequest.hairpinLength" class="ml-10" :min="1"></el-input-number>
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
import { DialogBase, AdaptoSegmentRequest, AdaptoPrimersRequest } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({ name: 'CreateAdaptoSegments' })

export default class CreateAdaptoSegments extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  studyList: string[] = []
  projectsList: string[] = []
  assemblyList: string[] = []
  restrictionEnzymes: object[] = []
  segmentVegasAdapters: boolean = false
  type: string = ''
  dnaDesignName: string = ''
  fileList: object[] = []

  segmentRequest: AdaptoSegmentRequest = {
    study: '',
    project: '',
    assemblyVectorName: 'URA3',
    dnaDesignName: this.dnaDesignName,
    assembly: this.dnaDesignName,
    mask: 'chr10\t122432664\t122432665\t \nchr10\t122432914\t122432915\t \nchr10\t122432958\t122432959\t \nchr10\t122433665\t122433666\t \nchr10\t122435525\t122435625\t \n',
    maxLen: 1000,
    minLen: 5000,
    optLen: 5000,
    minOverlap: 100,
    maxOverlap: 600,
    optOverlap: 300,
    sequences: 'None'
  }

  primersRequest: AdaptoPrimersRequest = {
    dnaDesignName: this.dnaDesignName,
    primers: '',
    minTemperature: 52,
    maxTemperature: 58,
    saltConcentration: 0.05,
    dnaConcentration: 5,
    minPercentGC: 40,
    maxPercentGC: 60,
    minLength: 18,
    maxLength: 30,
    minDistance: 80,
    maxDistance: 600,
    dimerLength: 8,
    hairpinLength: 8,
    tailMinDistance: 100,
    type: 'Adapto',
    well: 'A1'
  }

  adaptoSegmentForm: object = {
    segment_request: this.segmentRequest,
    primers_request: this.primersRequest
  }

  rules: object = {
    study: [ { required: true } ],
    project: [ { required: true } ],
    dnaDesignName: [ { required: true } ]
  }

  $refs!: {
    segmentRequest: HTMLFormElement
  }

  /* submit Modal data */
  save () {
    this.$refs['segmentRequest'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: this.adaptoSegmentForm })
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
    return httpService.post('query/projectNameList', { study: this.segmentRequest.study })
      .then((res: any) => {
        this.segmentRequest.project = ''
        this.dnaDesignName = ''
        this.projectsList = res.data.rows
        this.assemblyList = []
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  /* Get list of assemblies */
  getAssemblyList () {
    this.$emit('loadOn')
    return httpService.post('query/projectAssemblyList', { study: this.segmentRequest.study, project: this.segmentRequest.project })
      .then((res: any) => {
        this.dnaDesignName = ''
        this.assemblyList = res.data.rows
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
          this.segmentRequest.study = this.modalData.saveAndNextData.studyName
          this.segmentRequest.project = this.modalData.saveAndNextData.projectName
          this.dnaDesignName = this.modalData.saveAndNextData.name
        }
      })
  }
}
</script>
