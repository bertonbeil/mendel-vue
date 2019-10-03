<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24">
        <h3 class="text-black font-bold">Import Assembly</h3>
      </el-col>
      <el-col :span="23">
        <p v-html="modalData.dialogIntro" class="mb-8 break-word"></p>
      </el-col>
      <el-col :span="1">
        <el-popover placement="top-start" width="300" trigger="hover">
          <i slot="reference" class="el-icon-info cursor-pointer text-green"></i>
          <div v-html="modalData.dialogInfo" class="break-word"></div>
        </el-popover>
      </el-col>
    </el-row>
    <div>
      <el-form :model="importAssemblyForm" label-position="top" :rules="rules" ref="importAssemblyForm">
        <el-row :gutter="10" class="mb-30">
          <el-col :span="8">
            <el-form-item label="Study:" prop="studyName">
              <el-select
                v-model="importAssemblyForm.studyName"
                @change="getProjectsList"
                placeholder="Select study"
                class="w-full">
                <el-option v-for="item in studyList" :key="item.name" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Project:" prop="project">
              <el-select
                v-model="importAssemblyForm.projectName"
                :disabled="!importAssemblyForm.studyName"
                placeholder="Select project"
                class="w-full">
                <el-option v-for="item in projectsList" :key="item.name" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Assembly name:" prop="name">
              <el-input
                v-model="importAssemblyForm.name"
                :disabled="!importAssemblyForm.projectName"
                placeholder="Enter or choose an assembly name">
              </el-input>
              <div>
                <p>If you are importing a completely new assembly, use a short descriptive name. If you are importing a variant of an existing assembly, use a standardized version naming (e.g. Assembly_v2)</p>
              </div>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="Assembly description:" prop="description">
              <el-input
                v-model="importAssemblyForm.description"
                :disabled="!importAssemblyForm.name"
                placeholder="Enter a detailed description of how and why you designed the assembly outside MenDEL">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="mb-30">
          <el-col :span="24" class="mb-40">
            <h4 class="text-xl text-black mt-3">Sequence</h4>
            <p>Provide the CDS sequence here. You can either paste the DNA sequence, or upload a fasta file.</p>
          </el-col>

          <el-col :span="24" class="mb-30">
            <h4 class="text-xl text-black mt-3">Paste DNA sequence:</h4>
            <p class="break-normal mb-30">Define the genome and location of your locus of interest, or provide the sequence as text or a fasta file.</p>
            <el-input
              placeholder="Alternatively you can paste the locus sequence in fasta format"
              v-model="importAssemblyForm.pathway"
              type="textarea"
              resize="none"
              :rows="4">
            </el-input>
          </el-col>

          <el-col :span="24">
            <h4 class="text-xl text-black mt-3">Upload fasta:</h4>
            <UploadFile :dna-sequence.sync="importAssemblyForm.pathway"  :accept='".fa,.fasta"' />
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
      <el-button type="primary" @click="save">Save and segment</el-button>
      <el-button type="success" @click="save">Save</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { DialogBase, importAssembly } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({ name: 'ImportAssembly' })
export default class ImportAssembly extends Vue {
  @Prop({ required: true }) modalData!: DialogBase

  studyList: string[] = []
  projectsList: string[] = []

  importAssemblyForm: importAssembly = {
    studyName: '',
    projectName: '',
    name: '',
    description: '',
    pathway: '',
    parts: 'None'
  }

  rules: object = {
    studyName: [{ required: true, message: 'Study name is required' }],
    projectName: [{ required: true, message: 'Project name is required' }],
    name: [{ required: true, message: 'Assembly name is required' }],
    description: [{ required: true, message: 'Description is required' }]
  }

  $refs!: {
    importAssemblyForm: HTMLFormElement
  }

  get sendData () {
    return this.importAssemblyForm
  }

  /* submit Modal data */
  save (next?: string) {
    return httpService.post('query/assemblyNameChecker', {
      studyName: this.importAssemblyForm.studyName,
      projectName: this.importAssemblyForm.projectName,
      name: this.importAssemblyForm.name
    }).then((res: any) => {
      if (res.data.valid === 'false') this.responseMessage()
      else {
        this.$refs['importAssemblyForm'].validate((valid: boolean) => {
          if (valid) this.$emit('save', { data: this.sendData })
          else return false
        })
      }
    })
  }

  /* load Modal data -> Get list of study */
  getStudyList () {
    this.$emit('loadOn')
    return httpService.get('query/studyNameList')
      .then((res: any) => { this.studyList = res.data.rows })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  /* Get list of projects */
  getProjectsList () {
    this.$emit('loadOn')
    return httpService.post('query/projectNameList', { study: this.importAssemblyForm.studyName })
      .then((res: any) => {
        this.importAssemblyForm.projectName = ''
        this.projectsList = res.data.rows
      })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  /* response viewer */
  responseMessage () {
    this.$confirm(`Assembly name ${this.importAssemblyForm.name} has been used before. Please specify new name`, 'Error', { type: 'error', center: true })
  }

  created () {
    this.getStudyList()
  }
}
</script>
