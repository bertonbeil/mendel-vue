<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24">
        <p v-if="!CDSNaming" v-html="modalData.dialogIntro" class="mb-8"></p>
        <p v-else v-html="test" class="mb-8"></p>
      </el-col>
    </el-row>
    <template v-if="!CDSNaming">
      <!-- Main modal content -->
      <div class="mb-30">
        <el-form :model="denovoCDSForm" label-position="top" :rules="rules" ref="denovoCDSForm">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Study name:" prop="study">
                <el-select v-model="denovoCDSForm.study" @change="getProjectsList" placeholder="Select study" class="w-full">
                  <el-option v-for="item in studyList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Project name:" prop="project">
                <el-select v-model="denovoCDSForm.project" placeholder="Select project" class="w-full">
                  <el-option v-for="item in projectsList" :key="item" :label="item" :value="item"></el-option>
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
                <el-input v-model="denovoCDSForm.accession" placeholder="Enter protein accession numbers (separated by commas)"></el-input>
                <p class="text-grey-dark">Note: If you want to use a custom CDS please go to ”Import CDSs” after you finish creating your CDSs.</p>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Host Organism:" prop="organism">
                <el-select v-model="denovoCDSForm.organism" placeholder="Select host organism" class="w-full">
                  <el-option v-for="item in organisms" :key="item" :label="item" :value="item"></el-option>
                </el-select>
                <p class="text-grey-dark">Your proteins will be reverse translated and codon optimized for expression in this organism</p>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Forbidden sequences:" prop="forbiddenRegions">
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
            <template slot-scope="scope"><a :href='scope.row.url' target='blank' class='text-blue'>{{ scope.row.url }}</a></template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- Modal action buttons -->
      <div slot="footer" class="text-center">
        <el-button type="danger" @click="cancelAndBack">Cancel and back</el-button>
        <el-button type="success" @click="saveAndNext" :disabled="disabledSubmit">Save and Next</el-button>
        <el-button type="primary" @click="save" :disabled="disabledSubmit">Save</el-button>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { DialogBase } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({
  name: 'CreateProject'
})

export default class CreateDeNovoCDS extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  /* base optins set up for MessageBox dialog */
  confirmOptions = {
    confirmButtonText: 'Ok',
    cancelButtonText: 'Cancel',
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false
  }

  studyList: [] = []
  projectsList: [] = []
  organisms: [ string, string ] = [ 'Yeast', 'Human' ]
  CDSNaming: boolean = false
  tableData: any = []
  nickname: string = ''
  url: string = ''
  test: string = 'This page will define the information that is needed to create a name for your CDSs.'

  denovoCDSForm: any = {
    project: '',
    organism: '',
    suffix: '',
    accession: '',
    dna_sequence: '',
    forbiddenRegions: '',
    excludeRestrictionEnzymes: true,
    excludeForbiddenRegions: true
  }

  rules: any = {
    study: [ { required: true } ],
    project: [ { required: true } ],
    accession: [ { required: true } ],
    organism: [ { required: true } ]
  }

  $refs!: {
    denovoCDSForm: any
  }

  get disabledSubmit () {
    return !this.tableData.every((i: any) => i.nickname.length)
  }

  /* submit Modal data */
  save () {
    this.denovoCDSForm.nickname = this.tableData.map((i: any) => i.nickname).join()
    this.$emit('save', { data: this.denovoCDSForm })
  }

  /* submit Modal data */
  saveAndNext () {
    // this.$refs['studyForm'].validate((valid: any) => {
    //   if (valid) {
    //     this.$emit('saveAndNext', { data: { new_study: this.studyForm, collaborators: this.collaborators } }, this.modalData.saveAndNext)
    //   } else return false
    // })
  }

  /* load Modal data -> Get list of study */
  getStudyList () {
    this.$emit('loadOn')
    return httpService.get('query/studyNameList')
      .then((res: any) => {
        res.data.rows.map((study: any) => this.studyList.push(study.name))
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  /* Get list of projects */
  getProjectsList () {
    this.$emit('loadOn')
    return httpService.post('query/projectNameList', { study: this.denovoCDSForm.study })
      .then((res: any) => {
        res.data.rows.map((project: any) => this.projectsList.push(project.name))
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  getCDSTable () {
    this.$refs['denovoCDSForm'].validate((valid: any) => {
      if (valid) {
        return httpService.post('query/bioPartDesigner', this.denovoCDSForm)
          .then((res: any) => {
            const resp = res.data
            if (resp.status === 'success') {
              if (resp.lims_response.rows.length) this.tableData = resp.lims_response.rows.map((i: any) => ({ ...i, nickname: '' }))
              this.CDSNaming = true
              this.$emit('update:title', 'CDS Naming')
              this.$emit('loadOff')
            } else {
              this.$confirm(`${resp.lims_response}`, `${resp.status.charAt(0).toUpperCase() + resp.status.slice(1)}`, { type: resp.status, center: true, ...this.confirmOptions })
                .catch(() => this.$emit('close'))
            }
          }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
      } else return false
    })
  }

  cancelAndBack () {
    this.$emit('update:title', 'Create new CDSs')
    this.CDSNaming = false
    this.tableData = []
  }

  created () {
    this.$emit('update:title', 'Create new CDSs')
    this.getStudyList()
  }
}
</script>
