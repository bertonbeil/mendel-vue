<template>
  <div class='flex w-full'>
    <div>
      <el-select v-model="echoRowData.study" placeholder="Select study" @change="getProjectsList">
        <el-option v-for="(item, i) in studyList" :key="i" :label="item.name" :value="item.name"></el-option>
      </el-select>
    </div>
    <div>
      <el-select v-model="echoRowData.project" placeholder="Select projct" :disabled="echoRowData.study === ''">
        <el-option v-for="(item, i) in projectsList" :key="i" :label="item.name" :value="item.name"></el-option>
      </el-select>
    </div>
    <div>
      <el-select v-model="echoRowData.name" placeholder="Select assembly" :disabled="echoRowData.project === ''" @change="handleAssemblySelect">
        <el-option v-for="(item, i) in assemblySelectList" :key="i" :label="item.assembly" :value="item.assembly"></el-option>
      </el-select>
    </div>
    <div>
      <EchoQuadrant :activeCell='echoRowData.location' />
    </div>
    <div>
      <el-input v-model="echoRowData.templates"></el-input>
    </div>
    <div>
      {{echoRowData.segments}}
    </div>
    <div>
      <el-checkbox v-model="echoRowData.negativeCtrl"></el-checkbox>
    </div>
    <div>
      <el-checkbox v-model="echoRowData.positiveCtrl"></el-checkbox>
    </div>
    <div>
      <el-checkbox v-model="echoRowData.waterCtrl"></el-checkbox>
    </div>
    <div>
      <el-input v-model="echoRowData.primersLoc"></el-input>
    </div>
    <div>
      <el-select v-model="echoRowData.step" default-first-option>
        <el-option v-for="item in [ 'None', 1, 2, 4 ]" :key="item" :label="item" :value="item"></el-option>
      </el-select>
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

  echoRowData = {} as EchoFileAssemblyRow
  projectsList: object[] = []

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

  /* find amount of segments on selected assembly and set it to echoRowData */
  handleAssemblySelect (value: any) {
    const assembly = this.assemblyList.find((a: any) => a.assembly === value)
    this.echoRowData.segments = assembly.segments
  }

  @Watch('echoRowData', { immediate: false, deep: true })
  handleRowChange () {
    this.$emit('update:rowData', { ...this.echoRowData, num_controls: (this.echoRowData.negativeCtrl ? 1 : 0) + (this.echoRowData.positiveCtrl ? 1 : 0) + (this.echoRowData.waterCtrl ? 1 : 0) })
  }

  created () {
    this.echoRowData = _cloneDeep(this.rowData)
  }
}
</script>
