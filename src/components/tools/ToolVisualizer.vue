<template>
  <div class="tool-visualizer-wrapper">
    <div class="tool-visualizer">
      <el-row :gutter="20" class="mb-20">
        <el-col :span="24">
          <h3 class="text-black font-bold">Assembly Visualizer Tool</h3>
        </el-col>
        <el-form
          :model="ToolVisualizersForm"
          label-position="top"
          :rules="rules"
          ref="ToolVisualizersForm"
        >
          <el-row :gutter="20" class="mb-30">
            <el-col :span="8">
              <el-form-item label="Study:" prop="studyName">
                <el-select
                  v-model="ToolVisualizersForm.studyName"
                  @change="getProjects"
                  placeholder="Select study"
                  class="w-full"
                >
                  <el-option
                    v-for="study in studyList"
                    :key="study.name"
                    :label="study.name"
                    :value="study.name"
                  ></el-option>
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
                  :disabled="!ToolVisualizersForm.studyName"
                >
                  <el-option
                    v-for="project in projectList"
                    :key="project.name"
                    :label="project.name"
                    :value="project.name"
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
                  @change="getAligner"
                  :disabled="!ToolVisualizersForm.projectName"
                >
                  <el-option
                    v-for="(item,index) in assemblyList"
                    :key="index"
                    :label="item.assembly"
                    :value="item.assembly"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

    <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { ToolVisualizers } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({ name: 'ToolVisualizer' })
export default class ToolVisualizer extends Vue {
  @Prop({ required: true }) isLoading!: boolean;

  studyList: string[] = []
  projectList: string[] = []
  assemblyList: string[] = []
  alignerResponsData: string = ''

  ToolVisualizersForm: ToolVisualizers = {
    studyName: '',
    projectName: '',
    assembly_name: ''
  };

  rules: object = {
    studyName: { required: true, message: 'Study is required' },
    projectName: { required: true, message: 'Project name is required' },
    assembly_name: { required: true, message: 'Region is required' }
  };

  $refs!: {
    ToolVisualizersForm: HTMLFormElement;
  };

  getAligner () {
    this.$emit('loadOn')
    return httpService
      .post('query/assemblyAligner', this.ToolVisualizersForm)
      .then((res: any) => {
        this.alignerResponsData = res.data.lims_response
      })
      .catch((err: any) => {
        throw new Error(err)
      })
      .finally(() => this.$emit('loadOff'))
  }

  getAssembly () {
    this.$emit('loadOn')
    return httpService
      .post('query/projectAssemblyList', {
        project: this.ToolVisualizersForm.projectName
      })
      .then((res: any) => {
        this.assemblyList = res.data.rows
      })
      .catch((err: any) => {
        throw new Error(err)
      })
      .finally(() => this.$emit('loadOff'))
  }

  getProjects () {
    this.$emit('loadOn')
    return httpService
      .post('query/projectNameList', {
        study: this.ToolVisualizersForm.studyName
      })
      .then((res: any) => {
        this.projectList = res.data.rows
      })
      .catch((err: any) => {
        throw new Error(err)
      })
      .finally(() => this.$emit('loadOff'))
  }

  getStudyList () {
    this.$emit('loadOn')
    return httpService
      .get('query/studyNameList')
      .then((res: any) => {
        this.studyList = res.data.rows
      })
      .catch((err: any) => {
        throw new Error(err)
      })
      .finally(() => this.$emit('loadOff'))
  }

  created () {
    this.getStudyList()
  }
}
</script>
