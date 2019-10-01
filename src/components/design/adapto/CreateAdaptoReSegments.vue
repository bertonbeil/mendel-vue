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
            <el-form-item label="Study name:" prop="studyName">
              <el-select
                v-model="segmentRequest.studyName"
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
                v-model="segmentRequest.projectName"
                @change="getAssemblyList"
                :disabled="!segmentRequest.studyName"
                placeholder="Select project"
                class="w-full">
                <el-option v-for="(item, i) in projectsList" :key="i" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Assembly name:" prop="dnaDesignName">
              <el-select
                v-model="dnaDesignName"
                :disabled="!segmentRequest.projectName"
                placeholder="Select assembly"
                class="w-full">
                <el-option v-for="(item, i) in assemblyList" :key="i" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="mb-30">
          <el-col :span="8">
            <el-form-item label="First:" prop="firstSegmentIdx">
              <el-select
                v-model="segmentRequest.firstSegmentIdx"
                :disabled="!dnaDesignName"
                placeholder="Select segment"
                class="w-full">
                <el-option v-for="(item, i) in dnaSegmentsList" :key="i" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Last:" prop="lastSegmentIdx">
              <el-select
                v-model="segmentRequest.lastSegmentIdx"
                :disabled="!dnaDesignName"
                placeholder="Select segment"
                class="w-full">
                <el-option v-for="(item, i) in dnaSegmentsList" :key="i" :label="item" :value="item"></el-option>
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
                <div class="break-word">All vectors are kanamycin resistant for bacterial selection, and are inducible to high copy number in bacteria for isolation. All contain CEN/ARS for low copy yeast maintenance.</div>
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
            <el-upload action="https://jsonplaceholder.typicode.com/posts/" :file-list="fileList" class="mt-10" :on-change="uploadBedFile">
              <el-button size="mini" type="primary">Click to upload</el-button>
            </el-upload>
          </el-col>

          <el-col :span="24" class="mb-30">
            <h4 class="text-xl text-black mt-3">Segment parameters:</h4>
            <p class="break-normal">You can define parameters for segmentation here. The defaults should work for most loci to minimize number of segments and maximize efficiency of assembly.</p>
          </el-col>

          <el-col :span="12">
            <p class="text-xl text-black mb-10">Segment length</p>
            <el-form-item label="Minimum:" class="form-item-label flex items-center text-sm" size="mini">
              <el-input-number v-model="segmentRequest.minLen" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="Maximum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="segmentRequest.maxLen" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="Optimum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="segmentRequest.optLen" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <p class="text-xl text-black mb-10">Overlap length</p>
            <el-form-item label="Minimum:" class="form-item-label flex items-center text-sm" size="mini">
              <el-input-number v-model="segmentRequest.minOverlap" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="Maximum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="segmentRequest.maxOverlap" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="Optimum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="segmentRequest.optOverlap" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
          </el-col>

          <el-col :span="24" class="mb-30">
            <h4 class="text-xl text-black mt-3">Primer parameters:</h4>
            <p class="break-normal">You can define your desired parameters for primer design here. The defaults should generally work well for most amplicons amplified with modern high-fidelity polymerases.</p>
          </el-col>

          <el-col :span="6">
            <p class="text-xl text-black mb-10">Primer length:</p>
            <el-form-item label="Minimum:" class="form-item-label flex items-center text-sm" size="mini">
              <el-input-number v-model="primersRequest.minLength" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="Maximum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="primersRequest.maxLength" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <p class="text-xl text-black mb-10">Annealing temperature:</p>
            <el-form-item label="Minimum:" class="form-item-label flex items-center text-sm" size="mini">
              <el-input-number v-model="primersRequest.minTemperature" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="Maximum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="primersRequest.maxTemperature" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <p class="text-xl text-black mb-10">Percent GC:</p>
            <el-form-item label="Minimum:" class="form-item-label flex items-center text-sm" size="mini">
              <el-input-number v-model="primersRequest.minPercentGC" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="Maximum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="primersRequest.maxPercentGC" class="ml-10" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <p class="text-xl text-black mb-10">Base composition:</p>
            <el-form-item label="Minimum:" class="form-item-label flex items-center text-sm" size="mini">
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
  dnaSegmentsList: number[] = []
  restrictionEnzymes: object[] = []
  segmentVegasAdapters: boolean = false
  type: string = ''
  dnaDesignName: string = ''
  fileList: object[] = []
  bedFile: string = ''

  segmentRequest: AdaptoSegmentRequest = {
    studyName: '',
    projectName: '',
    assemblyVectorName: 'URA3',
    dnaDesignName: this.dnaDesignName,
    assembly: this.dnaDesignName,
    mask: '',
    maxLen: 1000,
    minLen: 5000,
    optLen: 5000,
    minOverlap: 100,
    maxOverlap: 600,
    optOverlap: 300,
    sequences: 'None',
    firstSegmentIdx: null,
    lastSegmentIdx: null
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
    requestType: 'AdaptoResegmentRequest',
    segment_request: this.segmentRequest,
    primers_request: this.primersRequest
  }

  rules: object = {
    studyName: [ { required: true, message: 'Study name is required' } ],
    projectName: [ { required: true, message: 'Project name is required' } ],
    dnaDesignName: [ { required: true, message: 'Assembly name is required' } ],
    firstSegmentIdx: [ { required: true, message: 'First segment index name is required' } ],
    lastSegmentIdx: [ { required: true, message: 'Last segment index name is required' } ]
  }

  $refs!: {
    segmentRequest: HTMLFormElement
  }

  @Watch('dnaDesignName')
  onChangeDnaDesignName () {
    this.primersRequest.dnaDesignName = this.dnaDesignName
    this.segmentRequest.dnaDesignName = this.dnaDesignName
    this.segmentRequest.assembly = this.dnaDesignName
  }

  get sendData () {
    return this.adaptoSegmentForm
  }

  /* submit Modal data */
  save (next?: string) {
    this.$refs['segmentRequest'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: JSON.stringify(this.sendData) }, next === 'next' ? this.modalData.saveAndNext : null)
      else return false
    })
  }

  uploadBedFile (file: any) {
    const fileReader = new FileReader()
    fileReader.readAsText(file.raw)
    fileReader.onload = (e: any) => { this.segmentRequest.mask = e.target.result }
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
    return httpService.post('query/projectNameList', { study: this.segmentRequest.studyName })
      .then((res: any) => {
        this.projectsList = []
        this.assemblyList = []
        this.segmentRequest.projectName = ''
        this.segmentRequest.dnaDesignName = ''
        res.data.rows.map((item: any) => this.projectsList.push(item.name))
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  /* Get list of assemblies */
  getAssemblyList () {
    this.$emit('loadOn')
    return httpService.post('query/projectAssemblyList', { study: this.segmentRequest.studyName, project: this.segmentRequest.projectName })
      .then((res: any) => {
        this.assemblyList = []
        this.segmentRequest.dnaDesignName = ''
        res.data.rows.map((item: any) => this.assemblyList.push(item.assembly))
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  /* Get list of dna segments */
  getDnaSegmentList () {
    this.$emit('loadOn')
    return httpService.post('query/dnaSegmentList', {
      study: this.segmentRequest.studyName,
      project: this.segmentRequest.projectName,
      assembly: this.dnaDesignName
    }).then((res: any) => {
      this.dnaSegmentsList = []
      res.data.rows.map((item: any) => this.dnaSegmentsList.push(item.segment))
      this.$emit('loadOff')
    }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  created () {
    this.getStudyList()
      .then(() => {
        if (this.modalData.hasOwnProperty('saveAndNextData')) {
          this.segmentRequest.studyName = JSON.parse(this.modalData.saveAndNextData).studyName
          this.segmentRequest.projectName = JSON.parse(this.modalData.saveAndNextData).projectName
          this.dnaDesignName = JSON.parse(this.modalData.saveAndNextData).name
        }
      })
  }
}
</script>
