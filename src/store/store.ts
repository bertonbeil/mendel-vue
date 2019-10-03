import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import { httpService } from '@/services/http.service'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    debugMode: true,
    isAuth: false,
    user: {
      id: '',
      role: ''
    },
    modalDataList: [
      {
        component: 'CreateStudy',
        title: 'Study',
        dialogIntro: 'Create a new study here. A study is the highest level or organization within MenDEL, and groups related projects together. They can be thought of as representing general research focus areas, while the projects within them represent more specific questions being investigated within that area.<br><br>An example: You create a study titled "Prototrophic mammalian cell line", and within it create projects relating to individual pathways necessary, such as "Valine biosynthesis".',
        dialogInfo: '<p>One way to distinguish between Studies and Projects is to think of Studies as general focus areas and to think of Projects as questions within that focus area that you would like to answer. Under each Project, you will then be able to create multiple assemblies, which is useful if, say, you want to create multiple versions of the same pathway.</p><br><p>Example: You create a study titled ‘Prototrophic Mammalian Cell Line’ and you create a Project titled ‘Valine biosynthesis’. Within this Project, you are able to create multiple versions of the valine biosynthetic pathway e.g. by swapping out CDSes and regulatory elements.</p>',
        submitUrl: 'studyDesigner',
        saveAndNext: 'CreateProject'
      },
      {
        component: 'CreateProject',
        title: 'Project',
        dialogIntro: 'Create a new project here. A project is the second-highest level or organization within MenDEL, and groups related assemblies together. Projects address a particular question as part of a study, and can be thought of as representing ‘folders’ within a study. A given project will be populated with one or more assemblies, either unique or simply variants of each other.<br><br>In our example: You create a study titled ‘Prototrophic mammalian cell line’, and within it create projects relating to individual pathways necessary. Within the ‘Valine biosynthesis’ project, you design and assemble several different version of biosynthetic pathways to produce valine.',
        dialogInfo: '<p>A project is used to address a particular question that is part of a study. Projects represent sub-folders within a study.</p><p>Once you create a new project, you populate it with as many assemblies as you would like that are related to the project question. A project will likely contain not only multiple assemblies, but also multiple versions of any given assembly.</p><br><p>To create a project:</p><p>1. Enter Project Name: Give your project a simple but descriptive name. Example: Valine biosynthesis pathway from E. coli with independent TUs</p><p>2. Description: While this is optional, it is advised to provide some small level of detail here so you don’t forget the overall goal of the project.  Also, this allows the foundry staff and management to keep track of what is being worked on at a glance.</p>',
        submitUrl: 'projectDesigner',
        saveAndNext: 'CreateDeNovoCDS'
      },
      {
        component: 'CreateDeNovoCDS',
        title: 'CDS',
        dialogIntro: 'This page allows you to generate codon optimized coding sequences (CDSs) for de novo assemblies.',
        submitUrl: 'bioPartDesigner',
        saveAndNext: 'CreateDeNovoAssembly'
      },
      {
        component: 'CreateDeNovoAssembly',
        title: 'Assembly',
        dialogIntro: 'This page allows you to define your de novo assembly options, as well as define which previously added or imported CDS’ to include in the assembly.',
        dialogInfo: 'Note: If you are designing a new assembly use a short descriptive name. If you are modifying an existing assembly modify the name with version number (V1, V2 ….)',
        submitUrl: 'dnaDesigner',
        saveAndNext: 'CreateDeNovoSegments'
      },
      {
        component: 'CreateDeNovoSegments',
        title: 'Segments',
        submitUrl: 'segmentDesigner',
        saveAndNext: 'ExportAssembly'
      },
      {
        component: 'CreateDeNovoPrimers',
        title: 'Primers',
        submitUrl: 'primerDesigner',
        saveAndNext: 'ExportAssembly'
      },
      {
        component: 'CreateRegionOfInterest',
        title: 'Region of Interest',
        dialogIntro: 'Here you can define the locus of interest that you will be building with your adapto assembly. You can specify a genome and chromosome position or paste/upload the desired locus sequence below.',
        submitUrl: 'locusRegionDesigner',
        saveAndNext: 'CreateAdaptoAssembly'
      },
      {
        component: 'CreateAdaptoAssembly',
        title: 'Assembly',
        submitUrl: 'adaptoAssemblyDesigner'
      },
      {
        component: 'CreateAdaptoSegments',
        title: 'Segments',
        dialogIntro: 'This page allows you to define parameters for segmenting a locus of interest into parts for assembly. Assembly segments are overlapping sequences derived via PCR amplification from a genome or existing BAC. The output of segmentation is a list of segments as well as the primers for amplifying those segments.',
        submitUrl: 'adaptoSegmentDesigner'
      },
      {
        component: 'CreateAdaptoReSegments',
        title: 'Re-Segments',
        dialogIntro: 'This page allows you to define parameters for segmenting a locus of interest into parts for assembly. Assembly segments are overlapping sequences derived via PCR amplification from a genome or existing BAC. The output of segmentation is a list of segments as well as the primers for amplifying those segments.',
        submitUrl: 'adaptoSegmentDesigner'
      },
      {
        component: 'CreateAdaptoSegmentsManipulation',
        title: 'Segments manipulation',
        submitUrl: 'adaptoSegmentDesigner'
      },
      {
        component: 'CreateAdaptoPrimers',
        title: 'Primers',
        dialogIntro: 'This page allows you to define parameters for designing junction primers for confirming correct assemblies by PCR across the segment junctions. By default the algorithm will design primers for the last segmentation done on the specified locus.',
        submitUrl: 'primerDesigner',
        saveAndNext: 'ExportAssembly'
      },
      {
        component: 'CreateEchoFile',
        title: 'Echo file',
        dialogIntro: 'Use this tool to design the Echo file to analyse your assembly using junction primers designed by MenDEL.',
        submitUrl: 'echoDesigner'
      },
      {
        component: 'ImportCDS',
        title: 'Import CDS',
        dialogIntro: 'This page allows you to import CDS’ designed outside of MenDEL. You will provide the desired DNA sequence of your CDS’, which will not be further recoded.',
        dialogInfo: '<p>One way to distinguish between Studies and Projects is to think of Studies as general focus areas and to think of Projects as questions within that focus area that you would like to answer. Under each Project, you will then be able to create multiple assemblies, which is useful if, say, you want to create multiple versions of the same pathway.</p><br><p>Example: You create a study titled ‘Prototrophic Mammalian Cell Line’ and you create a Project titled ‘Valine biosynthesis’. Within this Project, you are able to create multiple versions of the valine biosynthetic pathway e.g. by swapping out CDSes and regulatory elements.</p>',
        submitUrl: 'bioPartDesigner'
      },
      {
        component: 'ImportAssembly',
        title: 'Import Assembly',
        dialogIntro: 'This page allows you to import a completely designed assembly sequence done outside MenDEL (i.e. in SnapGene or Geneious). If you rather want to design a de novo or adapto assembly, you should carry out the design within MenDEL.',
        dialogInfo: '<p>Note: The imported sequence will not be modified in any way upon import. For example, terminal restriction sites will not be added. Once imported the sequence will be inserted into the selected assembly vector for segmentation and primer design steps.</p>',
        submitUrl: 'dnaDesigner'
      },
      {
        component: 'ImportCustomParts',
        title: 'Import Custom Parts',
        dialogIntro: 'This page allows you to import segments for commercial gene synthesis (e.g. Qinglan). You should only use this for segments unrelated to adapto and/or de novo assemblies and cannot otherwise be designed in MenDEL.',
        submitUrl: 'dnaDesigner'
      },
      {
        component: 'ImportSegments',
        title: 'Import Segments',
        dialogIntro: 'This page allows you to import externally designed or modified segments matched to an assembly. The imported coordinates will be used to segment the previously imported assembly sequence and design junction primers.',
        submitUrl: 'segmentDesigner'
      },
      {
        component: 'ExportAssembly',
        title: 'Assembly',
        dialogIntro: 'Export a CSV file and a Genbank file with all information about your assembly.'
      },
      {
        component: 'AccountInfo',
        dialogIntro: 'User Details'
      }
    ]
  },

  mutations: {
    set_debugMode (state, value) {
      state.debugMode = value
    },

    set_user (state, value) {
      state.user = value
    }
  },

  actions: {
    toggleDebugMode ({ commit, state }) {
      commit('set_debugMode', !state.debugMode)
    },

    manageAuth ({ commit }) {
      httpService.get('query/whoAmI')
        .then((res: any) => {
          commit('set_user', res.data.user)
          if (this.state.user.role === 'None') router.push('/login')
          else this.state.isAuth = true
        })
        .catch((err: any) => { throw new Error(err) })
    }
  }
})
