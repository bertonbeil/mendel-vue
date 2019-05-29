<template>
<el-menu text-color="#000" class="el-menu-demo" mode="horizontal">
  <el-menu-item>Mendel@ISG</el-menu-item>

  <!-- Main nav -->
  <el-submenu v-for="(topMenu, menuIndex) in defineMenu" :key="menuIndex" :index="topMenu.menuTitle">
    <template v-if="topMenu.menuTitle" slot="title">{{ topMenu.menuTitle }}</template>
    <!--  -->
    <template v-for="menu in topMenu.items">
      <el-menu-item
        v-if="!(menu.submenuTitle && menu.items)" :key="menu.component" :index="menu.component" @click="select(menu)" >{{ menu.title }}</el-menu-item>
      <el-submenu v-else :index="menu.submenuTitle" :key="menu.submenuTitle">
        <template v-if="menu.submenuTitle" slot="title">{{ menu.submenuTitle }}</template>
        <!--  -->
        <template v-for="subMenu in menu.items">
          <el-menu-item v-if="!(subMenu.submenuTitle && menu.items)" :key="subMenu.component" :index="subMenu.component" @click="select(subMenu)">{{ subMenu.title }}</el-menu-item>
        </template>
      </el-submenu>
    </template>
  </el-submenu>

</el-menu>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { MainMenu, DialogBase } from '@/utils/interfaces'
@Component({
  name: 'MainHeader'
})
export default class MainHeader extends Vue {
  select (menuItem: DialogBase) {
    this.$emit('select', menuItem)
  }

  defineMenu: MainMenu[] = [
    { menuTitle: 'New',
      items: [
        {
          component: 'CreateStudy',
          title: 'Study',
          dialogCaption: 'Create new Study',
          dialogIntro: 'Create a new study here. A study is the highest level or organization within MenDEL, and groups related projects together. They can be thought of as representing general research focus areas, while the projects within them represent more specific questions being investigated within that area.<br><br>An example: You create a study titled "Prototrophic mammalian cell line", and within it create projects relating to individual pathways necessary, such as "Valine biosynthesis".',
          dialogInfo: '<p>One way to distinguish between Studies and Projects is to think of Studies as general focus areas and to think of Projects as questions within that focus area that you would like to answer. Under each Project, you will then be able to create multiple assemblies, which is useful if, say, you want to create multiple versions of the same pathway.</p><br><p>Example: You create a study titled ‘Prototrophic Mammalian Cell Line’ and you create a Project titled ‘Valine biosynthesis’. Within this Project, you are able to create multiple versions of the valine biosynthetic pathway e.g. by swapping out CDSes and regulatory elements.</p>',
          submitUrl: 'studyDesigner'
        },
        {
          component: 'CreateProject',
          title: 'Project',
          dialogCaption: 'Create new Project',
          dialogIntro: 'Create a new project here. A project is the second-highest level or organization within MenDEL, and groups related assemblies together. Projects address a particular question as part of a study, and can be thought of as representing ‘folders’ within a study. A given project will be populated with one or more assemblies, either unique or simply variants of each other.<br><br>In our example: You create a study titled ‘Prototrophic mammalian cell line’, and within it create projects relating to individual pathways necessary. Within the ‘Valine biosynthesis’ project, you design and assemble several different version of biosynthetic pathways to produce valine.',
          dialogInfo: '<p>A project is used to address a particular question that is part of a study. Projects represent sub-folders within a study.</p><p>Once you create a new project, you populate it with as many assemblies as you would like that are related to the project question. A project will likely contain not only multiple assemblies, but also multiple versions of any given assembly.</p><br><p>To create a project:</p><p>1. Enter Project Name: Give your project a simple but descriptive name. Example: Valine biosynthesis pathway from E. coli with independent TUs</p><p>2. Description: While this is optional, it is advised to provide some small level of detail here so you don’t forget the overall goal of the project.  Also, this allows the foundry staff and management to keep track of what is being worked on at a glance.</p>',
          submitUrl: 'projectDesigner'
        },
        { submenuTitle: 'De Novo Assembly',
          items: [
            { component: 'CreateDeNovoCDS', title: 'CDS', dialogCaption: 'Create new CDSs' },
            { component: 'CreateDeNovoAssembly', title: 'Assembly', dialogCaption: 'Create new de novo Assembly' },
            { component: 'CreateDeNovoSegments', title: 'Segments', dialogCaption: 'Create Segments' },
            { component: 'CreateDeNovoPrimers', title: 'Primers', dialogCaption: 'Create new Junction primers' }
          ]
        },
        { submenuTitle: 'Adapto Assembly',
          items: [
            { component: 'CreateRegionOfInterest', title: 'Region of Interest', dialogCaption: 'Region of Interest' },
            { component: 'CreateAdaptoAssembly', title: 'Assembly', dialogCaption: 'Assembly' },
            { component: 'CreateAdaptoSegments', title: 'Segments', dialogCaption: 'Segment Assembly' },
            { component: 'CreateAdaptoPrimers', title: 'Primers', dialogCaption: 'Create new Junction primers' }
          ]
        },
        { component: 'CreateEchoFile', title: 'Echo File' }
      ]
    },
    { menuTitle: 'Import',
      items: [
        { component: 'ImportCDS', title: 'CDS' },
        { component: 'ImportAssembly', title: 'Assembly' },
        { component: 'ImportSegments', title: 'Segments' }
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
}
</script>
