<template>
  <div class="tool-visualizer-wrapper">
    <div class="tool-visualizer">
      <el-row :gutter="20" class="mb-20">
        <el-col :span="24">
          <h3 class="text-black font-bold mb-20">Assembly Visualizer Tool</h3>
        </el-col>
        <el-form :model="ToolVisualizersForm" label-position="top" :rules="rules" ref="ToolVisualizersForm">
          <el-row :gutter="20" class="mb-30">
            <el-col :span="8">
              <el-form-item label="Study:" prop="studyName">
                <el-select
                  v-model="ToolVisualizersForm.studyName"
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
                  v-model="ToolVisualizersForm.projectName"
                  @change="getAssembly"
                  placeholder="Select project"
                  class="w-full"
                  :disabled="!ToolVisualizersForm.studyName">
                  <el-option v-for="project in projectList" :key="project.name" :label="project.name" :value="project.name"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="Assembly:" prop="assembly_name">
                <el-select
                  v-model="ToolVisualizersForm.assembly_name"
                  placeholder="Select assembly"
                  class="w-full"
                  @change="$refs.visualizer.vizualizer(ToolVisualizersForm)"
                  :disabled="!ToolVisualizersForm.projectName">
                  <el-option v-for="(item,index) in assemblyList" :key="index" :label="item.assembly" :value="item.assembly"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-col :span="24">
          <div ref="assemblyVisualizer">
            <Visualizer ref="visualizer" />
          </div>
        </el-col>
      </el-row>

      <!-- Modal action buttons -->
      <div slot="footer" class="text-center ">
        <el-button type="danger" @click="$emit('close')">Cancel</el-button>
        <el-button type="primary" @click="generateScreenshot">Generate</el-button>
      </div>

      <div v-if="isGeneratedScreenshot" class="mt-20 p-10 flex flex-col items-center bg-grey-light">
        <h3>Visualization</h3>
        <img class='visualization-image' :src='canvasVisualizate'>
        <p class='download-visualization-link'>
          <a class='download-link font-bold' :href='canvasVisualizate' :download="ToolVisualizersForm.assembly_name">
            <el-button type="primary">save</el-button>
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { ToolVisualizers } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'
import html2canvas from 'html2canvas'

@Component({ name: 'ToolVisualizer' })

export default class ToolVisualizer extends Vue {
  @Prop({ required: true }) isLoading!: boolean

  studyList: string[] = []
  projectList: string[] = []
  assemblyList: string[] = []
  visualizerData: string = ''
  isGeneratedScreenshot: boolean = false
  canvasVisualizate: string = ''

  ToolVisualizersForm: ToolVisualizers = {
    studyName: '',
    projectName: '',
    assembly_name: ''
  }

  rules: object = {
    studyName: { required: true, message: 'Study is required' },
    projectName: { required: true, message: 'Project name is required' },
    assembly_name: { required: true, message: 'Assembly is required' }
  }

  $refs!: {
    ToolVisualizersForm: HTMLFormElement
    visualizer: HTMLFormElement
    assemblyVisualizer: HTMLDivElement
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
    return httpService.post('query/projectNameList', { study: this.ToolVisualizersForm.studyName })
      .then((res: any) => {
        this.ToolVisualizersForm.projectName = ''
        this.ToolVisualizersForm.assembly_name = ''
        this.projectList = res.data.rows
      })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  getAssembly () {
    this.$emit('loadOn')
    return httpService.post('query/projectAssemblyList', { project: this.ToolVisualizersForm.projectName })
      .then((res: any) => {
        this.ToolVisualizersForm.assembly_name = ''
        this.assemblyList = res.data.rows
      })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  getVisualizerData () {
    this.$emit('loadOn')
    return httpService.post('query/assemblyVisualizer', this.ToolVisualizersForm)
      .then((res: any) => { this.visualizerData = res.data.lims_response.elements })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  generateScreenshot () {
    this.$refs['ToolVisualizersForm'].validate((valid: boolean) => {
      if (valid) {
        this.$emit('loadOn')
        html2canvas(this.$refs.assemblyVisualizer).then((canvas: any) => {
          this.canvasVisualizate = canvas.toDataURL('image/jpeg')
          this.isGeneratedScreenshot = true
        }).catch((err: any) => { throw new Error(err) })
          .finally(() => this.$emit('loadOff'))
      }
    })
  }

  created () {
    this.getStudyList()
  }
}
</script>
