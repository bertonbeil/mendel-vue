<template>
  <div>
    <MainHeader @select="onSelect" />

    <!-- Main modal wrapper -->
    <el-dialog
      :title="activeComponent.dialogCaption"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="60px"
      width="100%">
        <component :is="activeComponent.component" :modalData="activeComponent" @save="onSave" @saveAndNext="onSaveAndNext" @close="dialogVisible = false"></component>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { DialogBase } from '@/utils/interfaces'

@Component({
  name: 'Home'
})
export default class Home extends Vue {
  dialogVisible: boolean = false
  activeComponent: DialogBase = {} as DialogBase

  onSelect (menuItem: DialogBase) {
    if (menuItem.component) {
    this.dialogVisible = true
    this.activeComponent = menuItem
    }
  }

  onSave (modalData: any) {
    console.log('on save: ', modalData)    
  }

  onSaveAndNext () {

  }
  
}
</script>
