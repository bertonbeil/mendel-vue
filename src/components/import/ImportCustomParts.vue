<template>
  <div class="custom-parts-wrapper">
    <div class="custom-parts" v-if="!showSegmentDetails">
      <el-row :gutter="20" class="mb-20">
        <el-col :span="24">
          <h3 class="text-black font-bold">Import Custom Parts</h3>
        </el-col>
        <el-col :span="24">
          <p v-html="modalData.dialogIntro" class="mb-8"></p>
        </el-col>
      </el-row>
      <!-- Main modal content -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form
            :model="importCustomPartsForm"
            label-position="top"
            :rules="rules"
            ref="importCustomPartsForm"
          >
            <el-form-item label="Order name:" prop="projectName">
              <p
                class="text-sm text-gray-200 mb-20"
              >Specify a unique order name for the set of segments you are ordering. For example, you could use the date and your name.</p>
              <el-input
                type="text"
                placeholder="Type order name.."
                @change="$emit('loadOf')"
                v-model="importCustomPartsForm.projectName"
              ></el-input>
            </el-form-item>

            <el-form-item label="Order description:">
              <el-input type="textarea" placeholder="Type optional order description.." :rows="4">></el-input>
            </el-form-item>

            <el-form-item label="Sequence(s):" prop="data">
              <el-input
                placeholder="Alternatively you can paste the locus sequence in fasta format…"
                v-model="importCustomPartsForm.data"
                type="textarea"
                resize="none"
                :rows="4"
              ></el-input>
            </el-form-item>

            <el-col :span="24">
              <h4 class="text-xl text-black mt-3">Upload fasta:</h4>
              <UploadFile :dna-sequence.sync="importCustomPartsForm.data" :accept="'.fa,.fasta'" />
            </el-col>
          </el-form>
        </el-col>
      </el-row>

      <!-- Modal action buttons -->
      <div slot="footer" class="text-center">
        <el-button type="danger" @click="$emit('close')">Cancel</el-button>
        <el-button type="primary" @click="addSegmentDetails">Add segment details</el-button>
      </div>
    </div>

    <!-- Segmental details -->
    <div class="segment-details" v-if="showSegmentDetails">
      <el-row :gutter="20" class="mb-20">
        <el-col :span="24">
          <h3 class="text-black font-bold">Segment details</h3>
        </el-col>
        <el-col :span="24">
          <p
            class="mb-8"
          >This page allows you to specify a grant that is related to each segment. This page also allows you to specify the resistance marker for the vector the segment is delivered in.</p>
        </el-col>
      </el-row>

      <el-row class="mb-20 border-solid border-gray-600">
        <el-col :span="24">
          <el-row>
            <el-col :span="4">
              <h4 class="text-black">Order</h4>
            </el-col>
            <el-col :span="2">
              <h4 class="text-black">Name</h4>
            </el-col>
            <el-col :span="6">
              <h4 class="text-black">Sequance</h4>
            </el-col>
            <el-col :span="5">
              <h4 class="text-black">Grant</h4>
            </el-col>
            <el-col :span="5">
              <h4 class="text-black">Marker</h4>
            </el-col>
          </el-row>
          <SegmentDetailsRow
            v-for="(segmentDetail, index) in segmentDetails"
            :key="index"
            :segmentData.sync="segmentDetails[index]"
            :grants="grants"
            :orderName="importCustomPartsForm.projectName"
          ></SegmentDetailsRow>
        </el-col>
      </el-row>

      <!-- Segmental action buttons -->
      <div slot="footer" class="text-center">
        <el-button type="danger" @click="backToCustomParts">Cancel and back</el-button>
        <el-button type="primary" @click="sendDataForReview">Submit for rewiew</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import {
  DialogBase,
  ImportsCustomParts
} from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({ name: 'ImportCustomParts' })
export default class ImportCustomParts extends Vue {
  @Prop({ required: true }) modalData!: DialogBase;
  @Prop({ required: true }) isLoading!: boolean;

  showSegmentDetails: boolean = false;
  segmentDetails: object[] = [];
  grants: any[] = [];

  importCustomPartsForm: ImportsCustomParts = {
    projectName: '',
    action: 'load',
    data: ''
  };

  rules: object = {
    projectName: [{ required: true, message: 'Order name is required' }],
    data: [{ required: true, message: 'Sequence is required' }]
  };

  $refs!: {
    importCustomPartsForm: HTMLFormElement;
  };

  segmentDetail: object = [{}];

  sendDataForReview () {
    this.$emit('loadOn')
    return httpService
      .post('query/qinglanAssemblyDesigner', {
        projectName: this.importCustomPartsForm.projectName,
        action: 'order',
        data: this.segmentDetails
      })
      .catch((err: any) => {
        throw new Error(err)
      })
      .finally(() => this.$emit('loadOff'))
  }

  get sendData () {
    return JSON.stringify(this.importCustomPartsForm)
  }
  /* Get segment data */
  addSegmentDetails () {
    this.$refs['importCustomPartsForm'].validate((valid: boolean) => {
      if (valid) {
        this.$emit('loadOn')
        return httpService
          .post('query/qinglanAssemblyDesigner', this.importCustomPartsForm)
          .then((res: any) => {
            if (res.data.status === 'success') {
              this.showSegmentDetails = true
              this.segmentDetails = res.data.lims_response.map((item: any) => {
                return { ...item, grants: '', markers: '' }
              })
            } else {
              throw new Error()
            }
          })
          .then(() => this.getGrunts())
          .catch((err: any) => {
            throw new Error(err)
          })
          .finally(() => this.$emit('loadOff'))
      }
    })
  }
  /* Get list of grants */
  getGrunts () {
    return httpService
      .post('query/grantsForUser', { user: this.$store.state.user.id })
      .then((res: any) => {
        this.grants = res.data.grants
      })
      .catch((err: any) => {
        throw new Error(err)
      })
  }

  backToCustomParts () {
    this.importCustomPartsForm.projectName = ''
    this.importCustomPartsForm.data = ''
    this.showSegmentDetails = false
  }

  loadDebugger () {
    this.$emit('loadOn')
    this.$emit('loadOff')
  }

  created () {
    this.loadDebugger()
    this.getGrunts()
  }
}
</script>
