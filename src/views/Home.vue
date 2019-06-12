<template>
  <div>
    <MainHeader @select="onSelect" />

    <!-- Main modal wrapper -->
    <el-dialog
      :title="tempModalData.dialogCaption"
      :visible="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleClose"
      top="60px"
      width="100%"
      ref="rootDialog">
        <component
          :title.sync="tempModalData.dialogCaption"
          :is="tempModalData.component"
          :modalData="tempModalData"
          :isLoading.sync="isLoading"
          @loadOn="showLoader"
          @loadOff="isLoading.close()"
          @save="onSave"
          @close="handleClose">
        </component>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { DialogBase } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'
import { Loading } from 'element-ui'

@Component({ name: 'Home' })

export default class Home extends Vue {
  dialogVisible: boolean = false
  tempModalData: DialogBase = {} as DialogBase
  /* modal loading ctrl */
  isLoading: any = null
  /* base optins set up for MessageBox dialog */
  confirmOptions = {
    confirmButtonText: 'Ok',
    cancelButtonText: 'Cancel',
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false
  }

  /* open root Modal with passed prop */
  onSelect ({ component }: DialogBase) {
    this.dialogVisible = true
    this.tempModalData = this.setTempModalData(component)
  }

  /* submit Modal data */
  onSave (modalData: any, to: string) {
    this.showLoader()
    httpService.post(`query/${this.tempModalData.submitUrl}`, modalData.data)
      .then((res: any) => {
        if (to) {
          if (res.data.status === 'error') this.responseMessage(res.data)
          else {
            this.tempModalData = { ...this.setTempModalData(to), saveAndNextData: modalData.data }
            this.isLoading.close()
          }
        } else {
          this.isLoading.close()
          this.responseMessage(res.data)
        }
      }).catch((err: any) => { this.isLoading = false; console.log(err) })
  }

  /* find and set TempModal data by component name */
  setTempModalData (component: any): DialogBase {
    return this.$store.state.modalDataList.slice().find((i: any) => i.component === component) as DialogBase
  }

  /* set Loagin servise */
  showLoader () {
    this.isLoading = this.$loading({ target: '.el-dialog' })
  }

  /* modal close handled */
  handleClose (isCloseOnSave: boolean) {
    this.confirmClose()
  }

  /* will close root Modal and reset temp Modal Data */
  closeModal () {
    this.dialogVisible = false; this.tempModalData = {} as DialogBase
  }

  /* modal close confirm MessageBox */
  confirmClose () {
    this.$confirm('Sure you want to leave? All progress will be lost!', 'Warning', { type: 'warning', ...this.confirmOptions })
      .then(() => {
        this.closeModal()
      }).catch(() => { })
  }

  /* response viewer */ /* eslint-disable */
  responseMessage ({ lims_response, status }: any) {
    this.$confirm(`${lims_response}`, `${status.charAt(0).toUpperCase() + status.slice(1)}`, { type: status, center: true, ...this.confirmOptions }) /* eslint-enable */
      .then(() => this.isLoading.close())
      .catch(() => {
        this.isLoading.close()
        this.closeModal()
      })
  }
}
</script>
