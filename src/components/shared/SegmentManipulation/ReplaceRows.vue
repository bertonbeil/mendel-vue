<template>
  <el-row :gutter="20" class="mb-30">
    <el-col :span="5">
      <el-select v-model="localReplaceRow.segment_type" @change="getCustomSegmentList" placeholder="Select type" class="w-full">
        <el-option v-for="item in typesList" :key="item.name" :label="item.name" :value="item.name"></el-option>
      </el-select>
    </el-col>
    <el-col :span="5">
      <el-select v-model="localReplaceRow.name" @change="handleNameChange" placeholder="Select name" class="w-full">
        <el-option v-for="(item, i) in localCustomSegments" :key="i" :label="item.name" :value="item.name"></el-option>
      </el-select>
    </el-col>
    <el-col :span="4">
      <el-input v-model="localReplaceRow.description" placeholder="Description" disabled></el-input>
    </el-col>
    <el-col :span="4">
      <el-input v-model="localReplaceRow.value" placeholder="Sequence" disabled></el-input>
    </el-col>
    <el-col :span="5">
      <el-select v-model="localReplaceRow.direction" placeholder="Select direction" class="w-full">
        <el-option v-for="(item, i) in directionList" :key="i" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { httpService } from '@/services/http.service'
import { _cloneDeep } from '@/utils/helpers'

@Component({ name: 'ReplaceRows' })

export default class ReplaceRows extends Vue {
  @Prop({ required: true }) replaceRow: any
  @Prop({ required: true }) studyName!: string
  @Prop({ required: true }) projectName!: string[]
  @Prop({ required: true }) typesList!: string[]

  directionList: any[] = [ { label: '5`', value: '5' }, { label: '3`', value: '3' } ]

  localReplaceRow = {}
  localCustomSegments = []

  getCustomSegmentList (value: any) {
    return httpService.post('query/customSegmentList', {
      study: this.studyName,
      project: this.projectName,
      type: value
    }).then((res: any) => { this.localCustomSegments = res.data.rows })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  handleNameChange (name: string) {
    const { description, value } = this.localCustomSegments.find((s: any) => s.name === name) as any
    this.localReplaceRow = { ...this.localReplaceRow, description, value }
  }

  created () {
    this.localReplaceRow = _cloneDeep(this.replaceRow)
  }

  @Watch('localReplaceRow', { deep: true })
  handleReplaceRowChange () {
    this.$emit('update:replaceRow', this.localReplaceRow)
  }
}
</script>
