<template>
  <div>
    <!-- Main modal content -->
    <div class="mb-30">
      <el-row :gutter="20">
          <el-form :model="segment_request" label-position="top" :rules="rules" ref="segment_request">
            <el-row :gutter="20" class="mb-30">
              <el-col :span="8">
                <el-form-item label="Study name:" prop="studyName">
                  <el-select v-model="segment_request.studyName" @change="getProjectsList" placeholder="Select study" class="w-full">
                    <el-option v-for="(item, i) in studyList" :key="i" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Project name:" prop="projectName">
                  <el-select v-model="segment_request.projectName" @change="getRegionList" placeholder="Select project" class="w-full">
                    <el-option v-for="(item, i) in projectsList" :key="i" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Assembly name:" prop="dnaDesignName">
                  <el-select v-model="segment_request.dnaDesignName" placeholder="Select assembly" class="w-full">
                    <el-option v-for="(item, i) in assemblyList" :key="i" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="mb-30">
              <el-col :span="8">
                <el-form-item label="Action:" prop="action">
                  <el-select
                    v-model="adaptoSegmentsManipulationForm.action"
                    @change="getDnaSegmentList"
                    placeholder="Select region"
                    class="w-full">
                    <el-option v-for="item in actionList" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="First:" prop="firstSegmentIdx">
                  <el-select v-model="segment_request.firstSegmentIdx" placeholder="Select segment" class="w-full">
                    <el-option v-for="item in dnaSegmentList" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Last:" prop="lastSegmentIdx">
                  <el-select v-model="segment_request.lastSegmentIdx" placeholder="Select segment" class="w-full">
                    <el-option v-for="item in dnaSegmentList" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
      </el-row>
    </div>
    <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="success" v-if="adaptoSegmentsManipulationForm.action === 'Replace'">Add</el-button>
      <el-button type="warning" v-if="adaptoSegmentsManipulationForm.action === 'Replace'">Delete</el-button>
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
      <el-button type="primary" @click="save">Save</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { httpService } from '@/services/http.service'
import {
  DialogBase,
  AdaptoSegmentsManipulation,
  AdaptoSegmentsManipulationSegmentRequest,
  AdaptoSegmentsManipulationPrimersRequest
} from '@/utils/interfaces'

@Component({ name: 'CreateAdaptoSegmentsManipulation' })

export default class CreateAdaptoSegmentsManipulation extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  studyList: string[] = []
  projectsList: string[] = []
  assemblyList: string[] = []
  actionList: string[] = [ 'Delete', 'Swap', 'Replace' ]
  dnaSegmentList: any = []

  segment_request: AdaptoSegmentsManipulationSegmentRequest = {
    studyName: '',
    projectName: '',
    dnaDesignName: '',
    firstSegmentIdx: null,
    lastSegmentIdx: null
  }

  primers_request: AdaptoSegmentsManipulationPrimersRequest = {
    studyName: '',
    projectName: '',
    dnaDesignName: '',
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

  adaptoSegmentsManipulationForm: AdaptoSegmentsManipulation = {
    requestType: '',
    action: '',
    segment_request: this.segment_request,
    primers_request: this.primers_request
  }

  rules: object = {
    studyName: [ { required: true } ],
    projectName: [ { required: true } ],
    dnaDesignName: [ { required: true } ],
    // action: [ { required: true } ],
    firstSegmentIdx: [ { required: true } ],
    lastSegmentIdx: [ { required: true } ]
  }

  $refs!: {
    segment_request: HTMLFormElement
  }

  @Watch('segment_request.studyName')
  onChangeStudyName () {
    this.primers_request.studyName = this.segment_request.studyName
  }

  @Watch('segment_request.projectName')
  onChangeProjectName () {
    this.primers_request.projectName = this.segment_request.projectName
  }

  @Watch('segment_request.dnaDesignName')
  onChangeDnaDesignName () {
    this.primers_request.dnaDesignName = this.segment_request.dnaDesignName
  }

  get sendData () {
    return { ...this.adaptoSegmentsManipulationForm }
  }

  /* submit Modal data */
  save () {
    this.$refs['segment_request'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: JSON.stringify(this.adaptoSegmentsManipulationForm) })
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
    return httpService.post('query/projectNameList', { study: this.segment_request.studyName })
      .then((res: any) => {
        this.projectsList = []
        this.assemblyList = []
        this.segment_request.projectName = ''
        this.segment_request.dnaDesignName = ''
        this.adaptoSegmentsManipulationForm.requestType = ''
        this.adaptoSegmentsManipulationForm.action = ''
        res.data.rows.map((item: any) => this.projectsList.push(item.name))
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  /* Get list of assemblies */
  getRegionList () {
    this.$emit('loadOn')
    return httpService.post('query/locusRegionRetriever', {
      study: this.segment_request.studyName,
      project: this.segment_request.projectName
    }).then((res: any) => {
      this.assemblyList = []
      this.segment_request.dnaDesignName = ''
      this.adaptoSegmentsManipulationForm.requestType = ''
      this.adaptoSegmentsManipulationForm.action = ''
      this.assemblyList = res.data.regions
      this.$emit('loadOff')
    }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  getDnaSegmentList ($event: any) {
    this.$emit('loadOn')
    return httpService.post('query/dnaSegmentList', {
      study: this.segment_request.studyName,
      project: this.segment_request.projectName,
      assembly: this.segment_request.dnaDesignName
    }).then((res: any) => {
      res.data.rows.map((item: any) => this.dnaSegmentList.push(item.segment))
      this.adaptoSegmentsManipulationForm.requestType = `Adapto${$event}SegmentRequest`
      this.$emit('loadOff')
    }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  created () {
    this.getStudyList()
  }
}
</script>
