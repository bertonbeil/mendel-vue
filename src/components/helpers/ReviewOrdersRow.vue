<template>
  <div class="order-row-wrapper">
    <el-card class="box-card mb-10">
      <el-row :gutter="20" class="flex items-center">
        <el-col :span="3" class="text-black">
          <p>{{assembliesData.study}}</p>
        </el-col>

        <el-col :span="3" class="text-black">
          <p>{{assembliesData.project}}</p>
        </el-col>

        <el-col :span="3" class="text-black">
          <p class="truncate">{{assembliesData.assembly}}</p>
        </el-col>

        <el-col :span="3" class="text-black">
          <p>{{assembliesData.grant_name}}</p>
        </el-col>

        <el-col :span="12" :offset="isGrantNameExist" class="flex overflow-x-auto text-black">
          <el-button @click="downloadFile" type="primary" size="medium">Download</el-button>
          <el-button
            @click="submitData(rejectedBtn.resolutionData)"
            size="medium"
            type="danger"
            :disabled="rejectedBtn.disabled">
            Reject
          </el-button>

          <el-button
            @click="submitData(orderSegmentBtn.resolutionData)"
            size="medium"
            type="success"
            :disabled="orderSegmentBtn.disabled">
            {{this.orderSegmentBtn.name}}
          </el-button>

          <el-button
            v-if="OrderJunctionBtn.isShow"
            @click="submitData(OrderJunctionBtn.resolutionData)"
            size="medium"
            type="info"
            :disabled="OrderJunctionBtn.disabled">
            {{OrderJunctionBtn.name}}
          </el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { OrdersRowAssemblyData } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'
import { alertMixin } from '@/utils/mixins'

@Component({ name: 'ReviewOrdersRow', mixins: [ alertMixin ] })

export default class ReviewOrdersRow extends Vue {
  @Prop({ required: true }) assembliesData!: OrdersRowAssemblyData

  get dateTime () {
    return `
      ${new Date().getMonth() + 1}/
      ${new Date().getDate()}/${new Date().getFullYear()}@
      ${new Date().getHours() < 10 ? 0 + new Date().getHours() : new Date().getHours()}:
      ${new Date().getMinutes() < 10 ? 0 + new Date().getMinutes() : new Date().getMinutes()}:
      ${new Date().getSeconds() < 10 ? 0 + new Date().getSeconds() : new Date().getSeconds()}`
  }

  /* submit Modal data */
  downloadFile () {
    let zipName = `${this.assembliesData.assembly}_${this.dateTime}`
    // Create request to get .zip file
    let xhr = new XMLHttpRequest()
    xhr.open('POST', 'https://mendel-dev.nyumc.org/query/AssemblyExporter', true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.responseType = 'blob'
    xhr.onload = function () {
      if (this.status === 200) {
        let data = this.response
        if (navigator.appVersion.toString().indexOf('.NET') > 0 && navigator.msSaveBlob) {
          window.navigator.msSaveBlob(new Blob([data]), `${zipName}.zip`)
        } else {
          const blob = new Blob([data], { type: 'application/octet-stream' })
          const file = new File([blob], 'file.zip', { type: 'application/zip' })
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(file)
          link.download = `${zipName}.zip`
          document.body.appendChild(link)
          link.click()
          setTimeout(() => link.remove(), 0)
        }
      } else console.log('Internal Error occurred. Please contact Systems Administrator')
    }
    // Send array of links
    xhr.send(
      JSON.stringify({
        study: this.assembliesData.study,
        project: this.assembliesData.project,
        assemblyName: this.assembliesData.assembly
      })
    )
  }

  submitData (resolutionData: string) {
    this.$emit('loadOn')
    return httpService.post('query/processAssemblyReviews', {
      assemblies: [ {
        study: this.assembliesData.study,
        project: this.assembliesData.project,
        name: this.assembliesData.assembly,
        resolution: resolutionData
      } ]
    }).then((res: any) => { (this as any).alert({ type: res.data.status, msg: res.data.lims_response }) })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  get isGrantNameExist () {
    return this.assembliesData.grant_name ? 0 : 3
  }

  get rejectedBtn () {
    if (this.assembliesData.assembly_type === 'adapto') {
      if (this.assembliesData.segment_primer_status === 'Ordered') return { disabled: true, resolutionData: 'reject' }
      else return { disabled: false, resolutionData: 'reject' }
    } else if (this.assembliesData.segment_status === 'Ordered') return { disabled: true, resolutionData: 'reject' }
    else return { disabled: false, resolutionData: 'reject' }
  }

  get orderSegmentBtn () {
    if (this.assembliesData.assembly_type === 'adapto') {
      if (this.assembliesData.segment_primer_status === 'Ordered') {
        return {
          disabled: true,
          name: 'Order Segment Primers',
          resolutionData: 'orderSegments'
        }
      } else {
        return {
          disabled: false,
          name: 'Order Segment Primers',
          resolutionData: 'orderSegments'
        }
      }
    } else if (this.assembliesData.segment_status === 'Ordered') {
      return {
        disabled: true,
        name: `Order ${this.assembliesData.study === 'Qinglan' ? 'Qinglan' : ''} Segment`,
        resolutionData: 'orderSegments'
      }
    } else {
      return {
        disabled: false,
        name: `Order ${this.assembliesData.study === 'Qinglan' ? 'Qinglan' : ''} Segment`,
        resolutionData: 'orderSegments'
      }
    }
  }

  get OrderJunctionBtn () {
    if (this.assembliesData.assembly_type === 'adapto') {
      if (this.assembliesData.segment_primer_status === 'Ordered') {
        if (this.assembliesData.study !== 'Qinglan') {
          return {
            disabled: false,
            isShow: true,
            name: 'Order Junction Primers',
            resolutionData: 'orderJunctionPrimers'
          }
        } else {
          return {
            disabled: false,
            isShow: false,
            name: 'Order Junction Primers',
            resolutionData: 'orderJunctionPrimers'
          }
        }
      } else {
        if (this.assembliesData.study !== 'Qinglan') {
          return {
            disabled: true,
            isShow: true,
            name: 'Order Junction Primers',
            resolutionData: 'orderJunctionPrimers'
          }
        } else {
          return {
            disabled: true,
            isShow: false,
            name: 'Order Junction Primers',
            resolutionData: 'orderJunctionPrimers'
          }
        }
      }
    } else if (this.assembliesData.segment_status === 'Ordered') {
      if (this.assembliesData.study !== 'Qinglan') {
        return {
          disabled: false,
          isShow: true,
          name: 'Order Junction Primers',
          resolutionData: 'orderJunctionPrimers'
        }
      } else {
        return {
          disabled: false,
          isShow: false,
          name: 'Order Junction Primers',
          resolutionData: 'orderJunctionPrimers'
        }
      }
    } else {
      if (this.assembliesData.study !== 'Qinglan') {
        return {
          disabled: true,
          isShow: true,
          name: 'Order Junction Primers',
          resolutionData: 'orderJunctionPrimers'
        }
      } else {
        return {
          disabled: false,
          isShow: false,
          name: 'Order Junction Primers',
          resolutionData: 'orderJunctionPrimers'
        }
      }
    }
  }
}
</script>
