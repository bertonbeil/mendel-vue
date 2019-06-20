<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24"><p v-html="modalData.dialogIntro" class="mb-8"></p></el-col>
    </el-row>
    <!-- Main modal content -->
    <div class="mb-30">
      <el-form :model="adaptoRegionOfInterestForm" label-position="top" :rules="rules" ref="adaptoRegionOfInterestForm">
        <el-row :gutter="20" class="mb-30">
          <el-col :span="8">
            <el-form-item label="Study name:" prop="study">
              <el-select v-model="adaptoRegionOfInterestForm.study" @change="getProjectsList" placeholder="Select study" class="w-full">
                <el-option v-for="(item, i) in studyList" :key="i" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Project name:" prop="project">
              <el-select v-model="adaptoRegionOfInterestForm.project" @change="getAssemblyList" placeholder="Select project" class="w-full">
                <el-option v-for="(item, i) in projectsList" :key="i" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
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
              <el-input-number placeholder="200000" class="w-full" disabled></el-input-number>
              <p class="text-grey-dark -mt-5 ml-5 break-normal">This is the default length for a single entered coordinate view. Edit for a custom length, or enter a range in the coordinate field for custom coordinate endpoints.</p>
            </el-form-item>
          </el-col>

          <GenomeBrowser :iframeSrc='iframeSrc' v-if="showBrowser" />

          <el-col :span="24" v-if="showBrowser" class="flex justify-between">
            <div>
              <el-button type="info" icon="el-icon-minus" circle @click="adaptoRegionOfInterestForm.openPos -= openPosValue" size="mini"></el-button>
              <el-input-number controls-position="right" v-model="openPosValue" class="mx-10" size="mini"></el-input-number>
              <el-button type="info" icon="el-icon-plus" circle @click="adaptoRegionOfInterestForm.openPos += openPosValue" size="mini"></el-button>
            </div>
            <div>
              <el-button type="info" icon="el-icon-minus" circle @click="adaptoRegionOfInterestForm.closePos -= closePosValue" size="mini"></el-button>
              <el-input-number controls-position="right" v-model="closePosValue" class="mx-10" size="mini"></el-input-number>
              <el-button type="info" icon="el-icon-plus" circle @click="adaptoRegionOfInterestForm.closePos += closePosValue" size="mini"></el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
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
  openPosValue: number = 5000
  closePosValue: number = 5000

  adaptoRegionOfInterestForm: AdaptoRegionOfInterest = {
    study: '',
    project: '',
    name: '',
    description: '',
    organism: '',
    chromosome: '',
    openPos: 1000000,
    closePos: 15000000,
    length: 200000
  }

  rules: object = {
    study: [ { required: true } ],
    project: [ { required: true } ],
    name: [ { required: true } ],
    description: [ { required: true } ],
    organism: [ { required: true } ],
    chromosome: [ { required: true } ],
    openPos: [ { required: true } ],
    closePos: [ { required: true } ]
  }

  $refs!: {
    adaptoRegionOfInterestForm: HTMLFormElement
  }

  /* submit Modal data */
  save (next?: string) {
    this.$refs['adaptoRegionOfInterestForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: this.adaptoRegionOfInterestForm }, next === 'next' ? this.modalData.saveAndNext : null)
      else return false
    })
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
    return httpService.post('query/projectNameList', { study: this.adaptoRegionOfInterestForm.study })
      .then((res: any) => {
        this.adaptoRegionOfInterestForm.project = ''
        this.adaptoRegionOfInterestForm.name = ''
        this.projectsList = res.data.rows
        this.assemblyList = []
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  /* Get list of assemblies */
  getAssemblyList () {
    this.$emit('loadOn')
    return httpService.post('query/projectAssemblyList', { study: this.adaptoRegionOfInterestForm.study, project: this.adaptoRegionOfInterestForm.project })
      .then((res: any) => {
        this.adaptoRegionOfInterestForm.name = ''
        this.assemblyList = res.data.rows
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
