<template>
<el-menu text-color="#000" class="el-menu-demo px-20" mode="horizontal">
  <el-menu-item class="pl-0">Mendel@ISG</el-menu-item>

  <!-- Main nav -->
  <el-submenu v-for="(topMenu, menuIndex) in defineMenu" :key="menuIndex" :index="topMenu.menuTitle">
    <template v-if="topMenu.menuTitle" slot="title">{{ topMenu.menuTitle }}</template>
    <!--  -->
    <template v-for="menu in topMenu.items">
      <el-menu-item
        v-if="!(menu.submenuTitle && menu.items)" :key="menu.component" :index="menu.component" @click="select(menu)">{{ menu.title }}</el-menu-item>
      <el-submenu v-else :index="menu.submenuTitle" :key="menu.submenuTitle">
        <template v-if="menu.submenuTitle" slot="title">{{ menu.submenuTitle }}</template>
        <!--  -->
        <template v-for="subMenu in menu.items">
          <el-menu-item v-if="!(subMenu.submenuTitle && menu.items)" :key="subMenu.component" :index="subMenu.component" @click="select(subMenu)">{{ subMenu.title }}</el-menu-item>
        </template>
      </el-submenu>
    </template>
  </el-submenu>

  <el-dropdown
    v-if="userInfo.id !== ''"
    :hide-on-click="false"
    placement="bottom-end"
    class="float-right py-10">
    <span class="el-dropdown-link">
      <span class="inline-flex items-center justify-center w-40 h-40 rounded-full bg-grey mr-10">
        <i class="el-icon-user"></i>
      </span>
      {{ userInfo.id }}
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-if="user.role = 'admin'">Debug mode <el-switch class="ml-15" @click.native="$store.dispatch('toggleDebugMode')" :value="debugMode"></el-switch> </el-dropdown-item>
      <el-dropdown-item disabled>User Info</el-dropdown-item>
      <el-dropdown-item divided>Log Out</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>

</el-menu>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { MainMenu, DialogBase } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({ name: 'MainHeader' })

export default class MainHeader extends Vue {
  user: any = {}

  defineMenu: MainMenu[] = [
    { menuTitle: 'New',
      items: [
        { component: 'CreateStudy', title: 'Study' },
        { component: 'CreateProject', title: 'Project' },
        { submenuTitle: 'De Novo Assembly',
          items: [
            { component: 'CreateDeNovoCDS', title: 'CDS' },
            { component: 'CreateDeNovoAssembly', title: 'Assembly' },
            { component: 'CreateDeNovoSegments', title: 'Segments' },
            { component: 'CreateDeNovoPrimers', title: 'Primers' }
          ]
        },
        { submenuTitle: 'Adapto Assembly',
          items: [
            { component: 'CreateRegionOfInterest', title: 'Region of Interest' },
            { component: 'CreateAdaptoAssembly', title: 'Assembly' },
            { component: 'CreateAdaptoSegments', title: 'Segments' },
            { component: 'CreateAdaptoReSegments', title: 'Re-Segments' },
            { component: 'CreateAdaptoSegmentsManipulation', title: 'Segments manipulation' },
            { component: 'CreateAdaptoPrimers', title: 'Primers' }
          ]
        },
        { component: 'CreateEchoFile', title: 'Echo File' }
      ]
    },
    { menuTitle: 'Import',
      items: [
        { component: 'ImportCDS', title: 'CDS' },
        { component: 'ImportAssembly', title: 'Assembly' },
        { component: 'ImportSegments', title: 'Segments' },
        { component: 'ImportCustomParts', title: 'Custom parts' }
      ]
    },
    { menuTitle: 'Export',
      items: [
        { component: 'ExportAssembly', title: 'Assembly' }
      ]
    },
    { menuTitle: 'Tools',
      items: [
        { component: 'ToolPrimerCoverage', title: 'Primer Coverage Tool' },
        { component: 'ToolStudyCollaborators', title: 'Study Collaborators Tool' },
        { component: 'ToolVisualizer', title: 'Visualizer Tool' },
        { component: 'ToolAssemblyAlignment', title: 'Assembly Alignment Tool' }
      ]
    },
    { menuTitle: 'Reports',
      items: [
        { component: 'ReportStudies', title: 'Studies' },
        { component: 'ReportCDS', title: 'CDS' },
        { component: 'ReportAssemblies', title: 'Assemblies' },
        { component: 'ReportDNASegments', title: 'DNA Segments' },
        { component: 'ReportPrimers', title: 'Primers' },
        { component: 'ReportOrders', title: 'Orders' },
        { component: 'ReportPromoters', title: 'Promoters' },
        { component: 'ReportTerminators', title: 'Terminators' },
        { component: 'ReportVegasAdapters', title: 'Vegas Adapters' },
        { component: 'ReportRestrictionEnzymes', title: 'Restriction Enzymes' }
      ]
    },
    { menuTitle: 'Orders',
      items: [
        { component: 'OrderSelectAssemblies', title: 'Select Assemblies' },
        { component: 'OrderReviewOrders', title: 'Review Orders' },
        { component: 'OrderAssemblyStatus', title: 'Assembly Status' },
        { component: 'OrderBarcodeScanner', title: 'Barcode Scanner' },
        { component: 'OrderQinglanOrders', title: 'Qinglan Orders' }
      ]
    }
  ]

  get debugMode () {
    return this.$store.state.debugMode
  }

  get userInfo () {
    return this.$store.state.user
  }

  @Watch('user')
  onChangeUser () {
    this.defineMenu[6].menuTitle = this.user.id
  }

  select (menuItem: DialogBase) {
    this.$emit('select', menuItem)
  }

  toggleDebugMode (value: boolean) {
    this.$store.commit('set_debugMode', value)
  }

  created () {
    this.$store.dispatch('getUserInfo')
  }
}
</script>
