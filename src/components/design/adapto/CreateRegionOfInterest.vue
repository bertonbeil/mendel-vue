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
            <el-form-item label="Study name:" prop="studyName">
              <el-select
                v-model="adaptoRegionOfInterestForm.studyName"
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
                v-model="adaptoRegionOfInterestForm.projectName"
                :disabled="!adaptoRegionOfInterestForm.studyName"
                placeholder="Select project"
                class="w-full">
                <el-option v-for="item in projectsList" :key="item.name" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Name:" prop="name">
              <el-input
                v-model="adaptoRegionOfInterestForm.name"
                @change="getOrganismList"
                :disabled="!adaptoRegionOfInterestForm.projectName"
                placeholder="Enter name for this region"
                class="w-full">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24" class="mb-30">
            <el-form-item label="Description:" prop="description">
              <el-input
                v-model="adaptoRegionOfInterestForm.description"
                :disabled="!adaptoRegionOfInterestForm.name"
                placeholder="Enter a short but memorable description for this region">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24" class="mb-30">
            <h4 class="text-xl text-black mt-3">Sequence information</h4>
            <p class="break-normal">Define the genome and location of your locus of interest, or provide the sequence as text or a fasta file.</p>
          </el-col>

          <el-col :span="4">
            <el-form-item label="Organism:" prop="organism">
              <el-select v-model="source.organism" @change="getChromosomeList" placeholder="Select organism" class="w-full">
                <el-option v-for="item in organismList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="Chromosome:" prop="chromosome">
              <el-select v-model="source.chromosome" placeholder="Select chromosome" class="w-full">
                <el-option v-for="item in chromosomeList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-col :span="12">
                <el-form-item label="Open position:" prop="openPosition">
                  <el-input-number v-model="source.openPosition" class="mr-20"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Close position:" prop="closePosition">
                  <el-input-number v-model="source.closePosition"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <p class="text-grey-dark -mt-5 ml-5 break-normal">A single coordinate will open a genome browser view centered on that coordinate with a window size indicated in the ‘length’ field. A range will open the browser view of that coordinate range.</p>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Length (bp):" prop="length">
              <el-input-number :value="lengthBp" class="w-full" disabled></el-input-number>
              <p class="text-grey-dark -mt-5 ml-5 break-normal">This is the default length for a single entered coordinate view. Edit for a custom length, or enter a range in the coordinate field for custom coordinate endpoints.</p>
            </el-form-item>
          </el-col>

          <GenomeBrowser :iframeSrc='iframeSrc' v-if="showBrowser" class="my-30" />

          <el-col :span="24" v-if="showBrowser" class="flex justify-between">
            <div>
              <el-button type="info" icon="el-icon-minus" circle @click="source.openPosition -= posValue" size="mini"></el-button>
              <el-input-number controls-position="right" v-model="posValue" class="mx-10" size="mini"></el-input-number>
              <el-button type="info" icon="el-icon-plus" circle @click="source.openPosition += posValue" size="mini"></el-button>
            </div>
            <div>
              <el-button type="info" icon="el-icon-minus" circle @click="source.closePosition -= posValue" size="mini"></el-button>
              <el-input-number controls-position="right" v-model="posValue" class="mx-10" size="mini"></el-input-number>
              <el-button type="info" icon="el-icon-plus" circle @click="source.closePosition += posValue" size="mini"></el-button>
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
            v-model="source.sequence"
            type="textarea"
            resize="none"
            :rows="4">
          </el-input>
        </el-col>
        <el-col :span="24">
          <h4 class="text-xl text-black mt-3">Upload fasta:</h4>
          <UploadFile @getUploadFile='file => segmentRequest.mask = file' :accept='".fa,.fasta"'/>
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
  organismList: string[] = []
  chromosomeList: string[] = []
  posValue: number = 5000
  source: any = {
    organism: '',
    chromosome: '',
    openPosition: 0,
    closePosition: 0,
    leftPadding: 0,
    rightPadding: 0,
    sequence: ''
  }

  adaptoRegionOfInterestForm: AdaptoRegionOfInterest = {
    studyName: '',
    projectName: '',
    name: '',
    description: '',
    source: this.source
  }

  rules: object = {
    studyName: [ { required: true, message: 'Study name is required' } ],
    projectName: [ { required: true, message: 'Project name is required' } ],
    name: [ { required: true, message: 'Region name is required' } ],
    description: [ { required: true, message: 'Description is required' } ]
    // organism: [ { required: true } ],
    // chromosome: [ { required: true } ],
    // openPosition: [ { required: true } ],
    // closePosition: [ { required: true } ]
  }

  $refs!: {
    adaptoRegionOfInterestForm: HTMLFormElement
  }

  get sendData () {
    return this.adaptoRegionOfInterestForm
  }

  get showBrowser () {
    return Object.values(this.adaptoRegionOfInterestForm).every((item: any) => { return item !== '' })
  }

  get organism () {
    // TODO: use switch
    return this.source.organism === 'human' ? 'hg38'
      : this.source.organism === 'rat' ? 'rn6'
        : this.source.organism === 'mouse' ? 'mm10'
          : this.source.organism === 'drosophila' ? 'dm6' : null
  }

  get iframeSrc () {
    return `https://genome.ucsc.edu/cgi-bin/hgTracks?db=${this.organism}&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=${this.source.chromosome}%3A${this.source.openPosition}-${this.source.closePosition}&hgsid=728161491_DuUswQ4Qb8YNKSSnYWajK4db9HsW`
  }

  get lengthBp () {
    return this.source.closePosition - this.source.openPosition
  }

  /* submit Modal data */
  save (next?: string) {
    this.$refs['adaptoRegionOfInterestForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: JSON.stringify(this.sendData) }, next === 'next' ? this.modalData.saveAndNext : null)
      else return false
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
    return httpService.post('query/projectNameList', { study: this.adaptoRegionOfInterestForm.studyName })
      .then((res: any) => {
        this.adaptoRegionOfInterestForm.name = ''
        this.projectsList = res.data.rows
      })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  getOrganismList () {
    this.$emit('loadOn')
    return httpService.post('query/adaptoUtils', { request: 'organismList' })
      .then((res: any) => { this.organismList = res.data.lims_response })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  getChromosomeList () {
    this.$emit('loadOn')
    return httpService.post('query/adaptoUtils', { request: 'chromosomeList', organism: this.source.organism })
      .then((res: any) => { this.chromosomeList = res.data.lims_response })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  created () {
    this.getStudyList()
      .then(() => {
        if (this.modalData.hasOwnProperty('saveAndNextData')) {
          this.adaptoRegionOfInterestForm.studyName = this.modalData.saveAndNextData.study
          this.adaptoRegionOfInterestForm.projectName = this.modalData.saveAndNextData.name
          this.getProjectsList()
        }
      })
  }
}
</script>
