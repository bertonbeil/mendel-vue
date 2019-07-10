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
                    <el-select v-model="scope.row.project" placeholder="Select project" @change="getAssemblyList(scope.$index)">
                      <el-option v-for="(item, i) in projectsList" :key="i" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="Assembly">
                <template slot-scope="scope">
                  <el-form-item size="mini">
                    <el-select v-model="scope.row.name" placeholder="Select project" @change="getSegments(scope.$index)">
                      <el-option v-for="(item, i) in scope.row.assemblyList" :key="i" :label="item.assembly" :value="item.assembly"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="location" label="Quadrant">
                <template slot-scope="scope">
                  <EchoQuadrant :activeCell='scope.row.location' />
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
              <el-table-column prop="primersLoc" label="Primers Loc">
                <template slot-scope="scope">
                  <el-form-item size="mini">
                    <el-input v-model="scope.row.primersLoc"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="step" label="Step">
                <template slot-scope="scope">
                  <el-form-item size="mini">
                    <el-select v-model="scope.row.step">
                      <el-option v-for="item in [1,2,4]" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="4" class="mt-35">
            <div v-for="(item, i) in echoCalcRows" :key="i" class="mt-25">
              <p>#primer pairs {{ item.primerPairs }}</p>
              <p>#wells used {{ item.wellsUsed }}</p>
            </div>
            <p class="mt-30">Total wells used: {{ totalWellsUsed }}</p>
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
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { DialogBase, EchoFile } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({ name: 'CreateEchoFile' })

export default class CreateEchoFile extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  projectsList: object[] = []
  assemblyList: any = []
  primers: string[] = []
  assemblies: any = []
  totalWellsUsed: number = 0
  rowIndex: number = 0

  tableData: any = [ {
    project: '',
    name: '',
    templates: 1,
    segments: 0,
    num_controls: 0,
    location: 'A1',
    negativeCtrl: true,
    positiveCtrl: true,
    waterCtrl: true,
    step: 1,
    primersLoc: 'A1',
    assemblyList: []
  }, {
    project: '',
    name: '',
    templates: 1,
    segments: 0,
    num_controls: 0,
    location: 'A2',
    negativeCtrl: true,
    positiveCtrl: true,
    waterCtrl: true,
    step: 1,
    primersLoc: 'A1',
    assemblyList: []
  }, {
    project: '',
    name: '',
    templates: 1,
    segments: 0,
    num_controls: 0,
    location: 'B1',
    negativeCtrl: true,
    positiveCtrl: true,
    waterCtrl: true,
    step: 1,
    primersLoc: 'A1',
    assemblyList: []
  }, {
    project: '',
    name: '',
    templates: 1,
    segments: 0,
    num_controls: 0,
    location: 'B2',
    negativeCtrl: true,
    positiveCtrl: true,
    waterCtrl: true,
    step: 1,
    primersLoc: 'A1',
    assemblyList: []
  } ]

  echoCalcRows: any = [
    { primerPairs: null, wellsUsed: null },
    { primerPairs: null, wellsUsed: null },
    { primerPairs: null, wellsUsed: null },
    { primerPairs: null, wellsUsed: null }
  ]

  echoFileForm: EchoFile = {
    project: '',
    dna_amount: 10.0,
    primer_amount: 10.0,
    primer_control_location: 'P24'
  }

  rules: object = {
    dna_amount: [ { required: true } ],
    primer_amount: [ { required: true } ],
    primer_control_location: [ { required: true } ]
  }

  $refs!: {
    echoFileForm: HTMLFormElement
  }

  @Watch('tableData', { deep: true })
  calcRows () {
    this.tableData.map((item: any, i: any) => {
      item.num_controls = (item.negativeCtrl ? 1 : 0) + (item.positiveCtrl ? 1 : 0) + (item.waterCtrl ? 1 : 0)
      if (i === this.rowIndex) {
        this.echoCalcRows[i].primerPairs = (this.tableData[i].segments + 1) * 2 + 1
        this.echoCalcRows[i].wellsUsed = (this.tableData[i].templates + 3) * this.echoCalcRows[i].primerPairs
      }
    })
    this.totalWellsUsed = 0
    this.echoCalcRows.map((item: any) => { this.totalWellsUsed += item.wellsUsed })
  }

  save () {
    this.assemblies = this.tableData.filter((item: any) => item.name !== '')
    this.assemblies.map((item: any) => { delete item.assemblyList; delete item.project; delete item.primersLoc })
    this.assemblies.map((item: any) => this.primers.push({ location: item.primersLoc } as any))
    // console.log({ ...this.echoFileForm, assemblies: this.assemblies, primers: this.primers })
    this.$refs['echoFileForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: { ...this.echoFileForm, assemblies: this.assemblies, primers: this.primers } })
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
  getAssemblyList (index: number) {
    this.rowIndex = index
    this.$emit('loadOn')
    return httpService.get('query/projectAssemblyList')
      .then((res: any) => {
        this.assemblyList = res.data.rows
        const name = this.tableData[index].project
        const assemblies = res.data.rows.filter((a: any) => a.project === name)
        this.tableData[index].assemblyList = assemblies
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  /* Get segments of rows */
  getSegments (index: any) {
    this.tableData[index].assemblyList.map((item: any) => {
      if (item.assembly === this.tableData[index].name) this.tableData[index].segments = item.segments
    })
  }

  created () {
    this.getProjectsList()
  }
}
</script>
