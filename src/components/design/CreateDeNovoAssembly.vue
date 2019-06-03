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
          <el-row :gutter="20">
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
                <el-select
                  v-model="denovoAssemblyForm.name"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="Select assembly"
                  @change="assemblyNameChecker">
                  <el-option v-for="item in assemblyList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="Assembly description (optional):" prop="description">
                <el-input v-model="denovoAssemblyForm.description" placeholder="Enter a brief but memorable description of your assembly"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24" class="mb-30">
              <h4 class="text-xl text-black mt-3">Assembly options:</h4>
              <p>Choose your desired optional assembly features, such as flanking restriction enzyme sites or internal distributed lox sites.</p>
            </el-col>

            <el-col :span="9">
              <h4 class="text-xl text-black mt-3">Terminal restriction sites:</h4>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-select v-model="denovoAssemblyForm.openReValue" placeholder="5' RE" class="w-full">
                    <el-option v-for="item in restrictionEnzymes" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="12">
                  <el-select v-model="denovoAssemblyForm.closeReValue" placeholder="3' RE" class="w-full">
                    <el-option v-for="item in restrictionEnzymes" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-col>
              </el-row>
              <p class="text-grey-dark">Choose restrictions sites that will flank your entire assembly if you want to make changes later. These RE are rare cutters that will likely will not exist in your assembly (but you will need to check this after finalizing the design).</p>
            </el-col>
            <el-col :span="5">
              <h4 class="text-xl text-black mt-3">Organizm:</h4>
              <el-select v-model="denovoAssemblyForm.organizm" placeholder="Select host organism" class="w-full">
                <el-option v-for="item in organizms" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <h4 class="text-xl text-black mt-3">Lox Site:</h4>
              <el-select v-model="denovoAssemblyForm.lox" placeholder="Select lox site" class="w-full">
                <el-option v-for="item in loxSites" :key="item" :label="item" :value="item"></el-option>
              </el-select>
              <p class="text-grey-dark">Note: If you choose to add Lox sites they will be encoded between each TU and at the start and end of the assembly. If you want your assembly to be SCRaMbLE ready you will need to choose LoxPsym. Otherwise the Lox sites will be directional and will only produce deletions.</p>
            </el-col>
            <el-col :span="5">
              <h4 class="text-xl text-black mt-3">Rightmost VA:</h4>
              <el-select v-model="denovoAssemblyForm.closingAdapter" placeholder="Select closing vegas adapter" class="w-full">
                <el-option v-for="item in vegasAdapters" :key="item" :label="item" :value="item"></el-option>
              </el-select>
              <p class="text-grey-dark">Note: Choose the VEGAS adaptor (57bp spacer flanking TUs) you would like to be placed on the 3’ end of your assembly.</p>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- Modal action buttons -->
      <div slot="footer" class="text-center">
        <el-button type="success">Add TU</el-button>
        <el-button type="warning">Delete TU</el-button>
        <el-button type="danger" @click="$emit('close')">Cancel</el-button>
        <el-button type="success" @click="saveAndNext">Save and Next</el-button>
        <el-button type="primary" @click="save">Save</el-button>
        <el-button type="warning">Visualize</el-button>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
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
  restrictionEnzymes: string[] = []
  organizms: string[] = [ 'Yeast', 'Mammal' ]
  loxSites: string[] = [ 'None', 'loxP', 'loxPsym', 'loxM' ]
  vegasAdapters: string[] = []

  denovoAssemblyForm: any = {
    studyName: '',
    projectName: '',
    name: '',
    description: '',
    pathway: 'None',
    organizm: '',
    lox: '',
    closingAdapter: '',
    openReValue: '',
    closeReValue: ''
    // parts: parts
  }

  rules: any = {
    study: [ { required: true } ],
    project: [ { required: true } ],
    assembly: [ { required: true } ]
  }

  $refs!: {
    denovoAssemblyForm: any
  }

  /* submit Modal data */
  save () {
    this.$refs['denovoAssemblyForm'].validate((valid: any) => {
      if (valid) {
        return httpService.post('query/dnaDesigner')
          .then((res: any) => {
            res.data.rows.map((project: any) => this.projectsList.push(project.name))
            this.$emit('loadOff')
          }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
      }
    })
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
      .then((res: any) => console.log(res))
      .catch(err => console.log(err))
  }

  getRestrictionEnzymeList () {
    return httpService.get('query/restrictionEnzymeList')
      .then((res: any) => res.data.rows.map((restrictionEnzyme: any) => this.restrictionEnzymes.push(restrictionEnzyme.name)))
  }

  getVegasAdapterNameList () {
    return httpService.get('query/vegasAdapterNameList')
      .then((res: any) => res.data.rows.map((closingAdapter: any) => this.vegasAdapters.push(closingAdapter.name)))
  }

  getData () {
    return Promise.all([ this.getStudyList(), this.getRestrictionEnzymeList(), this.getVegasAdapterNameList() ])
      .then(() => this.$emit('loadOff'))
      .catch(err => console.log(err))
  }

  created () {
    this.getData()
  }
}
</script>
