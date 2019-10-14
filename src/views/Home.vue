<template>
  <div>
    <MainHeader @select="onSelect" />
    <!-- Main modal wrapper -->
    <el-dialog
      :visible="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleClose"
      custom-class="lims-dialog mb-0"
      top="60px"
      width="100%">
      <component
        :is="tempModalData.component"
        :modalData="tempModalData"
        class="pb-45"
        ref="modalRef"
        :isLoading.sync="isLoading"
        @loadOn="showLoader"
        @loadOff="isLoading.close()"
        @save="onSave"
        @close="handleClose">
      </component>

      <div v-if="$store.state.debugMode && $refs.modalRef && $refs.modalRef.sendData" class="w-full fixed bottom-0 left-0 bg-white z-10">
        <el-collapse accordion class="max-h-450" v-model="isDebugerActive">
          <el-collapse-item title="Debug" name="isActive" class="pl-10">
            <pre class="pr-10" :class="{'overflow-y-auto max-h-400': isDebugerActive}" >{{ $refs.modalRef.sendData }}</pre>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { DialogBase } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'
import { Loading } from 'element-ui'
import { capitalize } from '@/utils/helpers'
import { alertMixin } from '@/utils/mixins'

@Component({ name: 'Home', mixins: [ alertMixin ] })

export default class Home extends Vue {
  dialogVisible: boolean = false
  tempModalData: DialogBase = {} as DialogBase

  /* modal loading ctrl */
  isLoading: any = null

  testLoading = true
  isDebugerActive = ''

  /* base optins set up for MessageBox dialog */
  confirmOptions = {
    confirmButtonText: 'Ok',
    cancelButtonText: 'Cancel',
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false
  }

  $refs!: {
    modalRef: any
  }

  get debugMode () {
    return this.$store.state.debugMode
  }

  /* open root Modal with passed prop */
  onSelect ({ component }: DialogBase) {
    this.dialogVisible = true
    this.tempModalData = this.setTempModalData(component)
  }

  /* submit Modal data */
  onSave (modalData: any, to: string) {
    this.showLoader()
    console.log(modalData)
    httpService.post(`query/${this.tempModalData.submitUrl}`, JSON.stringify(modalData.data))
      .then((res: any) => {
        if (res.data.status === 'error') {
          this.responseMessage(res.data)
        } else {
          if (to) this.tempModalData = { ...this.setTempModalData(to), saveAndNextData: modalData.data }
          else this.responseMessage(res.data)
          this.isLoading.close()
        }
      })
      .catch((err: any) => { this.isLoading = false; throw new Error(err) })
  }

  /* find and set TempModal data by component name */
  setTempModalData (component: any): DialogBase {
    return this.$store.state.modalDataList.slice().find((i: any) => i.component === component) as DialogBase
  }

  /* set Loadin servise */
  showLoader () {
    this.isLoading = this.$loading({ target: '.el-dialog' })
  }

  /* modal close handler */
  handleClose (isCloseOnSave: boolean) {
    this.confirmClose()
  }

  /* before close handler */
  confirmClose () {
    this.$confirm('Sure you want to leave? All progress will be lost!', 'Warning', { type: 'warning', ...this.confirmOptions })
      .then(() => this.closeModal())
      .catch(() => false)
  }

  /* will close root Modal and reset temp Modal Data */
  closeModal () {
    this.dialogVisible = false
    this.tempModalData = {} as DialogBase
  }

  /* response viewer */
  responseMessage ({ lims_response, status }: any) {
    (this as any).alert({ type: status, msg: lims_response })
      .then(() => {
        this.isLoading.close()
        if (status === 'success') this.closeModal()
      })
  }
}
</script>
