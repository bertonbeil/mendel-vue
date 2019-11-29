<template>
  <div>
    <el-row :gutter="20" class="mb-30">
      <el-col :span="24">
        <h3 class="text-black font-bold">Create new Echo file</h3>
      </el-col>
      <el-col :span="24">
        <p v-html="modalData.dialogIntro" class="mb-8 break-word"></p>
      </el-col>
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
        </el-row>
      </el-form>
    </div>

    <div class="echo-filte-table w-full mb-30">
      <div class="echo-filte-table__body">
        <EchoFileRow
          v-for="(echoRow, index) in tableData"
          @load:on="$emit('loadOn')"
          @load:off="$emit('loadOff')"
          class="echo-file-row p-15"
          :row-data.sync="tableData[index]"
          :row-wells-used.sync="tableData[index].wellsUsed"
          :row-data-index="index"
          :study-list='studyList'
          :assembly-list="assemblyList"
          :key="index" />
      </div>
    </div>

    <div class="flex justify-end w-full px-20 mb-30"> Total wells used: {{ totalWellsUsed }} </div>

    <!-- Junctions visualizations -->
    <el-row class="mb-30">
      <EchoJunctionsVisualizer
        v-for="assembly in echoAssemblies"
        :key="assembly.location"
        :assembly="assembly"
        class="mt-20"
        @change="handleJunctionChange" />
    </el-row>

    <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
      <el-button type="primary" :disabled="!isSubmitDisabled" @click="save">OK</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { DialogBase, EchoFile, EchoFileAssemblyRow } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'
import { _cloneDeep } from '@/utils/helpers'
import { alertMixin } from '@/utils/mixins'

@Component({ name: 'CreateEchoFile', mixins: [alertMixin] })

export default class CreateEchoFile extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  studyList: object[] = []
  projectsList: object[] = []
  assemblyList: any = []
  primers: string[] = []
  assemblies: any = []
  rowIndex: number = 0

  tableData: Array<EchoFileAssemblyRow> = [ {
    id: '1',
    study: '',
    project: '',
    name: '',
    templates: 1,
    segments: 0,
    num_controls: 0,
    location: 'A1',
    negativeCtrl: true,
    positiveCtrl: true,
    waterCtrl: true,
    step: 'None',
    primersLoc: 'A1',
    junctions: []
  }, {
    id: '2',
    study: '',
    project: '',
    name: '',
    templates: 1,
    segments: 0,
    num_controls: 0,
    location: 'A2',
    negativeCtrl: true,
    positiveCtrl: true,
    waterCtrl: true,
    step: 'None',
    primersLoc: 'A1',
    junctions: []
  }, {
    id: '3',
    study: '',
    project: '',
    name: '',
    templates: 1,
    segments: 0,
    num_controls: 0,
    location: 'B1',
    negativeCtrl: true,
    positiveCtrl: true,
    waterCtrl: true,
    step: 'None',
    primersLoc: 'A1',
    junctions: []
  }, {
    id: '4',
    study: '',
    project: '',
    name: '',
    templates: 1,
    segments: 0,
    num_controls: 0,
    location: 'B2',
    negativeCtrl: true,
    positiveCtrl: true,
    waterCtrl: true,
    step: 'None',
    primersLoc: 'A1',
    junctions: []
  }]

  echoCalcRows: any = [
    { primerPairs: null, wellsUsed: null },
    { primerPairs: null, wellsUsed: null },
    { primerPairs: null, wellsUsed: null },
    { primerPairs: null, wellsUsed: null }
  ]

  echoFileForm: EchoFile = {
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

  get sendData () {
    const echoAssembliesCopy = _cloneDeep(this.echoAssemblies)
    // remove unnecessary key
    echoAssembliesCopy.forEach((item: EchoFileAssemblyRow) => { delete item.primersLoc; delete item.step; delete item.id; delete item.wellsUsed })
    return {
      ...this.echoFileForm,
      assemblies: echoAssembliesCopy,
      primers: this.echoAssemblies.map((item: EchoFileAssemblyRow) => ({ location: item.primersLoc }))
    }
  }

  get isSubmitDisabled () {
    if (this.echoAssemblies.length === 0) return false
    return this.echoAssemblies.every((row: EchoFileAssemblyRow) => row.junctions.length)
  }

  /* filtered table data which be sent */
  get echoAssemblies () {
    return this.tableData.filter((row: EchoFileAssemblyRow) => row.study && row.project && row.name)
  }

  get totalWellsUsed () {
    return this.tableData.map(i => i.wellsUsed).reduce((accumulator: any, currentValue: any) => accumulator + currentValue) || 0
  }

  @Watch('totalWellsUsed')
  handleTotalWellsUsed (newVal: number) {
    if (newVal >= 1356) (this as any).alert({ type: 'warning', msg: 'Total wells used are bigger than 1356' })
  }

  /* [EchoJunctionsVisualizer] data for each table row */
  handleJunctionChange ({ junctions, id }: any) {
    let tableDataRow = this.tableData.find((echoRow: EchoFileAssemblyRow) => echoRow.id === id)
    /* build junctions array */
    tableDataRow!.junctions = junctions
      .filter((j: any) => j.isActive === true)
      .map((j: any) => j.junction)
  }

  save () {
    this.$refs['echoFileForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: this.sendData })
      else return false
    })
  }

  /* load Modal data -> Get list of study */
  getStudyList () {
    return httpService.get('query/studyNameList')
      .then((res: any) => {
        this.studyList = res.data.rows
      })
      .catch((err: any) => { throw new Error(err) })
  }

  /* Get list of assemblies */
  getAssemblyList () {
    return httpService.get('query/projectAssemblyList')
      .then((res: any) => {
        this.assemblyList = res.data.rows
      }).catch((err: any) => { console.log(err) })
  }

  getInitialData () {
    this.$emit('loadOn')
    Promise.all([
      this.getStudyList(),
      this.getAssemblyList()
    ])
      .finally(() => {
        this.$emit('loadOff')
      })
  }

  created () {
    this.getInitialData()
  }
}
</script>
