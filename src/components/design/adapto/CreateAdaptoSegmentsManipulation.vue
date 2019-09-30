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
                <el-select
                  v-model="segment_request.projectName"
                  @change="getRegionList"
                  placeholder="Select project"
                  :disabled="!segment_request.studyName"
                  class="w-full">
                  <el-option v-for="(item, i) in projectsList" :key="i" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Assembly name:" prop="dnaDesignName">
                <el-select
                  v-model="segment_request.dnaDesignName"
                  placeholder="Select assembly"
                  :disabled="!segment_request.projectName"
                  class="w-full">
                  <el-option v-for="(item, i) in assemblyList" :key="i" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="mb-30">
            <el-col :span="8">
              <el-form-item label="Action:">
                <el-select
                  v-model="adaptoSegmentsManipulationForm.action"
                  @change="getDnaSegmentList"
                  placeholder="Select region"
                  :disabled="!segment_request.dnaDesignName"
                  class="w-full"
                  required>
                  <el-option v-for="item in actionList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="First:" prop="firstSegmentIdx">
                <el-select
                  v-model="segment_request.firstSegmentIdx"
                  placeholder="Select segment"
                  :disabled="!adaptoSegmentsManipulationForm.action"
                  class="w-full">
                  <el-option v-for="item in dnaSegmentList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Last:" prop="lastSegmentIdx">
                <el-select
                  v-model="segment_request.lastSegmentIdx"
                  placeholder="Select segment"
                  :disabled="!segment_request.firstSegmentIdx"
                  class="w-full">
                  <el-option v-for="item in dnaSegmentList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20" class="mb-30" v-show="isActionReplace">
            <el-col :span="8">
              <el-form-item label="New name:">
                <el-input v-model="segment_request.newName" placeholder="New name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>

      <el-row :gutter="20" v-if="isActionReplace">
        <draggable class="p-3" v-model="replaceRows" handle='.el-icon-more'>
          <div v-for="(replaceRow, index) in replaceRows" :key="replaceRow.id">
            <el-row>
              <el-col :span="22">
                <ReplaceRows
                  :replace-row.sync="replaceRows[index]"
                  :studyName='segment_request.studyName'
                  :projectName='segment_request.projectName'
                  :typesList='customSegmentTypeList' />
              </el-col>
              <el-col :span="2" class="flex justify-center">
                <el-button type="danger" icon="el-icon-delete" circle @click="deleteRow(index)"></el-button>
                <i class="el-icon-more cursor-pointer"></i>
              </el-col>
            </el-row>
          </div>
        </draggable>
      </el-row>
    </div>
    <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="primary" v-if="isActionReplace" @click="addRow">Add</el-button>
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
      <el-button type="success" @click="save">Save</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { httpService } from '@/services/http.service'
import ReplaceRows from '../../shared/SegmentManipulation/ReplaceRows.vue'
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
  customSegmentTypeList: string[] = []
  dnaSegmentList: any = []

  replaceRowMock = {
    study: '',
    project: '',
    name: '',
    value: '',
    segment_type: '',
    created_by: '',
    timestamp: '',
    description: ''
  }

  replaceRows: object[] = [{
    study: '',
    project: '',
    name: '',
    value: '',
    segment_type: '',
    created_by: '',
    timestamp: '',
    description: '',
    id: Date.now()
  }]

  segment_request: AdaptoSegmentsManipulationSegmentRequest = {
    studyName: '',
    projectName: '',
    dnaDesignName: '',
    firstSegmentIdx: null,
    lastSegmentIdx: null,
    newName: '',
    customSegments: []
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
    firstSegmentIdx: [ { required: true } ],
    lastSegmentIdx: [ { required: true } ]
  }

  $refs!: {
    segment_request: HTMLFormElement
  }

  @Watch('segment_request', { deep: true })
  onChangeSegmentRequest () {
    this.primers_request.studyName = this.segment_request.studyName
    this.primers_request.projectName = this.segment_request.projectName
    this.primers_request.dnaDesignName = this.segment_request.dnaDesignName
  }

  @Watch('replaceRows', { deep: true })
  onChangeReplaceRows () {
    this.segment_request.customSegments = []
    this.replaceRows.map((item: any) => {
      this.segment_request.customSegments.push({ sequence: item.value, direction: item.direction })
    })
  }

  get sendData () {
    return this.adaptoSegmentsManipulationForm
  }

  get isActionReplace () {
    return this.adaptoSegmentsManipulationForm.action === 'Replace'
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
      if (this.adaptoSegmentsManipulationForm.action !== 'Replace') {
        delete this.segment_request.newName
        delete this.segment_request.customSegments
      }
      this.$emit('loadOff')
    }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  getCustomSegmentTypeList () {
    return httpService.get('query/customSegmentTypeList')
      .then((res: any) => {
        res.data.rows.map((item: any) => this.customSegmentTypeList.push(item.name))
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  addRow () {
    this.replaceRows.push({ ...this.replaceRowMock, id: Date.now() })
  }

  deleteRow (index: number) {
    this.replaceRows.splice(index, 1)
  }

  created () {
    this.getStudyList()
    this.getCustomSegmentTypeList()
    if (this.adaptoSegmentsManipulationForm.action !== 'Replace') {
      delete this.segment_request.newName
      delete this.segment_request.customSegments
    }
  }
}
</script>
