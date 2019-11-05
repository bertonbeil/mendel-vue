<template>
  <div class="order-barcode-scanner-wrapper">
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24">
        <h3 class="text-black font-bold">Barcode Scanner</h3>
      </el-col>

       <el-col :span="12">
        <el-form :model="barcodeScannerForm" label-position="top" :rules="rules" ref="barcodeScannerForm">
          <el-form-item label="Product type:" prop="type">
            <el-select v-model="barcodeScannerForm.type" placeholder="Select type..." class="w-full">
              <el-option label="Primer" value="Primer"></el-option>
              <el-option label="Segment" value="Segment"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Value:" prop="barcode">
            <el-input v-model="barcodeScannerForm.barcode"></el-input>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col :span="12" class="overflow-hidden h-170">
        <v-quagga :onDetected="logIt"  :readerTypes="['code_128_reader', 'code_39_reader']"></v-quagga>
      </el-col>
    </el-row>

    <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
      <el-button type="success" @click="sumbitBarCode">Submit</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { BarcodeScannerForm } from '@/utils/interfaces'
import { mixins } from 'vue-class-component'
import { alertMixin } from '@/utils/mixins'
import VueQuagga from 'vue-quaggajs'
import { httpService } from '../../services/http.service'

Vue.use(VueQuagga)

@Component({ name: 'OrderBarcodeScanner', mixins: [ alertMixin ] })

export default class OrderBarcodeScanner extends Vue {
  barcodeScannerForm : BarcodeScannerForm = {
    type: '',
    barcode: ''
  }

  rules: object = {
    type: [{ required: true, message: 'Product type is required ' }],
    barcode: [{ required: true, message: 'Product type is required ' }]
  }

  $refs!: {
    barcodeScannerForm: HTMLFormElement
  }

  sumbitBarCode () {
    this.$refs['barcodeScannerForm'].validate((valid: boolean) => {
      if (valid) {
        this.$emit('loadOn')
        return httpService.post('/query/barcodeReader', this.barcodeScannerForm)
          .then((res: any) => {
            (this as any).alert({ type: res.data.status, msg: res.data.lims_response })
            this.barcodeScannerForm.barcode = ''
          })
          .catch((err: any) => { throw new Error(err) })
          .finally(() => this.$emit('loadOff'))
      } else {
        this.$emit('loadOff')
        return false
      }
    })
  }

  logIt (data: any) {
    (this as any).alert({ type: 'success', msg: `Barcode is ${data.codeResult.code} ` })
    this.barcodeScannerForm.barcode = data.codeResult.code
  }
}
</script>
