import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    modalDataList: [
      {
        component: 'CreateStudy',
        title: 'Study',
        dialogCaption: 'Create new Study',
        dialogIntro: 'Create a new study here. A study is the highest level or organization within MenDEL, and groups related projects together. They can be thought of as representing general research focus areas, while the projects within them represent more specific questions being investigated within that area.<br><br>An example: You create a study titled "Prototrophic mammalian cell line", and within it create projects relating to individual pathways necessary, such as "Valine biosynthesis".',
        dialogInfo: '<p>One way to distinguish between Studies and Projects is to think of Studies as general focus areas and to think of Projects as questions within that focus area that you would like to answer. Under each Project, you will then be able to create multiple assemblies, which is useful if, say, you want to create multiple versions of the same pathway.</p><br><p>Example: You create a study titled ‘Prototrophic Mammalian Cell Line’ and you create a Project titled ‘Valine biosynthesis’. Within this Project, you are able to create multiple versions of the valine biosynthetic pathway e.g. by swapping out CDSes and regulatory elements.</p>',
        submitUrl: 'studyDesigner',
        saveAndNext: 'CreateProject'
      },
      {
        component: 'CreateProject',
        title: 'Project',
        dialogCaption: 'Create new Project',
        dialogIntro: 'Create a new project here. A project is the second-highest level or organization within MenDEL, and groups related assemblies together. Projects address a particular question as part of a study, and can be thought of as representing ‘folders’ within a study. A given project will be populated with one or more assemblies, either unique or simply variants of each other.<br><br>In our example: You create a study titled ‘Prototrophic mammalian cell line’, and within it create projects relating to individual pathways necessary. Within the ‘Valine biosynthesis’ project, you design and assemble several different version of biosynthetic pathways to produce valine.',
        dialogInfo: '<p>A project is used to address a particular question that is part of a study. Projects represent sub-folders within a study.</p><p>Once you create a new project, you populate it with as many assemblies as you would like that are related to the project question. A project will likely contain not only multiple assemblies, but also multiple versions of any given assembly.</p><br><p>To create a project:</p><p>1. Enter Project Name: Give your project a simple but descriptive name. Example: Valine biosynthesis pathway from E. coli with independent TUs</p><p>2. Description: While this is optional, it is advised to provide some small level of detail here so you don’t forget the overall goal of the project.  Also, this allows the foundry staff and management to keep track of what is being worked on at a glance.</p>',
        submitUrl: 'projectDesigner',
        saveAndNext: 'CreateDeNovoCDS'
      },
      {
        component: 'CreateDeNovoCDS',
        title: 'CDS',
        dialogCaption: 'Create new CDSs',
        dialogIntro: 'This page allows you to generate codon optimized coding sequences (CDSs) for de novo assemblies.',
        submitUrl: 'bioPartDesigner'
      },
      {
        component: 'CreateDeNovoAssembly',
        title: 'Assembly',
        dialogCaption: 'Create new de novo Assembly',
        dialogIntro: 'This page allows you to define your de novo assembly options, as well as define which previously added or imported CDS’ to include in the assembly.',
        dialogInfo: 'Note: If you are designing a new assembly use a short descriptive name. If you are modifying an existing assembly modify the name with version number (V1, V2 ….)',
        submitUrl: 'dnaDesigner'
      },
      {
        component: 'CreateDeNovoSegments',
        title: 'Segments',
        dialogCaption: 'Create Segments'
      },
      { component: 'CreateDeNovoPrimers', title: 'Primers', dialogCaption: 'Create new Junction primers' },
      { component: 'CreateRegionOfInterest', title: 'Region of Interest', dialogCaption: 'Region of Interest' },
      { component: 'CreateAdaptoAssembly', title: 'Assembly', dialogCaption: 'Assembly' },
      { component: 'CreateAdaptoSegments', title: 'Segments', dialogCaption: 'Segment Assembly' },
      { component: 'CreateAdaptoPrimers', title: 'Primers', dialogCaption: 'Create new Junction primers' }
    ]
  },
  mutations: {

  },
  actions: {

  }
})
