<template>
  <div class="order-quinglan-orders-wrapper">
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24" class="mb-20">
        <h3 class="text-black font-bold">Qinglan Orders</h3>
      </el-col>

      <el-col :span="24">
        <el-form :model="orderQinglanOrdersForm" label-position="top" :rules="rules" ref="orderQinglanOrdersForm">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="barcode" label="Type a three letter code from one of the received parts (e.g. EFX):">
                <el-input
                  v-model="orderQinglanOrdersForm.barcode"
                  class="input-with-select w-full"
                  placeholder="Please input"
                  show-word-limit
                  maxlength="3"
                  minlength="3">
                  <el-button slot="append" icon="el-icon-search" @click="searchOrders"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
               <el-form-item prop="order" label="Order:">
                  <el-select
                    class="w-full"
                    v-model="orderQinglanOrdersForm.order"
                    placeholder="please select order"
                    :disabled="orderList.length <= 0">
                    <el-option v-for="(order, index) in orderList" :label="order.name" :value="order.name" :key="index"></el-option>
                  </el-select>
                </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>

    <!-- Modal action buttons -->
      <div slot="footer" class="text-center">
        <el-button type="danger" @click="$emit('close')">Cancel</el-button>
        <el-button type="primary" @click="submit">Submit</el-button>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { httpService } from '@/services/http.service'
import { alertMixin } from '@/utils/mixins'

@Component({ name: 'OrderQinglanOrders', mixins: [ alertMixin ] })
export default class OrderQinglanOrders extends Vue {
  orderList: string[] = []

  orderQinglanOrdersForm : any = {
    barcode: '',
    order: ''
  }

  $refs!: {
    orderQinglanOrdersForm: HTMLFormElement
  }

  rules: object = {
    barcode: [{ required: true, message: 'Code is required ' }],
    order: [{ required: true, message: 'Order is required ' }]
  }

  searchOrders (value: any) {
    if (this.orderQinglanOrdersForm.barcode.trim().length < 3) {
      (this as any).alert({ type: 'error', msg: 'You need to enter 3 letter code' })
    } else {
      this.$emit('loadOn')
      return httpService.post('query/segmentOrderUpdater', { 'action': 'get_order', 'barcode': this.orderQinglanOrdersForm.barcode })
        .then((res: any) => {
          if (res.data.segment_orders.length > 0) this.orderList = res.data.segment_orders
          else (this as any).alert({ type: 'error', msg: res.data.lims_response || 'Try another code' })
        })
        .catch((err: any) => { throw new Error(err) })
        .finally(() => this.$emit('loadOff'))
    }
  }

  get sendData () {
    return this.orderQinglanOrdersForm
  }

  /* submit Modal data */
  submit () {
    this.$refs['orderQinglanOrdersForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: this.sendData })
      else return false
    })
  }
}
</script>
