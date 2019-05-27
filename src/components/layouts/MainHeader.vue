<template>
<el-menu text-color="#000" class="el-menu-demo" mode="horizontal" @select="$emit('onSelect', $event)">
  <el-menu-item >Mendel@ISG</el-menu-item>

  <!-- Main nav -->
  <el-submenu v-for="(topMenu, menuIndex) in defineMenu" :key="menuIndex" :index="topMenu.submenuTitle">
    <template v-if="topMenu.submenuTitle" slot="title">{{ topMenu.submenuTitle }}</template>
    <template v-for="menu in topMenu.items">
      <el-menu-item v-if="!(menu.submenuTitle && menu.items)" :key="menu.component" :index="menu.component">{{ menu.title }}</el-menu-item>
      <el-submenu v-else :index="menu.submenuTitle" :key="menu.submenuTitle">
        <template v-if="menu.submenuTitle" slot="title">{{ menu.submenuTitle }}</template>
        <template v-for="subMenu in menu.items">
          <el-menu-item v-if="!(subMenu.submenuTitle && menu.items)" :key="subMenu.component" :index="subMenu.component">{{ subMenu.title }}</el-menu-item>
          <el-submenu v-else :index="subMenu.submenuTitle" :key="subMenu.submenuTitle">
            <template v-if="subMenu.submenuTitle" slot="title">{{ subMenu.submenuTitle }}</template>
            <el-menu-item v-if="!(subMenu.submenuTitle && subMenu.items)" :key="subMenu.component"></el-menu-item>
          </el-submenu>
        </template>
      </el-submenu>
    </template>
  </el-submenu>

</el-menu>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'MainHeader'
})
export default class MainHeader extends Vue {
  defineMenu: any = [
    { submenuTitle: 'New',
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
            { component: 'CreateAdaptoPrimers', title: 'Primers' }
          ]
        },
        { component: 'CreateEchoFile', title: 'Echo File' }
      ]
    },
    { submenuTitle: 'Import',
      items: [
        { component: 'ImportCDS', title: 'CDS' },
        { component: 'ImportAssembly', title: 'Assembly' },
        { component: 'ImportSegments', title: 'Segments' }
      ]
    },
    { submenuTitle: 'Export',
      items: [
        { component: 'ExportAssembly', title: 'Assembly' }
      ]
    },
    { submenuTitle: 'Tools',
      items: [
        { component: 'ToolPrimerCoverage', title: 'Primer Coverage Tool' },
        { component: 'ToolStudyCollaborators', title: 'Study Collaborators Tool' },
        { component: 'ToolVisualizer', title: 'Visualizer Tool' },
        { component: 'ToolAssemblyAlignment', title: 'Assembly Alignment Tool' }
      ]
    },
    { submenuTitle: 'Reports',
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
    { submenuTitle: 'Orders',
      items: [
        { component: 'OrderSelectAssemblies', title: 'Select Assemblies' },
        { component: 'OrderReviewOrders', title: 'Review Orders' },
        { component: 'OrderAssemblyStatus', title: 'Assembly Status' },
        { component: 'OrderBarcodeScanner', title: 'Barcode Scanner' },
        { component: 'OrderQinglanOrders', title: 'Qinglan Orders' }
      ]
    }
  ]
}
</script>
