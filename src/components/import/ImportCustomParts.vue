<template>
  <div class="custom-parts-wrapper">
    <div class="custom-parts">
      <el-row :gutter="20" class="mb-20">
        <el-col :span="24">
          <h3 class="text-black font-bold" v-if="!showSegmentDetails">Import Custom Parts</h3>
          <h3 class="text-black font-bold" v-else>Segment Details</h3>
        </el-col>
        <el-col :span="24">
          <p v-html="modalData.dialogIntro" class="mb-8 break-word" v-if="!showSegmentDetails"></p>
          <p class="mb-8 break-word" v-else>This page allows you to specify a grant that is related to each segment. This page also allows you to specify the resistance marker for the vector the segment is delivered in.</p>
        </el-col>
      </el-row>
      <!-- Main modal content -->
      <el-row :gutter="20" v-if="!showSegmentDetails">
        <el-col :span="24">
          <el-form @submit.prevent :model="importCustomPartsForm" label-position="top" :rules="rules" ref="importCustomPartsForm">
            <el-form-item label="Order name:" prop="projectName">
              <p class="text-sm text-gray-200 mb-20">Specify a unique order name for the set of segments you are ordering. For example, you could use the date and your name.</p>
              <el-input
                @submit.prevent
                type="text"
                v-model="importCustomPartsForm.projectName"
                @change="$emit('loadOf')"
                placeholder="Type order name..">
              </el-input>
            </el-form-item>
            <el-form-item label="Order description:">
              <el-input v-model="description" type="textarea" placeholder="Type optional order description" :rows="4"></el-input>
            </el-form-item>
            <el-form-item label="Sequence(s):" prop="data">
              <el-input
                type="textarea"
                v-model="importCustomPartsForm.data"
                placeholder="Alternatively you can paste the locus sequence in fasta format"
                resize="none"
                :rows="4">
              </el-input>
            </el-form-item>
            <el-col :span="24">
              <h4 class="text-xl text-black mt-3">Upload fasta:</h4>
              <UploadFile :dna-sequence.sync="importCustomPartsForm.data" :accept="'.fa,.fasta'" />
            </el-col>
          </el-form>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-else class="mb-20 border-solid border-gray-600">
        <el-col :span="24">
          <el-row>
            <el-col :span="4"><h4 class="text-black">Order</h4></el-col>
            <el-col :span="2"><h4 class="text-black">Name</h4></el-col>
            <el-col :span="6"><h4 class="text-black">Sequance</h4></el-col>
            <el-col :span="5"><h4 class="text-black">Grant</h4></el-col>
            <el-col :span="5"><h4 class="text-black">Marker</h4></el-col>
          </el-row>
          <SegmentDetailsRow
            v-for="(segmentDetail, index) in importCustomPartsForm.data"
            :key="index"
            :segmentData.sync="importCustomPartsForm.data[index]"
            :grants="grants"
            :orderName="importCustomPartsForm.projectName">
          </SegmentDetailsRow>
        </el-col>
      </el-row>

      <!-- Modal action buttons -->
      <div slot="footer" v-if="!showSegmentDetails" class="text-center">
        <el-button type="danger" @click="$emit('close')">Cancel</el-button>
        <el-button type="primary" @click="addSegmentDetails">Add segment details</el-button>
      </div>
      <div slot="footer" v-else class="text-center">
        <el-button type="danger" @click="backToCustomParts">Cancel and back</el-button>
        <el-button type="primary" :disabled="!isSaveDisabled" @click="save">Submit for rewiew</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { DialogBase, ImportsCustomParts } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'
import { alertMixin } from '@/utils/mixins'

@Component({ name: 'ImportCustomParts' })

export default class ImportCustomParts extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  showSegmentDetails: boolean = false
  grants: any[] = []
  description: string = ''

  importCustomPartsForm: ImportsCustomParts = {
    projectName: '',
    action: 'load',
    data: ''
  }

  rules: object = {
    projectName: [{ required: true, message: 'Order name is required' }],
    data: [{ required: true, message: 'Sequence is required' }]
  }

  $refs!: {
    importCustomPartsForm: HTMLFormElement
  }

  get sendData () {
    return this.importCustomPartsForm
  }

  /* submit Modal data */
  save () {
    this.$emit('save', { data: this.sendData })
  }

  get isSaveDisabled () {
    return this.checkEmptyFields(this.importCustomPartsForm.data)
  }

  checkEmptyFields (data: any) {
    return data.every((el: any) => el.marker !== '') && data.every((el: any) => el.grant !== '')
  }

  /* Get segment data */
  addSegmentDetails () {
    this.$refs['importCustomPartsForm'].validate((valid: boolean) => {
      if (valid) {
        this.$emit('loadOn')
        return httpService.post('query/qinglanAssemblyDesigner', this.sendData)
          .then((res: any) => {
            if (res.data.status === 'success') {
              this.showSegmentDetails = true
              this.importCustomPartsForm.action = 'order'
              this.importCustomPartsForm.data = res.data.lims_response.map((item: any) => {
                return { ...item, grant: '', marker: '' }
              })
            } else this.responseMessage()
          })
          .catch((err: any) => { throw new Error(err) })
          .finally(() => this.$emit('loadOff'))
      }
    })
  }

  /* Get list of grants */
  getGrunts () {
    this.$emit('loadOn')
    return httpService.post('query/grantsForUser', { user: this.$store.state.user.id })
      .then((res: any) => { this.grants = res.data.grants })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  backToCustomParts () {
    this.importCustomPartsForm.projectName = ''
    this.importCustomPartsForm.data = ''
    this.showSegmentDetails = false
    this.importCustomPartsForm.action = 'load'
  }

  /* response viewer */
  responseMessage () {
    this.$confirm(`Assembly name ${this.importCustomPartsForm.projectName} has been used before. Please specify new name`, 'Error', { type: 'error', center: true })
  }

  created () {
    this.getGrunts()
  }
}
</script>
