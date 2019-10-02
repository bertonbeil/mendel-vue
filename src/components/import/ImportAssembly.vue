<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="23">
        <p v-html="modalData.dialogIntro" class="mb-8"></p>
      </el-col>
      <el-col :span="1">
        <el-popover placement="top-start" width="300" trigger="hover">
          <i slot="reference" class="el-icon-info cursor-pointer text-green"></i>
          <div v-html="modalData.dialogInfo"></div>
        </el-popover>
      </el-col>
    </el-row>
    <div class="mb-30">
      <el-form
        :model="importAssemblyForm"
        label-position="top"
        :rules="rules"
        ref="importAssemblyForm">
        <el-row :gutter="10">

          <el-col :span="8">
            <el-form-item label="Study:" prop="study">
              <el-select
                v-model="importAssemblyForm.study"
                @change="getProjectsList"
                placeholder="Select Study.."
                class="w-full">
                <el-option
                  v-for="(item, i) in studyList"
                  :key="i"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="Project:" prop="project">
              <el-select
                v-model="importAssemblyForm.projectName"
                placeholder="Select Project.."
                class="w-full"
                :disabled="!importAssemblyForm.study">
                <el-option
                  v-for="(item, i) in projectsList"
                  :key="i"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="Assembly name:" prop="name">
              <el-input
                placeholder="Enter or choose an assembly name .."
                v-model="importAssemblyForm.name"
              ></el-input>
              <div class="sup_title">
                <p>
                  If you are importing a completely new assembly,
                  use a short descriptive name. If you are importing a variant
                  of an existing assembly, use a standardized version naming (e.g. Assembly_v2)
                </p>
              </div>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="Assembly description:" prop="description">
              <el-input
                placeholder="Enter a detailed description of how and why you designed the assembly outside MenDEL "
                v-model="importAssemblyForm.description">
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
              placeholder="Alternatively you can paste the locus sequence in fasta format…"
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
      <el-button type="primary" @click="save">Save and import another CDS</el-button>
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
  fileList: any = []

  importAssemblyForm: importAssembly = {
    study: '',
    projectName: '',
    name: '',
    description: '',
    pathway: '',
    parts: 'None'
  }

  rules: object = {
    study: [{ required: true }],
    projectName: [{ required: true }],
    name: [{ required: true }],
    description: [{ required: true }]
  }

  $refs!: {
    importAssemblyForm: HTMLFormElement
  }

  get sendData () {
    return this.importAssemblyForm
  }

  /* submit Modal data */
  save (next?: string) {
    this.$refs['importAssemblyForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: JSON.stringify(this.sendData) }, next === 'next' ? this.modalData.saveAndNext : null)
      else return false
    })
  }

  /* load Modal data -> Get list of study */
  getStudyList () {
    this.$emit('loadOn')
    return httpService.get('query/studyNameList')
      .then((res: any) => { this.studyList = res.data.rows })
      .catch((err: any) => { throw new Error(err) }).finally(() => this.$emit('loadOff'))
  }

  /* Get list of projects */
  getProjectsList () {
    this.$emit('loadOn')
    return httpService.post('query/projectNameList', { study: this.importAssemblyForm.study })
      .then((res: any) => {
        this.importAssemblyForm.projectName = ''
        this.projectsList = res.data.rows
      }).catch((err: any) => { throw new Error(err) }).finally(() => this.$emit('loadOff'))
  }

  uploadFastaFile (file: any) {
    const fileReader = new FileReader()
    fileReader.readAsText(file.raw)
    fileReader.onload = (e: any) => { this.importAssemblyForm.pathway = e.target.result }
  }

  created () {
    this.getStudyList()
  }
}
</script>
