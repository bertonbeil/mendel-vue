<template>
  <div>
    <MainHeader @onSelect="showModal" />

    <!-- Main modal wrapper -->
    <el-dialog
      title="Tips"
      :visible.sync="dialogVisible"
      width="30%">
        <component :is="activeComponent"></component>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MainHeader from '@/components/layouts/MainHeader.vue'
import CreateStudy from '@/components/design/CreateStudy.vue'
@Component({
  name: 'App',
  components: { MainHeader, CreateStudy }
})
export default class App extends Vue {
  dialogVisible: boolean = false
  activeComponent: string = ''

  showModal (component: string) {
    this.dialogVisible = true
    this.activeComponent = component
  }
}
</script>
