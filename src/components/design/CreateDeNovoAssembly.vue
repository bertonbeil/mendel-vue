<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24">
        <p v-html="modalData.dialogIntro" class="mb-8"></p>
      </el-col>
    </el-row>
      <!-- Main modal content -->
      <div class="mb-30">
        <el-form :model="denovoAssemblyForm" label-position="top" :rules="rules" ref="denovoAssemblyForm">
          <el-row :gutter="20" class="mb-30">
            <el-col :span="8">
              <el-form-item label="Study name:" prop="studyName">
                <el-select v-model="denovoAssemblyForm.studyName" @change="getProjectsList" placeholder="Select study" class="w-full">
                  <el-option v-for="item in studyList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Project name:" prop="projectName">
                <el-select v-model="denovoAssemblyForm.projectName" @change="getAssemblyList" placeholder="Select project" class="w-full">
                  <el-option v-for="item in projectsList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Assembly name:" prop="name">
                <el-select v-model="denovoAssemblyForm.name"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="Select assembly"
                  class="w-full"
                  @change="assemblyNameChecker">
                  <el-option v-for="item in assemblyList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="Assembly description (optional):">
                <el-input v-model="denovoAssemblyForm.description" placeholder="Enter a brief but memorable description of your assembly"></el-input>
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
                    <el-select v-model="denovoAssemblyForm.openReValue" placeholder="5' RE" class="w-full">
                      <el-option v-for="item in restrictionEnzymes" :key="item.name" :label="item.name" :value="item.sequence"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="closeReValue">
                    <el-select v-model="denovoAssemblyForm.closeReValue" placeholder="3' RE" class="w-full">
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
                <el-select v-model="denovoAssemblyForm.organism" @change="addNewRow()" placeholder="Select host organism" class="w-full">
                  <el-option v-for="item in organisms" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <h4 class="text-xl text-black mt-3">Lox Site:</h4>
              <el-select v-model="denovoAssemblyForm.lox" placeholder="Select lox site" class="w-full">
                <el-option v-for="item in loxSites" :key="item" :label="item" :value="item"></el-option>
              </el-select>
              <p class="text-grey-dark break-normal">Note: If you choose to add Lox sites they will be encoded between each TU and at the start and end of the assembly. If you want your assembly to be SCRaMbLE ready you will need to choose LoxPsym. Otherwise the Lox sites will be directional and will only produce deletions.</p>
            </el-col>
            <el-col :span="5">
              <h4 class="text-xl text-black mt-3">Rightmost VA:</h4>
              <el-select v-model="denovoAssemblyForm.closingAdapter" placeholder="Select closing vegas adapter" class="w-full">
                <el-option v-for="item in vegasAdapters" :key="item.name" :label="item.name" :value="item.name"></el-option>
              </el-select>
              <p class="text-grey-dark break-normal">Note: Choose the VEGAS adaptor (57bp spacer flanking TUs) you would like to be placed on the 3’ end of your assembly.</p>
            </el-col>
          </el-row>

          <el-row v-if="isAssemblyNameChecker">
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
                  <el-select v-model="assembly.vegasAdapter" class="w-full">
                    <el-option v-for="(item, i) in vegasAdapters" :key="i" :label="item.name" :value="item.name"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="4">
                  <el-select v-model="assembly.restrictionEnzyme" class="w-full">
                    <el-option v-for="(item, i) in restrictionEnzymes" :key="i" :label="item.name" :value="item.name"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="4">
                  <el-select v-model="assembly.promoter" class="w-full">
                    <el-option v-for="(item, i) in promoters" :key="i" :label="item.name" :value="item.name"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="4">
                  <el-select v-model="assembly.partName" class="w-full">
                    <el-option v-for="(item, i) in cds" :key="i" :label="item.name" :value="item.name"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="4">
                  <el-select v-model="assembly.terminator" class="w-full">
                    <el-option v-for="(item, i) in terminators" :key="i" :label="item.name" :value="item.name"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="2">
                  <el-select v-model="assembly.strand" class="w-full">
                    <el-option v-for="(item, i) in TUDirections" :key="i" :label="item.name" :value="item.name"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="2" class="flex justify-around">
                  <el-button type="success" icon="el-icon-plus" circle class="text-xl" @click="addNewRow(i)" size="mini"></el-button>
                  <el-button type="danger" icon="el-icon-delete" circle class="text-xl text-red-600" @click="deleteRow(i)" size="mini"></el-button>
                </el-col>
              </el-row>
            </draggable>
          </el-row>
        </el-form>
      </div>
      <!-- Modal action buttons -->
      <div slot="footer" class="text-center">
        <el-button type="danger" @click="$emit('close')">Cancel</el-button>
        <el-button type="success" @click="save(true)">Save and Next</el-button>
        <el-button type="primary" @click="save">Save</el-button>
        <el-button type="warning">Visualize</el-button>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { DialogBase } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({
  name: 'CreateDeNovoAssembly'
})

export default class CreateDeNovoAssembly extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  studyList: string[] = []
  projectsList: string[] = []
  assemblyList: string[] = []
  restrictionEnzymes: object[] = []
  organisms: string[] = [ 'Yeast', 'Mammal' ]
  loxSites: string[] = [ 'None', 'loxP', 'loxPsym', 'loxM' ]
  vegasAdapters: object[] = []
  promoters: object[] = []
  cds: object[] = []
  terminators: object[] = []
  TUDirections: object[] = [ { name: 5 }, { name: 3 } ]
  isAssemblyNameChecker: boolean = false
  assemblyRow: any = { vegasAdapter: 'None', restrictionEnzyme: 'None', promoter: 'None', partName: 'None', terminator: 'None', strand: 5 }

  denovoAssemblyForm: any = {
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

  rules: any = {
    studyName: [ { required: true } ],
    projectName: [ { required: true } ],
    name: [ { required: true } ],
    openReValue: [ { required: true } ],
    closeReValue: [ { required: true } ],
    organism: [ { required: true } ]
  }

  $refs!: {
    denovoAssemblyForm: any
  }

  /* submit Modal data */
  save (next: any) {
    this.$refs['denovoAssemblyForm'].validate((valid: any) => {
      if (valid) this.$emit('save', { data: this.denovoAssemblyForm }, next === true ? this.modalData.saveAndNext : null)
      else return false
    })
  }

  /* load Modal data -> Get list of study */
  getStudyList () {
    this.$emit('loadOn')
    return httpService.get('query/studyNameList')
      .then((res: any) => res.data.rows.map((studyName: any) => this.studyList.push(studyName.name)))
  }

  /* Get list of projects */
  getProjectsList () {
    this.$emit('loadOn')
    return httpService.post('query/projectNameList', { study: this.denovoAssemblyForm.studyName })
      .then((res: any) => {
        res.data.rows.map((project: any) => this.projectsList.push(project.name))
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  getAssemblyList () {
    this.$emit('loadOn')
    return httpService.post('query/projectAssemblyList', { study: this.denovoAssemblyForm.studyName, project: this.denovoAssemblyForm.projectName })
      .then((res: any) => {
        res.data.rows.map((name: any) => this.assemblyList.push(name.assembly))
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  assemblyNameChecker () {
    return httpService.post('query/assemblyNameChecker', { name: this.denovoAssemblyForm.name })
      .then((res: any) => {
        if (res.data.valid === 'false') {
          this.$emit('loadOn')
          httpService.post('query/assemblyRequestRetriever', { name: this.denovoAssemblyForm.name })
            .then((res: any) => {
              this.handleResponse(res.data.rows[0])
              this.getCDS()
              this.isAssemblyNameChecker = true
              this.$emit('loadOff')
            })
            .catch((err: any) => console.log(err))
        } else if (res.data.valid === 'true' &&
        this.denovoAssemblyForm.openReValue !== '' &&
        this.denovoAssemblyForm.closeReValue !== '' &&
        this.denovoAssemblyForm.organism !== '') {
          this.denovoAssemblyForm.parts = [ this.assemblyRow ]
        }
      })
      .catch(err => console.log(err))
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

  addNewRow (index:any) {
    this.$refs['denovoAssemblyForm'].validate((valid: any) => {
      if (valid) {
        this.isAssemblyNameChecker = true
        this.denovoAssemblyForm.parts.splice(++index, 0, this.assemblyRow)
      }
    })
  }

  deleteRow (index: any) {
    this.denovoAssemblyForm.parts.splice(index, 1)
  }

  getRestrictionEnzymeList () {
    return httpService.get('query/restrictionEnzymeList').then((res: any) => { this.restrictionEnzymes = res.data.rows })
  }

  getVegasAdapterNameList () {
    return httpService.get('query/vegasAdapterNameList').then((res: any) => { this.vegasAdapters = res.data.rows })
  }

  getPromoters () {
    return httpService.get('query/promoterNameList').then((res: any) => { this.promoters = res.data.rows })
  }

  getCDS () {
    return httpService.get(`query/bioPartsNameList?project=${this.denovoAssemblyForm.projectName}`).then((res: any) => { this.cds = res.data.rows })
  }

  getTerminators () {
    return httpService.get('query/terminatorNameList').then((res: any) => { this.terminators = res.data.rows })
  }

  getData () {
    return Promise.all([
      this.getStudyList(),
      this.getRestrictionEnzymeList(),
      this.getVegasAdapterNameList(),
      this.getPromoters(),
      this.getTerminators()
    ]).then(() => this.$emit('loadOff'))
  }

  created () {
    this.getData()
  }
}
</script>
