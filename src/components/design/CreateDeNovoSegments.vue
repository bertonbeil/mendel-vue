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
              <el-select v-model="denovoSegmentForm.studyName" @change="getProjectsList" placeholder="Select study" class="w-full">
                <el-option v-for="item in studyList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Project name:" prop="projectName">
              <el-select v-model="denovoSegmentForm.projectName" @change="getAssemblyList" placeholder="Select project" class="w-full">
                <el-option v-for="item in projectsList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Assembly name:" prop="assembly">
              <el-select v-model="denovoSegmentForm.assembly" @change="getRestrictionEnzymeList" placeholder="Select assembly" class="w-full">
                <el-option v-for="item in assemblyList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24" class="mb-30">
            <h4 class="text-xl text-black mt-3">Segmentation options</h4>
            <p class="break-normal">Select options for this segmentation, such as assembly vector to be used and any desired flanking restriction sites.</p>
          </el-col>

          <el-col :span="8">
            <h4 class="relative inline-block pr-30 text-xl text-black mt-3">Segmentation options:
              <el-popover class="absolute top-0 right-0" placement="top-start" width="300" trigger="hover">
                <i slot="reference" class="el-icon-info cursor-pointer text-green"></i>
                <div>Choose the features of your assembly vector. Yeast CEN/ARS is automatically assigned. For assemblies 30kb high copy number bacterial vector is permissible.</div>
              </el-popover>
            </h4>
            <el-row class="mt-10">
              <el-col :span="9">
                <p>Yeast marker</p>
              </el-col>
              <el-col :span="15">
                <el-radio-group v-model="denovoSegmentForm.yeastMarker" size="mini">
                  <el-radio-button label="URA3">URA3</el-radio-button>
                  <el-radio-button label="LEU2">LEU2</el-radio-button>
                </el-radio-group>
              </el-col>
            </el-row>
            <el-row class="mt-10">
              <el-col :span="9">
                <p>Bacterial copy #</p>
              </el-col>
              <el-col :span="15">
                <el-radio-group v-model="denovoSegmentForm.bacterialCopy" size="mini">
                  <el-radio-button label="High (pUC)">High (pUC)</el-radio-button>
                  <el-radio-button label="Low (BAC)">Low (BAC)</el-radio-button>
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
                <el-form-item prop="openReValue">
                  <el-select v-model="denovoSegmentForm.openReValue" placeholder="5' RE" class="w-full">
                    <el-option v-for="item in restrictionEnzymes" :key="item.name" :label="item.name" :value="item.sequence"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="closeReValue">
                  <el-select v-model="denovoSegmentForm.closeReValue" placeholder="3' RE" class="w-full">
                    <el-option v-for="item in restrictionEnzymes" :key="item.name" :label="item.name" :value="item.sequence"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <h4 class="text-xl text-black mt-3">Assembly length (bp):</h4>
            <el-input-number v-model="denovoSegmentForm.assemblyLength" :min="0" :max="10000"></el-input-number>
          </el-col>

          <el-col :span="24" class="my-30">
            <h4 class="text-xl text-black mt-3">Segment parameters</h4>
            <p class="break-normal">You can define parameters for segmentation here. The defaults should work for most loci to minimize number of segments and maximize efficiency of assembly.</p>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
      <el-button type="success" @click="save(true)">Save and Export</el-button>
      <el-button type="primary" @click="save">Save</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { DialogBase } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({ name: 'CreateDeNovoSegments' })

export default class CreateDeNovoAssembly extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  studyList: string[] = []
  projectsList: string[] = []
  assemblyList: string[] = []
  restrictionEnzymes: object[] = []

  denovoSegmentForm: any = {
    studyName: '',
    projectName: '',
    assembly: '',
    yeastMarker: 'URA3',
    bacterialCopy: 'High (pUC)',
    openReValue: '',
    closeReValue: '',
    assemblyLength: 0
  }

  rules: any = {
    studyName: [ { required: true } ],
    projectName: [ { required: true } ],
    assembly: [ { required: true } ]
  }

  $refs!: {
    denovoSegmentForm: any
  }

  /* submit Modal data */
  save (next: any) {
    this.$refs['denovoSegmentForm'].validate((valid: any) => {
      if (valid) this.$emit('save', { data: this.denovoSegmentForm }, next === true ? this.modalData.saveAndNext : null)
      else return false
    })
  }

  /* load Modal data -> Get list of study */
  getStudyList () {
    this.$emit('loadOn')
    return httpService.get('query/studyNameList')
      .then((res: any) => {
        res.data.rows.map((studyName: any) => this.studyList.push(studyName.name))
        this.$emit('loadOff')
      })
  }

  /* Get list of projects */
  getProjectsList () {
    this.$emit('loadOn')
    return httpService.post('query/projectNameList', { study: this.denovoSegmentForm.studyName })
      .then((res: any) => {
        res.data.rows.map((project: any) => this.projectsList.push(project.name))
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  /* Get list of assemblies */
  getAssemblyList () {
    this.$emit('loadOn')
    return httpService.post('query/projectAssemblyList', { study: this.denovoSegmentForm.studyName, project: this.denovoSegmentForm.projectName })
      .then((res: any) => {
        res.data.rows.map((name: any) => this.assemblyList.push(name.assembly))
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  /* load Modal data -> Get list of restriction enzymes */
  getRestrictionEnzymeList () {
    return httpService.get('query/restrictionEnzymeList').then((res: any) => { this.restrictionEnzymes = res.data.rows })
  }

  created () {
    this.getStudyList()
      .then(() => { if (this.modalData.hasOwnProperty('saveAndNextData')) this.denovoSegmentForm.study = this.modalData.saveAndNextData.study })
  }
}
</script>
