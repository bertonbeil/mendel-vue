<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24"><p v-html="modalData.dialogIntro" class="mb-8"></p></el-col>
    </el-row>
    <!-- Main modal content -->
    <div class="mb-30">
      <el-form :model="denovoAssemblyForm" label-position="top" :rules="rules" ref="denovoAssemblyForm">
        <el-row :gutter="20" class="mb-30">
          <el-col :span="8">
            <el-form-item label="Study name:" prop="studyName">
              <el-select
                v-model="denovoAssemblyForm.studyName"
                @change="getProjectsList"
                placeholder="Select study"
                class="w-full">
                <el-option v-for="item in studyList" :key="item.name" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Project name:" prop="projectName">
              <el-select
                v-model="denovoAssemblyForm.projectName"
                :disabled="!denovoAssemblyForm.studyName"
                @change="getAssemblyList"
                placeholder="Select project"
                class="w-full">
                <el-option v-for="item in projectsList" :key="item.name" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Assembly name:" prop="name">
              <el-select
                v-model="denovoAssemblyForm.name"
                filterable
                allow-create
                default-first-option
                placeholder="Select assembly"
                class="w-full"
                :disabled="!denovoAssemblyForm.projectName"
                @change="assemblyNameChecker">
                <el-option v-for="item in assemblyList" :key="item.assembly" :label="item.assembly" :value="item.assembly"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="Assembly description (optional):">
              <el-input
                v-model="denovoAssemblyForm.description"
                placeholder="Enter a brief but memorable description of your assembly">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24" class="mb-30">
            <h4 class="text-xl text-black mt-3">Assembly options:</h4>
            <p class="break-normal">Choose your desired optional assembly features, such as flanking restriction enzyme sites or internal distributed lox sites.</p>
          </el-col>

          <el-col :span="9">
            <h4 class="text-xl text-black mt-3">Terminal restriction sites:</h4>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item prop="openReValue">
                  <el-select
                    v-model="denovoAssemblyForm.openReValue"
                    :disabled="!denovoAssemblyForm.name"
                    placeholder="5' RE"
                    class="w-full">
                    <el-option v-for="item in restrictionEnzymes" :key="item.name" :label="item.name" :value="item.sequence"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="closeReValue">
                  <el-select
                    v-model="denovoAssemblyForm.closeReValue"
                    :disabled="!denovoAssemblyForm.openReValue"
                    placeholder="3' RE"
                    class="w-full">
                    <el-option v-for="item in restrictionEnzymes" :key="item.name" :label="item.name" :value="item.sequence"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <p class="text-grey-dark break-normal">Choose restrictions sites that will flank your entire assembly if you want to make changes later. These RE are rare cutters that will likely will not exist in your assembly (but you will need to check this after finalizing the design).</p>
          </el-col>
          <el-col :span="5">
            <h4 class="text-xl text-black mt-3">Organism:</h4>
            <el-form-item prop="organism">
              <el-select
                v-model="denovoAssemblyForm.organism"
                :disabled="!denovoAssemblyForm.closeReValue"
                @change="addRow()"
                placeholder="Select host organism"
                class="w-full">
                <el-option v-for="item in organisms" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <h4 class="text-xl text-black mt-3">Lox Site:</h4>
            <el-select v-model="denovoAssemblyForm.lox" placeholder="Select lox site" class="w-full mb-22">
              <el-option v-for="item in loxSites" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <p class="text-grey-dark break-normal">Note: If you choose to add Lox sites they will be encoded between each TU and at the start and end of the assembly. If you want your assembly to be SCRaMbLE ready you will need to choose LoxPsym. Otherwise the Lox sites will be directional and will only produce deletions.</p>
          </el-col>
          <el-col :span="5">
            <h4 class="text-xl text-black mt-3">Rightmost VA:</h4>
            <el-select v-model="denovoAssemblyForm.closingAdapter" placeholder="Select closing vegas adapter" class="w-full mb-22">
              <el-option v-for="item in vegasAdapters" :key="item.name" :label="item.name" :value="item.name"></el-option>
            </el-select>
            <p class="text-grey-dark break-normal">Note: Choose the VEGAS adaptor (57bp spacer flanking TUs) you would like to be placed on the 3’ end of your assembly.</p>
          </el-col>
        </el-row>

        <el-row v-if="showAssemblyTable">
          <el-row :gutter="20">
            <el-col :span="4"><h4 class="text-base text-black mt-3">VA:</h4></el-col>
            <el-col :span="4"><h4 class="text-base text-black mt-3">RE:</h4></el-col>
            <el-col :span="4"><h4 class="text-base text-black mt-3">Promoter:</h4></el-col>
            <el-col :span="4"><h4 class="text-base text-black mt-3">CDS:</h4></el-col>
            <el-col :span="4"><h4 class="text-base text-black mt-3">Terminator:</h4></el-col>
            <el-col :span="4"><h4 class="text-base text-black mt-3">TU Direction:</h4></el-col>
          </el-row>

          <draggable class="p-3" v-model="denovoAssemblyForm.parts">
            <el-row :gutter="20" class="flex items-center py-10 border-0 border-t border-solid border-grey cursor-pointer" v-for="(assembly, i) in denovoAssemblyForm.parts" :key="i">
              <el-col :span="4">
                <select v-model="denovoAssemblyForm.parts[i].vegasAdapter" class="w-full outline-none">
                  <option v-for="(item, i) in vegasAdapters" :key="i" :label="item.name" :value="item.name"></option>
                </select>
              </el-col>
              <el-col :span="4">
                <select v-model="denovoAssemblyForm.parts[i].restrictionEnzyme" class="w-full outline-none">
                  <option v-for="(item, i) in restrictionEnzymes" :key="i" :label="item.name" :value="item.name"></option>
                </select>
              </el-col>
              <el-col :span="4">
                <select v-model="denovoAssemblyForm.parts[i].promoter" class="w-full outline-none" filterable>
                  <option v-for="(item, i) in promoters" :key="i" :label="item.name" :value="item.name"></option>
                </select>
              </el-col>
              <el-col :span="4">
                <select v-model="denovoAssemblyForm.parts[i].partName" class="w-full outline-none">
                  <option v-for="(item, i) in cds" :key="i" :label="item.name" :value="item.name"></option>
                </select>
              </el-col>
              <el-col :span="4">
                <select v-model="denovoAssemblyForm.parts[i].terminator" class="w-full outline-none" filterable>
                  <option v-for="(item, i) in terminators" :key="i" :label="item.name" :value="item.name"></option>
                </select>
              </el-col>
              <el-col :span="2">
                <select v-model="denovoAssemblyForm.parts[i].strand" class="w-full outline-none">
                  <option v-for="(item, i) in TUDirections" :key="i" :label="item.name" :value="item.name"></option>
                </select>
              </el-col>

              <!-- table actions -->
              <el-col :span="2" class="flex justify-around">
                <el-tooltip class="item" effect="dark" content="Add new row below" placement="top-end">
                  <el-button type="success" icon="el-icon-plus" circle class="text-xl" @click="addRow(i)" size="mini"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="Delete row" placement="top-end">
                  <el-button type="danger" icon="el-icon-delete" circle class="text-xl text-red-600" @click="deleteRow(i)" size="mini"></el-button>
                </el-tooltip>
              </el-col>
            </el-row>
          </draggable>
        </el-row>
      </el-form>
    </div>
    <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
      <el-button type="success" @click="save('next')">Save and Next</el-button>
      <el-button type="primary" @click="save">Save</el-button>
      <el-button type="warning" @click="$refs.visualizer.vizualizer(denovoAssemblyForm)">Visualize</el-button>
    </div>
    <!-- Assembly visualizer -->
    <Visualizer ref="visualizer" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { DialogBase, DenovoAssembly } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'
import { _cloneDeep } from '@/utils/helpers'

@Component({ name: 'CreateDeNovoAssembly' })

export default class CreateDeNovoAssembly extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  studyList: string[] = []
  projectsList: string[] = []
  assemblyList: string[] = []
  organisms: [ string, string ] = [ 'Yeast', 'Mammal' ]
  loxSites: string[] = [ 'None', 'loxP', 'loxPsym', 'loxM' ]
  restrictionEnzymes: object[] = []
  vegasAdapters: object[] = []
  terminators: object[] = []
  promoters: object[] = []
  cds: object[] = []
  TUDirections: object[] = [ { name: 5 }, { name: 3 } ]
  isSaveAndNext: boolean = false
  assemblyRow: object = { vegasAdapter: 'None', restrictionEnzyme: 'None', promoter: 'None', partName: 'None', terminator: 'None', strand: 5 }

  denovoAssemblyForm: DenovoAssembly = {
    studyName: '',
    projectName: '',
    name: '',
    description: '',
    pathway: 'None',
    organism: '',
    lox: '',
    closingAdapter: '',
    openReValue: '',
    closeReValue: '',
    parts: []
  }

  rules: object = {
    studyName: [ { required: true, message: 'Study name is required' } ],
    projectName: [ { required: true, message: 'Project name is required' } ],
    name: [ { required: true, message: 'Assembly name is required' } ],
    openReValue: [ { required: true, message: 'Restrictions sites is required' } ],
    closeReValue: [ { required: true, message: 'Restrictions sites is required' } ],
    organism: [ { required: true, message: 'Organism is required' } ]
  }

  $refs!: {
    denovoAssemblyForm: HTMLFormElement
    visualizer: HTMLFormElement
    projectSelect: HTMLFormElement
  }

  get showAssemblyTable () {
    return this.denovoAssemblyForm.studyName && this.denovoAssemblyForm.projectName && this.denovoAssemblyForm.name && this.denovoAssemblyForm.organism && this.denovoAssemblyForm.openReValue && this.denovoAssemblyForm.closeReValue
  }

  get sendData () {
    return this.denovoAssemblyForm
  }

  /* submit Modal data */
  save (next?: string) {
    this.$refs['denovoAssemblyForm'].validate((valid: boolean) => {
      if (valid) {
        httpService.post('query/assemblyNameChecker', { name: this.denovoAssemblyForm.name })
          .then((res: any) => {
            if (res.data.valid === 'true') {
              this.$emit('save', { data: JSON.stringify(this.sendData) }, next === 'next'
                ? this.modalData.saveAndNext : null)
            } else this.responseMessage()
          })
          .catch((err: any) => { throw new Error(err) })
          .finally(() => this.$emit('loadOff'))
      } else return false
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
    return httpService.post('query/projectNameList', { study: this.denovoAssemblyForm.studyName })
      .then((res: any) => {
        this.assemblyList = []
        this.denovoAssemblyForm.name = ''
        this.projectsList = res.data.rows
      })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  getAssemblyList () {
    if (this.isSaveAndNext === false) this.$emit('loadOn')
    return httpService.post('query/projectAssemblyList', {
      study: this.denovoAssemblyForm.studyName,
      project: this.denovoAssemblyForm.projectName
    }).then((res: any) => { this.assemblyList = res.data.rows })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  assemblyNameChecker () {
    httpService.post('query/assemblyNameChecker', { name: this.denovoAssemblyForm.name })
      .then((res: any) => {
        this.$refs.visualizer.isVisible = false
        if (res.data.valid === 'false') {
          this.$emit('loadOn')
          httpService.post('query/assemblyRequestRetriever', { name: this.denovoAssemblyForm.name })
            .then((res: any) => { this.handleResponse(res.data.rows[0]) })
            .catch((err: any) => { throw new Error(err) })
            .finally(() => this.$emit('loadOff'))
        }
      })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  handleResponse (res: any) {
    const parts = res.parts.replace(/=/g, '":').replace(/', /g, '","').replace(/{/g, '{"').replace(/'/g, '"')
    this.denovoAssemblyForm.parts = JSON.parse(parts)
    this.denovoAssemblyForm.description = res.description
    this.denovoAssemblyForm.openReValue = res.restriction_enzyme_5
    this.denovoAssemblyForm.closeReValue = res.restriction_enzyme_3
    this.denovoAssemblyForm.organism = res.organism
    this.denovoAssemblyForm.lox = res.lox
    this.denovoAssemblyForm.closingAdapter = res.closing_adapter
  }

  /* Add assembly row */
  addRow (index: number) {
    this.$refs['denovoAssemblyForm'].validate((valid: boolean) => {
      if (valid) this.denovoAssemblyForm.parts.splice(++index, 0, _cloneDeep(this.assemblyRow))
    })
  }

  /* Delete assembly row */
  deleteRow (index: number) {
    this.denovoAssemblyForm.parts.splice(index, 1)
  }

  /* load Modal data -> Get list of restriction enzymes */
  getRestrictionEnzymeList () {
    return httpService.get('query/restrictionEnzymeList')
      .then((res: any) => {
        res.data.rows[0].sequence = 'None'
        this.restrictionEnzymes = res.data.rows
      })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  /* load Modal data -> Get list of vegas adapters */
  getVegasAdapterNameList () {
    return httpService.get('query/vegasAdapterNameList')
      .then((res: any) => { this.vegasAdapters = res.data.rows })
  }

  /* load Modal data -> Get list of promoters */
  getPromoters () {
    return httpService.get('query/promoterNameList')
      .then((res: any) => { this.promoters = res.data.rows })
  }

  /* Get list of CDS */
  getCDS () {
    return httpService.get(`query/bioPartsNameList?project=${this.denovoAssemblyForm.projectName}`)
      .then((res: any) => { this.cds = res.data.rows })
  }

  /* load Modal data -> Get list of terminators */
  getTerminators () {
    return httpService.get('query/terminatorNameList')
      .then((res: any) => { this.terminators = res.data.rows })
  }

  /* response viewer */
  responseMessage () {
    this.$confirm(`Assembly name ${this.denovoAssemblyForm.name} has been used before. Please specify new name`, 'Error', { type: 'error', center: true })
  }

  getInitialData () {
    /* load Modal data -> Get all lists */
    return Promise.all([
      this.getStudyList(),
      this.getRestrictionEnzymeList(),
      this.getVegasAdapterNameList(),
      this.getPromoters(),
      this.getTerminators()
    ]).then(() => {
      if (this.modalData.hasOwnProperty('saveAndNextData')) {
        this.isSaveAndNext = true
        this.denovoAssemblyForm.studyName = this.modalData.saveAndNextData.study
        this.denovoAssemblyForm.projectName = this.modalData.saveAndNextData.project
        this.getProjectsList()
        this.getAssemblyList()
      }
    }).catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  created () {
    this.getInitialData()
  }
}
</script>
