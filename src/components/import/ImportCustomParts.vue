<template>
  <div>
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
          <el-form-item label="Order name:">
            <p
              class="text-sm text-gray-200 mb-20"
            >Specify a unique order name for the set of segments you are ordering. For example, you could use the date and your name.</p>
            <el-input
              type="text"
              placeholder="Type order name.."
              v-model="importCustomPartsForm.orderName"
            ></el-input>
          </el-form-item>

          <el-form-item label="Order description:">
            <el-input
              type="textarea"
              placeholder="Type optional order description.."
              v-model="importCustomPartsForm.description"
            ></el-input>
          </el-form-item>

          <el-col :span="24" class="mb-30">
            <h4 class="text-xl text-black mt-3">Sequence(s):</h4>
            <el-input
              placeholder="Alternatively you can paste the locus sequence in fasta format…"
              v-model="importCustomPartsForm.sequence"
              type="textarea"
              resize="none"
              :rows="4">
            </el-input>
          </el-col>

          <el-col :span="24">
            <h4 class="text-xl text-black mt-3">Upload fasta:</h4>
            <UploadFile :dna-sequence.sync="importCustomPartsForm.sequence"  :accept='".fa,.fasta"' />
           </el-col>
        </el-form>
      </el-col>
    </el-row>

    <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { DialogBase, ImportsCustomParts } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({ name: 'ImportCustomParts' })
export default class ImportCustomParts extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  importCustomPartsForm: ImportsCustomParts = {
    orderName: '',
    description: '',
    sequence: ''
  };

  rules: object = {
    orderName: [{ required: true, messuge: 'Order name is rquired' }]
  };

  $refs!: {
    importCustomPartsForm: HTMLFormElement;
  };

  get sendData () {
    return JSON.stringify(this.importCustomPartsForm)
  }

  /* submit Modal data */
  save () {
    this.$refs['importCustomPartsForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: this.sendData })
      else return false
    })
  }
}
</script>
