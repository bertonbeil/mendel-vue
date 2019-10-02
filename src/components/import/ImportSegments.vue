<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="23">
        <p v-html="modalData.dialogIntro" class="mb-8"></p>
      </el-col>
      <el-col :span="1">
        <el-popover placement="top-start" width="300" trigger="hover">
          <i slot="reference" class="el-icon-info cursor-pointer text-green"></i>
          <div v-html="modalData.dialogInfo"></div>
        </el-popover>
      </el-col>
    </el-row>
    <!-- Main modal content -->
    <div class="mb-30">
      <el-form
        :model="importSegmentsForm"
        label-position="top"
        :rules="rules"
        ref="importSegmentsForm"
      >
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="Study name:" prop="study">
              <el-select
                v-model="importSegmentsForm.study"
                @change="getProjectsList"
                placeholder="Select study"
                class="w-full"
              >
                <el-option
                  v-for="(item, i) in studyList"
                  :key="i"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Project name:" prop="project">
              <el-select
                v-model="importSegmentsForm.projectName"
                @change="getAssemblyList"
                placeholder="Select project"
                :disabled="!importSegmentsForm.study"
                class="w-full"
              >
                <el-option
                  v-for="(item, i) in projectsList"
                  :key="i"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Assembly:" prop="Assembly">
              <el-select
                v-model="importSegmentsForm.assembly"
                placeholder="Select Assembly"
                :disabled="!importSegmentsForm.projectName"
                class="w-full"
              >
                <el-option
                  v-for="item in assemblyList"
                  :key="item.assembly"
                  :label="item.assembly"
                  :value="item.assembly"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24" class="mb-40">
            <h4 class="text-xl text-black mt-3">Segment options</h4>
            <p>Select options for this segmentation, such as the assembly vector to be used and any desired flanking restriction sites.</p>
          </el-col>
          <el-col :span="8">
            <div class="flex items-center">
              <h5 class="text-lg text-black">Assembly vector:</h5>
              <el-popover class="ml-10" placement="top-start" width="300" trigger="hover">
                <i slot="reference" class="el-icon-info cursor-pointer text-green"></i>
                <div
                  class="break-word"
                >Choose the features of your assembly vector. Yeast CEN/ARS is automatically assigned. For assemblies 30kb high copy number bacterial vector is permissible. Assemblies 30kb should select Low (BAC), though this backbone is inducible to high copy.</div>
              </el-popover>
            </div>
            <div class="flex items-center mt-10">
              <p class="mr-20">Yeast marker</p>
              <el-radio-group v-model="importSegmentsForm.segmentsAssemblyVector" size="mini">
                <el-radio-button :label="'URA3'">URA3</el-radio-button>
                <el-radio-button :label="'LEU2'">LEU2</el-radio-button>
              </el-radio-group>
            </div>
            <div class="flex items-center mt-10">
              <p class="mr-20">Bacterial copy</p>
              <el-radio-group v-model="importSegmentsForm.segmentsAssemblyBactery" size="mini">
                <el-radio-button :label="'pUC'">High (pUC)</el-radio-button>
                <el-radio-button :label="'BAC'">Low (BAC)</el-radio-button>
              </el-radio-group>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="flex items-center">
              <h5 class="text-lg text-black">Terminal restriction sites for segments:</h5>
              <el-popover class="ml-10" placement="top-start" width="300" trigger="hover">
                <i slot="reference" class="el-icon-info cursor-pointer text-green"></i>
                <div
                  class="break-word"
                >Choose restriction sites that will flank the segments of your assembly. These are rare-cutters that are unlikely to exist in your segment sequences, but you should verify that prior to choosing.</div>
              </el-popover>
            </div>
            <div class="flex">
              <el-form-item label="5’ RE:" prop="5’RE:">
                <el-select v-model="importSegmentsForm.restrictionEnzyme5">
                  <el-option
                    v-for="item in restrictionEnzymeList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.sequence"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="text-gray-500" label="3’ RE:" prop="5’RE:">
                <el-select v-model="importSegmentsForm.restrictionEnzyme3">
                  <el-option
                    v-for="item in restrictionEnzymeList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.sequence"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
              <div>
              <h5 class="text-lg text-black">Assembly length (bp):</h5>
              <el-input :disabled="true" class="mt-20" >

              </el-input>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="mb-30 mt-30">
          <el-col :span="24" class="mb-40">
            <h4 class="text-xl text-black mt-3">Sequence</h4>
            <p>Provide the segment sequences here. You can either paste DNA sequences, one per line, or upload a fasta file of your segments as individual entries.</p>
          </el-col>

          <el-col :span="24" class="mb-30">
            <h4 class="text-xl text-black mt-3">Paste sequence:</h4>
            <el-input
              placeholder="Alternatively you can paste the locus sequence in fasta format…"
              v-model="importSegmentsForm.sequences"
              type="textarea"
              resize="none"
              :rows="4">
            </el-input>
          </el-col>
          <el-col :span="24">
            <h4 class="text-xl text-black mt-3">Upload fasta:</h4>
            <UploadFile :dna-sequence.sync="importSegmentsForm.sequences"  :accept='".fa,.fasta"' />
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
      <el-button type="primary" @click="save">Save and import another CDS</el-button>
      <el-button type="success" @click="save">Save</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { DialogBase, ImportsSegments } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({ name: 'ImportSegments' })
export default class ImportSegments extends Vue {
  @Prop({ required: true }) modalData!: DialogBase;

  studyList: string[] = [];
  projectsList: string[] = [];
  assemblyList: string[] = [];
  fileList: any = [];
  assemblyVektor: string[] = [];
  restrictionEnzymeList: string[] = [];

  importSegmentsForm: ImportsSegments = {
    study: '',
    projectName: '',
    dnaDesignName: '',
    assembly: '',
    maxLen: 0,
    minLen: 0,
    overlap: 0,
    loxPsymDistance: 200,
    homopolymerLen: 7,
    homopolymerDistance: 200,
    segmentsAssemblyVector: '',
    segmentsAssemblyBactery: '',
    assemblyVectorName: '',
    restrictionEnzyme5: '',
    restrictionEnzyme3: '',
    sequences: ''
  };

  rules: object = {
    dnaDesignName: [{ required: true }],
    projectName: [{ required: true }],
    segmentsAssemblyVector: [{ required: true }],
    segmentsAssemblyBactery: [{ required: true }],
    name: [{ required: true }],
    description: [{ required: true }]
  };

  $refs!: {
    importSegmentsForm: HTMLFormElement;
  };

  get sendData () {
    return this.importSegmentsForm
  }

  /* submit Modal data */
  save (next?: string) {
    this.$refs['importSegmentsForm'].validate((valid: boolean) => {
      if (valid) {
        this.$emit(
          'save',
          { data: JSON.stringify(this.sendData) },
          next === 'next' ? this.modalData.saveAndNext : null
        )
      } else return false
    })
  }

  /* load Modal data -> Get list of study */
  getStudyList () {
    this.$emit('loadOn')
    return httpService
      .get('query/studyNameList')
      .then((res: any) => {
        this.studyList = res.data.rows
      })
      .catch((err: any) => {
        throw new Error(err)
      })
      .finally(() => this.$emit('loadOff'))
  }
  /* Get restriction Enzyme List */
  getRestrictionEnzymeList () {
    return httpService
      .get('query/restrictionEnzymeList')
      .then((res: any) => {
        this.restrictionEnzymeList = res.data.rows
      })
      .catch((err: any) => {
        throw new Error(err)
      })
  }
  /* Get list of Assembly */
  getAssemblyList () {
    this.$emit('loadOn')
    return httpService
      .post('query/projectAssemblyList', {
        project: this.importSegmentsForm.projectName
      })
      .then((res: any) => {
        this.assemblyList = res.data.rows
      })
      .catch((err: any) => {
        throw new Error(err)
      })
      .finally(() => this.$emit('loadOff'))
  }
  /* Get list of projects */
  getProjectsList () {
    this.$emit('loadOn')
    return httpService
      .post('query/projectNameList', { study: this.importSegmentsForm.study })
      .then((res: any) => {
        this.importSegmentsForm.projectName = ''
        this.projectsList = res.data.rows
      })
      .catch((err: any) => {
        throw new Error(err)
      })
      .finally(() => this.$emit('loadOff'))
  }

  uploadFastaFile (file: any) {
    const fileReader = new FileReader()
    fileReader.readAsText(file.raw)
    fileReader.onload = (e: any) => {
      this.importSegmentsForm.sequences = e.target.result
    }
  }

  created () {
    this.getStudyList()
    this.getRestrictionEnzymeList()
  }
}
</script>
