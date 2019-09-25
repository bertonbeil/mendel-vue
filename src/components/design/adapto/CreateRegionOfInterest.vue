<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24"><p v-html="modalData.dialogIntro" class="mb-8"></p></el-col>
    </el-row>
    <!-- Main modal content -->
    <div class="mb-30">
      <el-form :model="adaptoRegionOfInterestForm" label-position="top" :rules="rules" ref="adaptoRegionOfInterestForm">
        <el-row :gutter="20" class="mb-30">
          <!-- <StudySelect :getProjectsList='getProjectsList' :studyName.sync='adaptoRegionOfInterestForm.study' :studyList='studyList' /> -->
          <!-- <ProjectSelect :getAssemblyList='getAssemblyList' :projectName.sync='adaptoRegionOfInterestForm.project' :projectList='projectsList' /> -->
          <Select
              :name.sync='adaptoRegionOfInterestForm.study'
              :list='studyList'
              :getList='getProjectsList'
              label='Study' />
            <Select
              :name.sync='adaptoRegionOfInterestForm.project'
              :list='projectsList'
              :getList='getAssemblyList'
              label='Project'
              ref="projectSelect" />
          <el-col :span="8">
            <el-form-item label="Name:" prop="name">
              <el-input v-model="adaptoRegionOfInterestForm.name"
                @change="getOrganismList"
                placeholder="Enter name for this locus"
                class="w-full">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24" class="mb-30">
            <el-form-item label="Description:" prop="description">
              <el-input v-model="adaptoRegionOfInterestForm.description" placeholder="Enter a short but memorable description for this region"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24" class="mb-30">
            <h4 class="text-xl text-black mt-3">Sequence information</h4>
            <p class="break-normal">Define the genome and location of your locus of interest, or provide the sequence as text or a fasta file.</p>
          </el-col>

          <el-col :span="4">
            <el-form-item label="Organism:" prop="organism">
              <el-select v-model="adaptoRegionOfInterestForm.organism" @change="getChromosomeList" placeholder="Select organism" class="w-full">
                <el-option v-for="item in organismList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="Chromosome:" prop="chromosome">
              <el-select v-model="adaptoRegionOfInterestForm.chromosome" placeholder="Select chromosome" class="w-full">
                <el-option v-for="item in chromosomeList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-col :span="12">
                <el-form-item label="Open position:" prop="openPos">
                  <el-input-number v-model="adaptoRegionOfInterestForm.openPos" class="mr-20"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Close position:" prop="closePos">
                  <el-input-number v-model="adaptoRegionOfInterestForm.closePos"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <p class="text-grey-dark -mt-5 ml-5 break-normal">A single coordinate will open a genome browser view centered on that coordinate with a window size indicated in the ‘length’ field. A range will open the browser view of that coordinate range.</p>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Length (bp):" prop="length">
              <el-input-number v-model="lengthBp" class="w-full" disabled></el-input-number>
              <p class="text-grey-dark -mt-5 ml-5 break-normal">This is the default length for a single entered coordinate view. Edit for a custom length, or enter a range in the coordinate field for custom coordinate endpoints.</p>
            </el-form-item>
          </el-col>

          <GenomeBrowser :iframeSrc='iframeSrc' v-if="showBrowser" class="my-30" />

          <el-col :span="24" v-if="showBrowser" class="flex justify-between">
            <div>
              <el-button type="info" icon="el-icon-minus" circle @click="adaptoRegionOfInterestForm.openPos -= posValue" size="mini"></el-button>
              <el-input-number controls-position="right" v-model="posValue" class="mx-10" size="mini"></el-input-number>
              <el-button type="info" icon="el-icon-plus" circle @click="adaptoRegionOfInterestForm.openPos += posValue" size="mini"></el-button>
            </div>
            <div>
              <el-button type="info" icon="el-icon-minus" circle @click="adaptoRegionOfInterestForm.closePos -= posValue" size="mini"></el-button>
              <el-input-number controls-position="right" v-model="posValue" class="mx-10" size="mini"></el-input-number>
              <el-button type="info" icon="el-icon-plus" circle @click="adaptoRegionOfInterestForm.closePos += posValue" size="mini"></el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <el-row>
        <el-col :span="24" class="mb-30">
          <h4 class="text-xl text-black mt-3">Paste sequence:</h4>
          <p class="break-normal mb-30">Define the genome and location of your locus of interest, or provide the sequence as text or a fasta file.</p>
          <el-input
            placeholder="Alternatively you can paste the locus sequence in fasta format…"
            v-model="textarea"
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
    </div>
    <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
      <el-button type="success" @click="save('next')">Save and Next</el-button>
      <el-button type="primary" @click="save">Save</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { DialogBase, AdaptoRegionOfInterest } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'
import GenomeBrowser from '../../shared/GenomeBrowser.vue'

@Component({ name: 'CreateRegionOfInterest' })

export default class CreateRegionOfInterest extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  studyList: string[] = []
  projectsList: string[] = []
  assemblyList: string[] = []
  organismList: string[] = []
  chromosomeList: string[] = []
  posValue: number = 5000
  textarea: string = ''
  fileList: object[] = []

  adaptoRegionOfInterestForm: AdaptoRegionOfInterest = {
    study: '',
    project: '',
    name: '',
    description: '',
    organism: '',
    chromosome: '',
    openPos: 0,
    closePos: 0,
    length: 200000
  }

  rules: object = {
    name: [ { required: true } ],
    description: [ { required: true } ],
    organism: [ { required: true } ],
    chromosome: [ { required: true } ],
    openPos: [ { required: true } ],
    closePos: [ { required: true } ]
  }

  $refs!: {
    adaptoRegionOfInterestForm: HTMLFormElement,
    projectSelect: HTMLFormElement
  }

  get sendData () {
    return this.adaptoRegionOfInterestForm
  }

  get showBrowser () {
    return Object.values(this.adaptoRegionOfInterestForm).every((item: any) => { return item !== '' })
  }

  get organism () {
    return this.adaptoRegionOfInterestForm.organism === 'human' ? 'hg38'
      : this.adaptoRegionOfInterestForm.organism === 'rat' ? 'rn6'
        : this.adaptoRegionOfInterestForm.organism === 'mouse' ? 'mm10'
          : this.adaptoRegionOfInterestForm.organism === 'drosophila' ? 'dm6' : null
  }

  get iframeSrc () {
    return `https://genome.ucsc.edu/cgi-bin/hgTracks?db=${this.organism}&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=${this.adaptoRegionOfInterestForm.chromosome}%3A${this.adaptoRegionOfInterestForm.openPos}-${this.adaptoRegionOfInterestForm.closePos}&hgsid=728161491_DuUswQ4Qb8YNKSSnYWajK4db9HsW`
  }

  get lengthBp () {
    let form = this.adaptoRegionOfInterestForm
    return form.closePos - form.openPos
  }

  /* submit Modal data */
  save (next?: string) {
    this.$refs['adaptoRegionOfInterestForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: this.sendData }, next === 'next' ? this.modalData.saveAndNext : null)
      else return false
    })
  }

  uploadFastaFile (file: any) {
    const fileReader = new FileReader()
    fileReader.readAsText(file.raw)
    fileReader.onload = (e: any) => { this.textarea = e.target.result }
  }

  /* load Modal data -> Get list of study */
  getStudyList () {
    this.$emit('loadOn')
    return httpService.get('query/studyNameList')
      .then((res: any) => {
        this.studyList = []
        res.data.rows.map((item: any) => this.studyList.push(item.name))
        this.$emit('loadOff')
      })
  }

  /* Get list of projects */
  getProjectsList () {
    this.$emit('loadOn')
    return httpService.post('query/projectNameList', { study: this.adaptoRegionOfInterestForm.study })
      .then((res: any) => {
        this.projectsList = []
        this.assemblyList = []
        this.$refs.projectSelect.selectForm.name = ''
        this.adaptoRegionOfInterestForm.name = ''
        res.data.rows.map((item: any) => this.projectsList.push(item.name))
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  /* Get list of assemblies */
  getAssemblyList () {
    this.$emit('loadOn')
    return httpService.post('query/projectAssemblyList', { study: this.adaptoRegionOfInterestForm.study, project: this.adaptoRegionOfInterestForm.project })
      .then((res: any) => {
        this.assemblyList = []
        this.adaptoRegionOfInterestForm.name = ''
        res.data.rows.map((item: any) => this.assemblyList.push(item.assembly))
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  getOrganismList () {
    this.$emit('loadOn')
    return httpService.post('query/adaptoUtils', { request: 'organismList' })
      .then((res: any) => {
        this.organismList = res.data.lims_response
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  getChromosomeList () {
    this.$emit('loadOn')
    return httpService.post('query/adaptoUtils', { request: 'chromosomeList', organism: this.adaptoRegionOfInterestForm.organism })
      .then((res: any) => {
        this.chromosomeList = res.data.lims_response
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  created () {
    this.getStudyList()
  }
}
</script>
