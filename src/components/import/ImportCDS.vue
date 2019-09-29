<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="23"><p v-html="modalData.dialogIntro" class="mb-8"></p></el-col>
      <el-col :span="1">
        <el-popover placement="top-start" width="300" trigger="hover">
          <i slot="reference" class="el-icon-info cursor-pointer text-green"></i>
          <div v-html="modalData.dialogInfo"></div>
        </el-popover>
      </el-col>
    </el-row>
    <!-- Main modal content -->
    <div class="mb-30">
      <el-form :model="importCDSForm" label-position="top" :rules="rules" ref="importCDSForm">
        <el-row :gutter="20" class="mb-30">
          <el-col :span="12">
            <el-form-item label="Study name:" prop="study">
              <el-select v-model="importCDSForm.study" @change="getProjectsList" placeholder="Select study" class="w-full">
                <el-option v-for="(item, i) in studyList" :key="i" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Project name:" prop="project">
              <el-select v-model="importCDSForm.project" placeholder="Select project" class="w-full">
                <el-option v-for="(item, i) in projectsList" :key="i" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="CDS description:">
              <el-input v-model="importCDSForm.description" placeholder="Enter a detailed description of how and why you designed the CDS outside of MenDEL"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="mb-30">
          <el-col :span="24" class="mb-40">
            <h4 class="text-xl text-black mt-3">CDS information</h4>
            <p>Provide the required information for your CDS. These will primarily be used for creating the systematic identifier for tracking this CDS in MenDEL.</p>
          </el-col>

          <el-col :span="6">
            <el-form-item label="Host Organism:">
              <el-select v-model="importCDSForm.organism" placeholder="Select host organism" class="w-full">
                <el-option v-for="item in organismsList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
              <p class="text-grey-dark break-words">Specify the organism where this CDS will be expressed. Primarily used for naming purposes, the CDS will not be recoded for expression in this organism.</p>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="Source organism:">
              <el-input v-model="importCDSForm.source" placeholder="Enter a 3 letter code for the source organism"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="Accession number:">
              <el-input v-model="importCDSForm.accession" placeholder="Enter an accession number if there is one"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="Nickname:">
              <el-input v-model="importCDSForm.nickname" placeholder="provide an easily recognizable nickname as defined in the pathway schema"></el-input>
              <p class="text-grey-dark break-words">Nicknames must follow the guidelines in the pathway schema. The nickname will appear in the CDS name, which will be visible during assembly design.</p>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="mb-30">
          <el-col :span="24" class="mb-40">
            <h4 class="text-xl text-black mt-3">Sequence</h4>
            <p>Provide the CDS sequence here. You can either paste the DNA sequence, or upload a fasta file.</p>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="mb-30">
          <el-col :span="24" class="mb-30">
            <h4 class="text-xl text-black mt-3">Paste DNA sequence:</h4>
            <p class="break-normal mb-30">Define the genome and location of your locus of interest, or provide the sequence as text or a fasta file.</p>
            <el-input
              placeholder="Alternatively you can paste the locus sequence in fasta format…"
              v-model="importCDSForm.dna_sequence"
              type="textarea"
              resize="none"
              :rows="4">
            </el-input>
          </el-col>
          <el-col :span="24">
            <h4 class="text-xl text-black mt-3">Upload fasta:</h4>
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              :file-list="fileList" class="mt-10"
              :on-change="uploadFastaFile"
              accept=".fa,.fasta">
              <el-button size="mini" type="primary">Click to upload</el-button>
            </el-upload>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
      <el-button type="primary">Save and import another CDS</el-button>
      <el-button type="success" @click="save">Save</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { DialogBase, ImportsCDS } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({ name: 'ImportCDS' })

export default class ImportCDS extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  studyList: string[] = []
  projectsList: string[] = []
  organismsList: string[] = [ 'Yeast', 'Human' ]
  fileList: object[] = []

  importCDSForm: ImportsCDS = {
    study: '',
    project: '',
    organism: '',
    suffix: '',
    description: '',
    accession: '',
    dna_sequence: '',
    nickname: '',
    forbiddenRegions: '',
    excludeRestrictionEnzymes: false,
    excludeForbiddenRegions: false
  }

  rules: object = {
    study: [ { required: true } ],
    project: [ { required: true } ]
  }

  $refs!: {
    importCDSForm: HTMLFormElement
  }

  get sendData () {
    return this.importCDSForm
  }

  /* submit Modal data */
  save (next?: string) {
    this.$refs['importCDSForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: JSON.stringify(this.sendData) }, next === 'next' ? this.modalData.saveAndNext : null)
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
    return httpService.post('query/projectNameList', { study: this.importCDSForm.study })
      .then((res: any) => {
        this.importCDSForm.project = ''
        this.projectsList = res.data.rows
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  uploadFastaFile (file: any) {
    const fileReader = new FileReader()
    fileReader.readAsText(file.raw)
    fileReader.onload = (e: any) => { this.importCDSForm.dna_sequence = e.target.result }
  }

  created () {
    this.getStudyList()
  }
}
</script>
