<template>
  <div class="tool-primer-coverage-wrapper">
    <div class="tool-rimer-coverage">
      <el-row :gutter="20" class="mb-20">
        <el-col :span="24">
          <h3 class="text-black font-bold">Primer coverage tool</h3>
        </el-col>
        <el-col :span="24">
          <p v-html="modalData.dialogIntro"></p>
        </el-col>
      </el-row>

        <!-- Main modal content -->
      <el-row :gutter="20" class="mb-20">
        <el-col :span="24" class="mb-20">
          <h5 class="text-black font-bold">Region information</h5>
          <p class="text-gray-400">Alternatively, define the genome and location of the locus, or provide the sequence as text or a fasta file.</p>
        </el-col>
        <el-col :span="24">
          <el-form ref="primerCoverageSourceForm" :model="primerCoverageSourceForm" :rules="rules" label-position="top">
            <el-row :gutter="20" class="mb-20">
              <el-col :span="12">
                <el-form-item label="Organism:" prop="organism">
                  <el-select
                    v-model="primerCoverageSourceForm.organism"
                    @change="getChromosoms"
                    placeholder="Choose the genome your locus resides in"
                    class="w-full">
                    <el-option v-for="(organism, index) in organismsList" :value="organism" :label="organism" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="Chromosome:" prop="chromosome">
                  <el-select
                    v-model="primerCoverageSourceForm.chromosome"
                    @change="changeChromosome"
                    placeholder="Choose the chromosome your locus resides in"
                    :disabled="!primerCoverageSourceForm.organism"
                    class="w-full">
                    <el-option v-for="(chromosome, index) in chromosomsList" :value="chromosome" :label="chromosome" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12" class="mb-20">
                <el-form-item prop="openPosition" label="Open Position:">
                  <el-popover class="ml-10 absolute -top-35 right-0 h-10 w-10" placement="top-start" width="300" trigger="hover">
                    <i slot="reference" class="el-icon-info cursor-pointer text-green"></i>
                    <div class="break-word">The desired chromosomal location of the first nucleotide in the locus.</div>
                  </el-popover>
                  <el-input
                    type="number"
                    placeholder="1"
                    v-model="primerCoverageSourceForm.openPosition"
                    :disabled="!primerCoverageSourceForm.chromosome">
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12" class="mb-20">
                <el-form-item prop="closePosition" label="Close Position:">
                  <el-popover class="ml-10 absolute -top-35 right-0 h-10 w-10" placement="top-start" width="300" trigger="hover">
                    <i slot="reference" class="el-icon-info cursor-pointer text-green"></i>
                    <div class="break-word">The desired chromosomal location of the final nucleotide in the locus.</div>
                  </el-popover>
                  <el-input
                    type="number"
                    placeholder="1"
                    v-model="primerCoverageSourceForm.closePosition"
                    :disabled="!primerCoverageSourceForm.chromosome">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24" class="mb-30">
                <h4 class="text-xl text-black mt-3">Copy paste Sequence:</h4>
                <el-input
                  placeholder="Alternatively you can paste the locus sequence in fasta format"
                  v-model="primerCoverageSourceForm.sequence"
                  type="textarea"
                  resize="none"
                  :rows="4">
                </el-input>
              </el-col>

              <el-col :span="24" class="mb-30">
                <h4 class="text-xl text-black mt-3">Upload fasta:</h4>
                <UploadFile :dna-sequence.sync="primerCoverageSourceForm.sequence" :accept='".fa,.fasta"'/>
              </el-col>
            </el-row>
          </el-form>

          <el-row :gutter="20" class="mb-30">
            <el-col :span="24" class="mb-20">
              <h5 class="text-black mb-20">Primer parameters:</h5>
              <p>You can define your desired parameters for primer design here. The defaults should generally work well for most amplicons amplified with modern high-fidelity polymerases.</p>
            </el-col>

            <el-form v-model="primerCoverageSourceForm">
              <el-col :span="5">
                <h5 class="text-black mb-20">Primer length</h5>
                <el-form-item label="Minimum:" class="form-item-label flex items-center text-sm" size="mini">
                  <el-input-number v-model="toolPrimerCoveragesForm.minLength" class="ml-10"></el-input-number>
                </el-form-item>
                <el-form-item label="Maximum:" class="form-item-label flex items-center text-sm" size="mini">
                  <el-input-number v-model="toolPrimerCoveragesForm.maxLength" class="ml-10"></el-input-number>
                </el-form-item>
              </el-col>

              <el-col :span="5">
                <h5 class="text-black mb-20">Annealing temperature</h5>
                <el-form-item label="Minimum:" class="form-item-label flex items-center text-sm" size="mini">
                  <el-input-number v-model="toolPrimerCoveragesForm.minTemperature" class="ml-10"></el-input-number>
                </el-form-item>
                <el-form-item label="Maximum:" class="form-item-label flex items-center text-sm" size="mini">
                  <el-input-number v-model="toolPrimerCoveragesForm.maxTemperature" class="ml-10"></el-input-number>
                </el-form-item>
              </el-col>

              <el-col :span="5">
                <h5 class="text-black mb-20">Percent GC</h5>
                <el-form-item label="Minimum:" class="form-item-label flex items-center text-sm" size="mini">
                  <el-input-number v-model="toolPrimerCoveragesForm.minPercentGC" class="ml-10"></el-input-number>
                </el-form-item>
                <el-form-item label="Maximum:" class="form-item-label flex items-center text-sm" size="mini">
                  <el-input-number v-model="toolPrimerCoveragesForm.maxPercentGC" class="ml-10"></el-input-number>
                </el-form-item>
              </el-col>

              <el-col :span="9">
                <h5 class="text-black mb-20">Base composition</h5>
                <el-form-item label="Maximum homopolymer length:" class="form-item-label flex items-center text-sm" size="mini">
                  <el-input-number v-model="toolPrimerCoveragesForm.maxHomopolymerLen" class="ml-10"></el-input-number>
                </el-form-item>
                <el-form-item label="Minimum base representation:" class="form-item-label flex items-center text-sm" size="mini">
                  <el-input-number v-model="toolPrimerCoveragesForm.minBaseRepresentation" class="ml-10"></el-input-number>
                </el-form-item>
                <el-form-item label="Maximum hairp in length:" class="form-item-label flex items-center text-sm" size="mini">
                  <el-input-number v-model="toolPrimerCoveragesForm.maxHairpinLen" class="ml-10"></el-input-number>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
      <el-button type="success" @click="save">Save</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { DialogBase, ToolPrimerCoverages, PrimerCoverageSource } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({ name: 'ToolPrimerCoverage' })

export default class ToolPrimerCoverage extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  organismsList: string[] = []
  chromosomsList: string[] = []

  primerCoverageSourceForm: PrimerCoverageSource = {
    organism: '',
    chromosome: '',
    openPosition: '',
    closePosition: '',
    leftPadding: 0,
    rightPadding: 0,
    sequence: ''
  }

  toolPrimerCoveragesForm: ToolPrimerCoverages = {
    primers: '',
    dnaDesignName: 'None',
    minTemperature: 52,
    maxTemperature: 58,
    saltConcentration: 0.05,
    dnaConcentration: 5,
    minPercentGC: 40,
    maxPercentGC: 60,
    maxHomopolymerLen: 5,
    minBaseRepresentation: 10,
    maxHairpinLen: 8,
    minLength: 18,
    maxLength: 30,
    minDistance: 80,
    maxDistance: 300,
    dimerLength: 5,
    hairpinLength: 5,
    tailMinDistance: 100,
    type: 'Adapto',
    well: 'A1',
    source: this.primerCoverageSourceForm
  }

  rules: object = {
    organism: [{ required: true, message: 'Organism is required' }],
    chromosome: [{ required: true, message: 'Chromosome is required' }],
    openPosition: [{ required: true, message: 'Open position is required' }],
    closePosition: [{ required: true, message: 'Close position is required' }]
  }

  $refs!: {
    toolPrimerCoveragesForm: HTMLFormElement
    primerCoverageSourceForm: HTMLFormElement
  }

  get sendData () {
    return this.toolPrimerCoveragesForm
  }

  /* submit Modal data */
  save (next?: string) {
    this.$refs['primerCoverageSourceForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: this.sendData })
      else return false
    })
  }

  getChromosoms () {
    this.$emit('loadOn')
    return httpService.post('query/adaptoUtils', { request: 'chromosomeList', organism: this.primerCoverageSourceForm.organism })
      .then((res: any) => {
        this.primerCoverageSourceForm.chromosome = ''
        this.primerCoverageSourceForm.openPosition = ''
        this.primerCoverageSourceForm.closePosition = ''
        this.chromosomsList = res.data.lims_response
      })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  getOrganisms () {
    this.$emit('loadOn')
    return httpService.post('query/adaptoUtils', { request: 'organismList' })
      .then((res: any) => { this.organismsList = res.data.lims_response })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  changeChromosome () {
    this.primerCoverageSourceForm.openPosition = ''
    this.primerCoverageSourceForm.closePosition = ''
  }

  created () {
    this.getOrganisms()
  }
}
</script>
