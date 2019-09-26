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
        <el-option v-for="(item, i) in assemblyList.filter(a => a.project === echoRowData.project)" :key="i" :label="item.assembly" :value="item.assembly"></el-option>
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
import { _cloneDeep } from '@/utils/helpers'
import { httpService } from '@/services/http.service'

@Component({ name: 'EchoFileRow' })

export default class EchoFileRow extends Vue {
  @Prop({ required: true }) rowData: any
  @Prop({ required: true }) rowDataIndex!: number
  @Prop({ required: true }) studyList: any
  @Prop({ required: true }) assemblyList: any

  echoRowData = {} as any
  projectsList: object[] = []

  created () {
    this.echoRowData = _cloneDeep(this.rowData)
  }

  /* Get list of projects */
  getProjectsList (value: string) {
    this.resetRow()
    this.$emit('loadOn')
    return httpService.post('query/projectNameList', { study: value })
      .then((res: any) => {
        this.projectsList = res.data.rows
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  resetRow () {
    this.echoRowData.project = ''
    this.echoRowData.name = ''
    this.echoRowData.templates = 1
    this.echoRowData.segments = 0
    this.echoRowData.location = 'A1'
    this.echoRowData.step = 'None'
  }

  /* find amount of segments on selected assembly and set it to echoRowData */
  handleAssemblySelect (value: any) {
    const assembly = this.assemblyList.find((a: any) => a.assembly === value)
    this.echoRowData.segments = assembly.segments
  }

  @Watch('echoRowData', { immediate: false, deep: true })
  handleRowChange () {
    this.$emit('update:rowData', this.echoRowData)
  }
}
</script>
