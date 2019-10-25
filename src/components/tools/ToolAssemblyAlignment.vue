<template>
  <div class="tool-study-collabotators-wrapper h-full flex flex-col">
    <div class="tool-study-collabotators flex-1">
      <el-row :gutter="20" class="mb-20 h-full flex flex-col">
        <el-col :span="24">
          <h3 class="text-black font-bold">Assembly alignment tool</h3>
        </el-col>
        <el-col :span="24" class="mb-40">
          <p v-html="modalData.dialogIntro"></p>
        </el-col>
        <el-form :model="AssemblyAlignmentToolForm" label-position="top" :rules="rules" ref="AssemblyAlignmentToolForm">
          <el-row :gutter="20" class="mb-30">
            <el-col :span="8">
              <el-form-item label="Study:" prop="studyName">
                <el-select
                  v-model="AssemblyAlignmentToolForm.studyName"
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
                  v-model="AssemblyAlignmentToolForm.projectName"
                  @change="getAssembly"
                  placeholder="Select project"
                  class="w-full"
                  :disabled="!AssemblyAlignmentToolForm.studyName">
                  <el-option v-for="project in projectList" :key="project.name" :label="project.name" :value="project.name"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="Assembly:" prop="assembly_name">
                <el-select
                  v-model="AssemblyAlignmentToolForm.assembly_name"
                  placeholder="Select assembly"
                  class="w-full"
                  @change="getAligner"
                  :disabled="!AssemblyAlignmentToolForm.projectName">
                  <el-option v-for="(item,index) in assemblyList" :key="index" :label="item.assembly" :value="item.assembly"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="24" class="mb-30 mt-20 justify-center flex">
                <el-input size="medium" v-model="alignerResponsData" class="w-300" ref="alignerDataInput">
              </el-input>
              <el-tooltip placement="top" :content="tootlipContent" effect="light">
                <el-button
                  @click="copyAlignerData"
                  @mouseleave.native="changeTooltipContent"
                  class="ml-10"
                  icon="el-icon-copy-document"
                  circle>
                </el-button>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-form>
        <el-col :span="24" class="mb-20 flex-1">
          <iframe src="https://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE_TYPE=BlastSearch&BLAST_SPEC=blast2seq&LINK_LOC=align2seq" class="assembly-alignment-iframe w-full h-full"></iframe>
        </el-col>
      </el-row>
    </div>

    <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { DialogBase, ToolAssemblyAlignments } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({ name: 'ToolAssemblyAlignment' })

export default class ToolAssemblyAlignment extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  studyList: string[] = []
  projectList: string[] = []
  assemblyList: string[] = []
  alignerResponsData: string = ''
  tootlipContent: string = 'Copy'

  AssemblyAlignmentToolForm: ToolAssemblyAlignments = {
    studyName: '',
    projectName: '',
    assembly_name: ''
  }

  rules: object = {
    studyName: { required: true, message: 'Study is required' },
    projectName: { required: true, message: 'Project name is required' },
    assembly_name: { required: true, message: 'Region is required' }
  }

  $refs!: {
    AssemblyAlignmentToolForm: HTMLFormElement
    alignerDataInput: HTMLInputElement
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
    return httpService.post('query/projectNameList', { study: this.AssemblyAlignmentToolForm.studyName })
      .then((res: any) => {
        this.AssemblyAlignmentToolForm.projectName = ''
        this.AssemblyAlignmentToolForm.assembly_name = ''
        this.projectList = res.data.rows
      })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  getAssembly () {
    this.$emit('loadOn')
    return httpService.post('query/projectAssemblyList', { project: this.AssemblyAlignmentToolForm.projectName })
      .then((res: any) => {
        this.AssemblyAlignmentToolForm.assembly_name = ''
        this.assemblyList = res.data.rows
      })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  getAligner () {
    this.$emit('loadOn')
    return httpService.post('query/assemblyAligner', this.AssemblyAlignmentToolForm)
      .then((res: any) => { this.alignerResponsData = res.data.lims_response })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  copyAlignerData () {
    this.$refs['alignerDataInput'].select()
    document.execCommand('copy')
    this.tootlipContent = 'Copied'
  }

  changeTooltipContent () {
    this.tootlipContent = 'Copy'
  }

  created () {
    this.getStudyList()
  }
}
</script>
