<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24"><p v-html="modalData.dialogIntro" class="mb-8"></p></el-col>
    </el-row>
    <!-- Main modal content -->
    <div class="mb-30">
      <el-row :gutter="20">
        <StudySelect :getProjectsList='getProjectsList' :studyName.sync='denovoPrimersForm.study' :studyList='studyList' />
        <ProjectSelect :getAssemblyList='getAssemblyList' :projectName.sync='denovoPrimersForm.project' :projectList='projectsList' />
        <AssemblySelect :assemblyList='assemblyList' :assemblyName.sync='denovoPrimersForm.dnaDesignName' />
      </el-row>
      <el-form label-position="top">
        <el-row :gutter="20" class="mb-30">
          <el-col :span="24" class="mb-30">
            <h4 class="text-xl text-black mt-3">Primer parameters:</h4>
            <p class="break-normal">You can define your desired parameters for primer design here. The defaults should generally work well for most amplicons amplified with modern high-fidelity polymerases.</p>
          </el-col>

          <el-col :span="6">
            <h4 class="text-xl text-black mb-20">Primer length:</h4>
            <el-form-item label="Minimum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="denovoPrimersForm.minLength" class="ml-10" :min="0" :max="10000"></el-input-number>
            </el-form-item>
            <el-form-item label="Maximum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="denovoPrimersForm.maxLength" class="ml-10" :min="0" :max="10000"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <h4 class="text-xl text-black mb-20">Annealing temperature:</h4>
            <el-form-item label="Minimum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="denovoPrimersForm.minTemperature" class="ml-10" :min="0" :max="10000"></el-input-number>
            </el-form-item>
            <el-form-item label="Maximum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="denovoPrimersForm.maxTemperature" class="ml-10" :min="0" :max="10000"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <h4 class="text-xl text-black mb-20">Percent GC:</h4>
            <el-form-item label="Minimum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="denovoPrimersForm.minPercentGC" class="ml-10" :min="0" :max="10000"></el-input-number>
            </el-form-item>
            <el-form-item label="Maximum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="denovoPrimersForm.maxPercentGC" class="ml-10" :min="0" :max="10000"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <h4 class="text-xl text-black mb-20">Amplicon length:</h4>
            <el-form-item label="Minimum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="denovoPrimersForm.minDistance" class="ml-10" :min="0" :max="10000"></el-input-number>
            </el-form-item>
            <el-form-item label="Maximum:" class="form-item-label flex items-center" size="mini">
              <el-input-number v-model="denovoPrimersForm.maxDistance" class="ml-10" :min="0" :max="10000"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
      <el-button type="success" @click="save('next')">Save and Export</el-button>
      <el-button type="primary" @click="save">Save</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { DialogBase, DenovoPrimers } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({ name: 'CreateDeNovoPrimers' })

export default class CreateDeNovoPrimers extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  studyList: string[] = []
  projectsList: string[] = []
  assemblyList: string[] = []

  denovoPrimersForm: DenovoPrimers = {
    study: '',
    project: '',
    dnaDesignName: '',
    minLength: 18,
    maxLength: 30,
    minTemperature: 52,
    maxTemperature: 58,
    minPercentGC: 40,
    maxPercentGC: 60,
    minDistance: 80,
    maxDistance: 300,
    saltConcentration: 0.05,
    dnaConcentration: 5,
    dimerLength: 5,
    hairpinLength: 5,
    tailMinDistance: 200,
    well: 'A1',
    primers: ''
  }

  get validate () {
    return this.denovoPrimersForm.study !== '' && this.denovoPrimersForm.project !== '' && this.denovoPrimersForm.dnaDesignName !== ''
  }

  get sendData () {
    return this.denovoPrimersForm
  }

  /* submit Modal data */
  save (next?: string) {
    if (this.validate) this.$emit('save', { data: this.sendData }, next === 'next' ? this.modalData.saveAndNext : null)
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
    return httpService.post('query/projectNameList', { study: this.denovoPrimersForm.study })
      .then((res: any) => {
        this.denovoPrimersForm.project = ''
        this.denovoPrimersForm.dnaDesignName = ''
        this.projectsList = res.data.rows
        this.assemblyList = []
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  /* Get list of assemblies */
  getAssemblyList () {
    this.$emit('loadOn')
    return httpService.post('query/projectAssemblyList', { study: this.denovoPrimersForm.study, project: this.denovoPrimersForm.project })
      .then((res: any) => {
        this.denovoPrimersForm.dnaDesignName = ''
        res.data.rows.map((item: any) => this.assemblyList.push(item.assembly))
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  created () {
    this.getStudyList()
  }
}
</script>
