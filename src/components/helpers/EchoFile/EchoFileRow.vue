<template>
  <div class='flex w-full items-center justify-between'>
    <div class="w-100 flex-shrink-0 mr-20 flex h-40 items-center relative">
      <div v-if="rowDataIndex === 0" class="table-heading">Study</div>
      <el-select v-model="echoRowData.study" size="small" placeholder="Select study" @change="getProjectsList">
        <el-option v-for="(item, i) in studyList" :key="i" :label="item.name" :value="item.name"></el-option>
      </el-select>
    </div>
    <div class="w-100 flex-shrink-0 mr-20 flex h-40 items-center relative">
      <div v-if="rowDataIndex === 0" class="table-heading">Project</div>
      <el-select v-model="echoRowData.project" size="small" placeholder="Select projct" :disabled="echoRowData.study === ''" @change="handleProjectSelect">
        <el-option v-for="(item, i) in projectsList" :key="i" :label="item.name" :value="item.name"></el-option>
      </el-select>
    </div>
    <div class="w-100 flex-shrink-0 mr-20 flex h-40 items-center relative">
      <div v-if="rowDataIndex === 0" class="table-heading">Assembly</div>
      <el-select v-model="echoRowData.name" size="small" placeholder="Select assembly" :disabled="echoRowData.project === ''" @change="handleAssemblySelect">
        <el-option v-for="(item, i) in assemblySelectList" :key="i" :label="item.assembly" :value="item.assembly"></el-option>
      </el-select>
    </div>
    <div class="w-60 mr-20 flex h-40 items-center relative">
      <div v-if="rowDataIndex === 0" class="table-heading">Quadrant</div>
      <EchoQuadrant :activeCell='echoRowData.location' class="mr-20 flex h-40 items-center relative" />
    </div>
    <div class="w-85 flex-shrink-0 mr-20 flex h-40 items-center relative">
      <div v-if="rowDataIndex === 0" class="table-heading">Templates
        <el-popover placement="top" width="320" trigger="hover" content="Number of template colonies to be tested.">
          <i slot="reference" class="el-icon-info cursor-pointer text-green"></i>
        </el-popover>
      </div>
      <el-input v-model.number="echoRowData.templates" size="small" :disabled="echoRowData.name === ''"></el-input>
    </div>
    <div class="w-70 mr-20 flex h-40 items-center justify-center relative">
      <div v-if="rowDataIndex === 0" class="table-heading w-full text-center">Segments</div>
      {{echoRowData.segments}}
    </div>
    <div class="w-70 h-40 flex items-center justify-center relative">
      <div v-if="rowDataIndex === 0" class="table-heading w-full text-center">Neg Ctrl
        <el-popover placement="top" width="320" trigger="hover" content="genomic DNA prepped from yeast carrying an empty vector control.">
          <i slot="reference" class="el-icon-info cursor-pointer text-green"></i>
        </el-popover>
      </div>
      <el-checkbox v-model="echoRowData.negativeCtrl"></el-checkbox>
    </div>
    <div class="w-70 h-40 flex items-center justify-center relative">
      <div v-if="rowDataIndex === 0" class="table-heading w-full text-center">Pos Ctrl
        <el-popover placement="top" width="320" trigger="hover" content="Gibson reaction of all the parts in the assembly including the vector.">
          <i slot="reference" class="el-icon-info cursor-pointer text-green"></i>
        </el-popover>
      </div>
      <el-checkbox v-model="echoRowData.positiveCtrl"></el-checkbox>
    </div>
    <div class="w-70 h-40 flex items-center justify-center relative">
      <div v-if="rowDataIndex === 0" class="table-heading w-full text-center">H20 Ctrl
        <el-popover placement="top" width="320" trigger="hover" content="No DNA control.">
          <i slot="reference" class="el-icon-info cursor-pointer text-green"></i>
        </el-popover>
      </div>
      <el-checkbox v-model="echoRowData.waterCtrl"></el-checkbox>
    </div>
    <div class="w-80 flex-shrink-0 mr-20 flex h-40 items-center relative">
      <div v-if="rowDataIndex === 0" class="table-heading">Primers Loc</div>
      <el-input v-model="echoRowData.primersLoc" size="small" :disabled="echoRowData.name === ''"></el-input>
    </div>
    <div class="w-100 flex-shrink-0 mr-20 flex h-40 items-center relative">
      <div v-if="rowDataIndex === 0" class="table-heading">Step</div>
      <el-select v-model="echoRowData.step" size="small" default-first-option :disabled="echoRowData.name === '' && echoRowData.segments === 0">
        <el-option v-for="item in [ 'None', 1, 2, 4 ]" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </div>
    <div class="w-120 flex-shrink-0">
      <p> #primer pairs {{ primerPairs }} </p>
      <p> #wells used {{ wellsUsed }} </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { EchoFileAssemblyRow } from '@/utils/interfaces'
import { _cloneDeep } from '@/utils/helpers'
import { httpService } from '@/services/http.service'

@Component({ name: 'EchoFileRow' })

export default class EchoFileRow extends Vue {
  @Prop({ required: true }) rowData!: EchoFileAssemblyRow
  @Prop({ required: true }) rowDataIndex!: number
  @Prop({ required: true }) studyList: any
  @Prop({ required: true }) assemblyList: any
  @Prop({ required: true }) rowWellsUsed: any

  echoRowData = {} as EchoFileAssemblyRow
  projectsList: object[] = []
  assemblyType: string = ''

  /* filtered Assembly list depended on selected project */
  get assemblySelectList () {
    return this.assemblyList.filter((a: any) => a.project === this.echoRowData.project)
  }

  /* 'location'value for key depended on index */
  get rowLocation (): string {
    switch (this.rowDataIndex) {
      case 0: return 'A1'
      case 1: return 'A2'
      case 2: return 'B1'
      case 3: return 'B2'
    }

    return ''
  }

  get primerPairs () {
    const number = this.assemblyTypeNumber
    if (this.rowData.junctions.length) {
      return this.echoRowData.name === '' ? 0 : this.rowData.junctions.length * number + this.numControls
    } else return this.rowData.junctions.length
  }

  get assemblyTypeNumber () {
    switch (this.assemblyType) {
      case 'denovo': return 4
      case 'adapto': return 2
      default : return 2
    }
  }

  get wellsUsed () {
    return (this.echoRowData.templates + 3) * this.primerPairs
  }

  get numControls () {
    return (this.echoRowData.negativeCtrl ? 1 : 0) + (this.echoRowData.positiveCtrl ? 1 : 0) + (this.echoRowData.waterCtrl ? 1 : 0)
  }

  /* Get list of projects */
  getProjectsList (value: string) {
    this.resetRow()
    this.$emit('load:on')
    return httpService.post('query/projectNameList', { study: value })
      .then((res: any) => {
        this.projectsList = res.data.rows
      })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => { this.$emit('load:off') })
  }

  resetRow () {
    this.echoRowData.project = ''
    this.echoRowData.name = ''
    this.echoRowData.templates = 1
    this.echoRowData.segments = 0
    this.echoRowData.location = this.rowLocation
    this.echoRowData.step = 'None'
  }

  handleProjectSelect (value: any) {
    this.echoRowData.name = ''
  }

  /* find amount of segments on selected assembly and set it to echoRowData */
  handleAssemblySelect (value: any) {
    const assembly = this.assemblyList.find((a: any) => a.assembly === value)
    this.echoRowData.segments = assembly.segments
    this.$emit('load:on')
    return httpService.post('query/assemblyType', { study: this.echoRowData.study, project: this.echoRowData.project, assembly: assembly.assembly })
      .then((res: any) => { this.assemblyType = res.data.assembly_type })
      .catch((err) => { throw new Error(err) })
      .finally(() => this.$emit('load:off'))
  }

  @Watch('rowData.junctions', { immediate: true, deep: true })
  handleJunctions () {
    this.$emit('update:rowWellsUsed', this.wellsUsed)
  }

  @Watch('echoRowData', { immediate: false, deep: true })
  handleRowChange () {
    this.$emit('update:rowData', { ...this.echoRowData, junctions: this.rowData.junctions, wellsUsed: this.wellsUsed, num_controls: this.numControls })
  }

  created () {
    this.echoRowData = _cloneDeep(this.rowData)
  }
}
</script>
