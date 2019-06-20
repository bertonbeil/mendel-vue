<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24"><p v-html="modalData.dialogIntro" class="mb-8"></p></el-col>
    </el-row>
    <!-- Main modal content -->
    <div class="mb-30">
      <el-form :model="echoFileForm" label-position="top" :rules="rules" ref="echoFileForm">
        <el-row :gutter="20" class="mb-30">
          <el-col :span="8">
            <el-form-item label="Template DNA Amount:" prop="dna_amount">
              <el-input-number v-model="echoFileForm.dna_amount" class="w-full"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Primer Amount:" prop="primer_amount">
              <el-input-number v-model="echoFileForm.primer_amount" class="w-full"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Primer Control:" prop="primer_control_location">
              <el-input v-model="echoFileForm.primer_control_location" class="w-full"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="20">
            <el-table :data="tableData" style="width: 100%" cell-class-name="table-cell">
              <el-table-column prop="project" label="Project">
                <template slot-scope="scope">
                  <el-form-item size="mini">
                    <el-select v-model="scope.row.project" placeholder="Select project">
                      <el-option v-for="item in projectsList" :key="item.name" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="Assembly">
                <template slot-scope="scope">
                  <el-form-item size="mini">
                    <el-select v-model="scope.row.name" placeholder="Select project" @change="getAssemblyList">
                      <el-option v-for="item in assemblyList" :key="item.name" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="quadrant" label="Quadrant">
                <template slot-scope="scope">
                  <div v-html="scope.row.quadrant"></div>
                </template>
              </el-table-column>
              <el-table-column prop="templates" label="Templates">
                <template slot-scope="scope">
                  <el-form-item size="mini">
                    <el-input v-model="scope.row.templates"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="segments" label="Segments"></el-table-column>
              <el-table-column prop="negativeCtrl" label="Neg ctrl">
                <template slot-scope="scope">
                  <el-form-item size="mini">
                    <el-checkbox v-model="scope.row.negativeCtrl"></el-checkbox>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="positiveCtrl" label="Pos ctrl">
                <template slot-scope="scope">
                  <el-form-item size="mini">
                    <el-checkbox v-model="scope.row.positiveCtrl"></el-checkbox>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="waterCtrl" label="H20 ctrl">
                <template slot-scope="scope">
                  <el-form-item size="mini">
                    <el-checkbox v-model="scope.row.waterCtrl"></el-checkbox>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="location" label="Primers Loc">
                <template slot-scope="scope">
                  <el-form-item size="mini">
                    <el-input v-model="scope.row.location"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="step" label="Step">
                <template slot-scope="scope">
                  <el-form-item size="mini">
                    <el-select v-model="scope.row.step" @change="getAssemblyList">
                      <el-option v-for="item in [1,2,4]" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
      <el-button type="primary" @click="save">OK</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { DialogBase, EchoFile } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'
import { Project } from '../../utils/interfaces'

@Component({ name: 'CreateEchoFile' })

export default class CreateEchoFile extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  projectsList: object[] = []
  assemblyList: object[] = []
  primers: string[] = []
  tableData: any[] = [
    {
      project: '',
      name: '',
      quadrant: `<div class='flex flex-wrap w-40 h-40'>
        <div class="w-20 h-20 bg-green-light border border-solid border-black rounded-full"></div>
        <div class="w-20 h-20 border border-solid border-black rounded-full"></div>
        <div class="w-20 h-20 border border-solid border-black rounded-full"></div>
        <div class="w-20 h-20 border border-solid border-black rounded-full"></div>
      </div>`,
      templates: '1',
      segments: '0',
      negativeCtrl: true,
      positiveCtrl: true,
      waterCtrl: true,
      location: 'A1',
      step: 1
    },
    {
      project: '',
      name: '',
      quadrant: `<div class='flex flex-wrap w-40 h-40'>
        <div class="w-20 h-20 border border-solid border-black rounded-full"></div>
        <div class="w-20 h-20 bg-green-light border border-solid border-black rounded-full"></div>
        <div class="w-20 h-20 border border-solid border-black rounded-full"></div>
        <div class="w-20 h-20 border border-solid border-black rounded-full"></div>
      </div>`,
      templates: '1',
      segments: '0',
      negativeCtrl: true,
      positiveCtrl: true,
      waterCtrl: true,
      location: 'A1',
      step: 1
    },
    {
      project: '',
      name: '',
      quadrant: `<div class='flex flex-wrap w-40 h-40'>
        <div class="w-20 h-20 border border-solid border-black rounded-full"></div>
        <div class="w-20 h-20 border border-solid border-black rounded-full"></div>
        <div class="w-20 h-20 bg-green-light border border-solid border-black rounded-full"></div>
        <div class="w-20 h-20 border border-solid border-black rounded-full"></div>
      </div>`,
      templates: '1',
      segments: '0',
      negativeCtrl: true,
      positiveCtrl: true,
      waterCtrl: true,
      location: 'A1',
      step: 1
    },
    {
      project: '',
      name: '',
      quadrant: `<div class='flex flex-wrap w-40 h-40'>
        <div class="w-20 h-20 border border-solid border-black rounded-full"></div>
        <div class="w-20 h-20 border border-solid border-black rounded-full"></div>
        <div class="w-20 h-20 border border-solid border-black rounded-full"></div>
        <div class="w-20 h-20 bg-green-light border border-solid border-black rounded-full"></div>
      </div>`,
      templates: '1',
      segments: '0',
      num_controls: 3, // (negativeCtrl ? 1 : 0) + (positiveCtrl ? 1 : 0) + (waterCtrl ? 1 : 0)
      negativeCtrl: true,
      positiveCtrl: true,
      waterCtrl: true,
      location: 'A1',
      step: 1
    }
  ]

  echoFileForm: EchoFile = {
    project: '',
    dna_amount: 10.0,
    primer_amount: 10.0,
    primer_control_location: 'P24'
  }

  // project: '',
  // dna_amount: '10.0',
  // primer_amount: '10.0',
  // primer_control_location: 'P24',
  // assemblies: [
  //   {
  //     name: 'A_test_011',
  //     templates: 1,
  //     segments: 0,
  //     num_controls: (negativeCtrl ? 1 : 0) + (positiveCtrl ? 1 : 0) + (waterCtrl ? 1 : 0),
  //     location: 'A1',
  //     negativeCtrl: true,
  //     positiveCtrl: true,
  //     waterCtrl: true,
  //     step: 1
  //   }
  // ],
  // primers: [ { location: 'A1' } ]

  rules: object = {
    dna_amount: [ { required: true } ],
    primer_amount: [ { required: true } ],
    primer_control_location: [ { required: true } ]
  }

  $refs!: {
    echoFileForm: HTMLFormElement
  }

  save () {
    this.tableData.map(i => this.primers.push({ location: i.location } as any))
    this.$refs['echoFileForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: { ...this.echoFileForm, assemblies: this.tableData, primers: this.primers } })
      else return false
    })
  }

  /* Get list of projects */
  getProjectsList () {
    this.$emit('loadOn')
    return httpService.get('query/projectNameList')
      .then((res: any) => {
        this.projectsList = res.data.rows
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  /* Get list of assemblies */
  getAssemblyList () {
    this.$emit('loadOn')
    return httpService.post('query/projectAssemblyList', { project: this.tableData[0].project })
      .then((res: any) => {
        this.assemblyList = res.data.rows
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  created () {
    this.getProjectsList()
  }
}
</script>
