<template>
<el-menu text-color="#000" class="el-menu-demo" mode="horizontal" @select="handleSelect">
  <el-menu-item >Mendel@ISG</el-menu-item>
  <el-submenu index="Design">
    <template slot="title">New</template>
    <el-menu-item index="CreateStudy">Study</el-menu-item>
    <el-menu-item index="CreateProject">Project</el-menu-item>
    <el-submenu index="DeNovo">
      <template slot="title">De Novo Assembly</template>
      <el-menu-item index="CreateNewCDS">CDS</el-menu-item>
      <el-menu-item index="CreateNewAssembly">Assembly</el-menu-item>
      <el-menu-item index="CreateNewSegments">Segments</el-menu-item>
      <el-menu-item index="Primers">Primers</el-menu-item>
    </el-submenu>
  </el-submenu>
</el-menu>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: "MainHeader"
})
export default class MainHeader extends Vue {
  handleSelect (e: any) {
    console.log(e)
  }
}
</script>
