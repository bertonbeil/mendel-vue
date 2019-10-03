<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24">
        <h3 class="text-black font-bold">Create new CDSs</h3>
      </el-col>
      <el-col :span="24">
        <p v-if="!CDSNaming" v-html="modalData.dialogIntro" class="mb-8 break-word"></p>
        <p v-else v-html="CDSNamingDialogIntro" class="mb-8 break-word"></p>
      </el-col>
    </el-row>
    <template v-if="!CDSNaming">
      <!-- Main modal content -->
      <div class="mb-30">
        <el-form :model="denovoCDSForm" label-position="top" :rules="rules" ref="denovoCDSForm">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Study name:" prop="study">
                <el-select
                  v-model="denovoCDSForm.study"
                  @change="getProjectsList"
                  placeholder="Select study"
                  class="w-full">
                  <el-option v-for="item in studyList" :key="item.name" :label="item.name" :value="item.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Project name:" prop="project">
                <el-select
                  v-model="denovoCDSForm.project"
                  :disabled="!denovoCDSForm.study"
                  placeholder="Select project"
                  class="w-full">
                  <el-option v-for="item in projectsList" :key="item.name" :label="item.name" :value="item.name"></el-option>
                </el-select>
                <p class="text-grey-dark -mt-5 ml-5">These CDSs will appear exclusively in this project</p>
              </el-form-item>
            </el-col>

            <el-col :span="24" class="mb-40">
              <h4 class="text-xl text-black mt-3">CDS information:</h4>
              <p>Add information about your desired CDS’ here. You should have a comma separate list of CDS accession numbers, as well as any sequences you would like to exclude from your final assembly.</p>
            </el-col>

            <el-col :span="8">
              <el-form-item label="Enter Accession numbers:" prop="accession">
                <el-input
                  v-model="denovoCDSForm.accession"
                  :disabled="!denovoCDSForm.project"
                  placeholder="Enter protein accession numbers (separated by commas)">
                </el-input>
                <p class="text-grey-dark">Note: If you want to use a custom CDS please go to ”Import CDSs” after you finish creating your CDSs.</p>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Host Organism:" prop="organism">
                <el-select
                  v-model="denovoCDSForm.organism"
                  :disabled="!denovoCDSForm.accession"
                  placeholder="Select host organism"
                  class="w-full">
                  <el-option v-for="item in organisms" :key="item" :label="item" :value="item"></el-option>
                </el-select>
                <p class="text-grey-dark">Your proteins will be reverse translated and codon optimized for expression in this organism</p>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Forbidden sequences:">
                <el-input v-model="denovoCDSForm.forbiddenRegions" placeholder="Enter DNA sequences (separated by commas)"></el-input>
                <p class="text-grey-dark">e.g. restriction enzyme sites, protein binding sites etc. Note: as a default all CDSs designed in MenDEL ar    re-coded to eliminate BsaI, BsmBI, NotI, SalI BceAI restriction enzyme (RE) recognition sequences and RapI core binding sites (ACCCA).</p>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- Modal action buttons -->
      <div slot="footer" class="text-center">
        <el-button type="danger" @click="$emit('close')">Cancel</el-button>
        <el-button type="success" @click="getCDSTable">CDS naming</el-button>
      </div>
    </template>
    <template v-else>
      <el-row :gutter="20" class="mb-20">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="project" label="Project" width="180"></el-table-column>
          <el-table-column prop="accession" label="Accession number" width="180"></el-table-column>
          <el-table-column prop="origin" label="Source organism"></el-table-column>
          <el-table-column prop="host" label="Host organism"></el-table-column>
          <el-table-column label="Nickname">
            <template slot-scope="scope"><el-input v-model="scope.row.nickname"></el-input></template>
          </el-table-column>
          <el-table-column label="Genbank link">
            <template slot-scope="scope"><a :href="scope.row.url" target="blank" class="text-blue">{{ scope.row.url }}</a></template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- Modal action buttons -->
      <div slot="footer" class="text-center">
        <el-button type="danger" @click="cancelAndBack">Cancel and back</el-button>
        <el-button type="success" @click="save('next')" :disabled="isDisabled">Save and Next</el-button>
        <el-button type="primary" @click="save" :disabled="isDisabled">Save</el-button>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from 'vue-property-decorator'
import { DialogBase, DenovoCDS } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'
import { capitalize } from '@/utils/helpers'
import { alertMixin } from '@/utils/mixins'
import { Study } from '../../../utils/interfaces'

@Component({
  name: 'CreateDeNovoCDS',
  mixins: [alertMixin]
})

export default class CreateDeNovoCDS extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  studyList: string[] = []
  projectsList: string[] = []
  organisms: [ string, string ] = [ 'Yeast', 'Human' ]
  CDSNaming: boolean = false
  tableData: string[] = []
  nickname: string = ''
  url: string = ''
  CDSNamingDialogIntro: string = 'This page will define the information that is needed to create a name for your CDSs.'

  denovoCDSForm: DenovoCDS = {
    study: '',
    project: '',
    organism: '',
    suffix: '',
    accession: '',
    dna_sequence: '',
    forbiddenRegions: '',
    excludeRestrictionEnzymes: true,
    excludeForbiddenRegions: true
  }

  rules: object = {
    study: [ { required: true, message: 'Study name is required' } ],
    project: [ { required: true, message: 'Project name is required' } ],
    accession: [ { required: true, message: 'Accession numbers is required' } ],
    organism: [ { required: true, message: 'Host organism name is required' } ]
  }

  $refs!: {
    denovoCDSForm: HTMLFormElement
  }

  get isDisabled () {
    return !this.tableData.every((i: any) => i.nickname.length)
  }

  get sendData () {
    this.denovoCDSForm.nickname = this.tableData.map((i: any) => i.nickname).join()
    return this.denovoCDSForm
  }

  /* submit Modal data */
  save (next?: string) {
    this.$emit('save', { data: this.sendData }, next === 'next' ? this.modalData.saveAndNext : null)
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
    return httpService.post('query/projectNameList', { study: this.denovoCDSForm.study })
      .then((res: any) => { this.projectsList = res.data.rows })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  getCDSTable () {
    this.$refs['denovoCDSForm'].validate((valid: boolean) => {
      if (valid) {
        return httpService.post('query/bioPartDesigner', JSON.stringify(this.denovoCDSForm))
          .then((res: any) => {
            const { lims_response, status } = res.data
            if (status === 'success') {
              if (lims_response.rows.length) this.tableData = lims_response.rows.map((i: any) => ({ ...i, nickname: '' }))
              this.CDSNaming = true
              this.$emit('update:title', 'CDS Naming')
            } else (this as any).alert({ type: status, msg: lims_response })
          })
          .catch((err: any) => { throw new Error(err) })
          .finally(() => this.$emit('loadOff'))
      } else return false
    })
  }

  cancelAndBack () {
    this.$emit('update:title', 'Create new CDSs')
    this.CDSNaming = false
    this.tableData = []
  }

  getInitialData () {
    this.getStudyList()
      .then(() => {
        if (this.modalData.hasOwnProperty('saveAndNextData')) {
          this.denovoCDSForm.study = this.modalData.saveAndNextData.study
          this.denovoCDSForm.project = this.modalData.saveAndNextData.name
          this.getProjectsList()
        }
      })
  }

  created () {
    this.getInitialData()
  }
}
</script>
