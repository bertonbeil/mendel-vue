<template>
  <el-row class="mb-20 mt-20 rounded bg-gray-200 border-solid border-gray-300">
    <el-col :span="4">
      <p class="truncate p-5">{{orderName}}</p>
    </el-col>
    <el-col :span="2">
      <p class="truncate p-5">{{localSegmentData.name}}</p>
    </el-col>
    <el-col :span="6">
      <p class="truncate p-5">{{localSegmentData.value}}</p>
    </el-col>
    <el-col :span="5" class="mr-10">
      <el-select
        placeholder="Select marker"
        v-model="localSegmentData.grants"
        :value="localSegmentData.grants"
        class="w-full"
      >
        <el-option v-for="grant in grants" :key="grant" :value="grant" :label="grant"></el-option>
      </el-select>
    </el-col>
    <el-col :span="5">
      <el-select
        placeholder="Select marker"
        v-model="localSegmentData.markers"
        :value="localSegmentData.markers"
        class="w-full"
      >
        <el-option value="amp" label="amp">amp</el-option>
        <el-option value="kan" label="kan">kan</el-option>
      </el-select>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { _cloneDeep } from '@/utils/helpers'

@Component({ name: 'SegmentDetailsRow' })
export default class SegmentDetailsRow extends Vue {
  @Prop({ required: true }) segmentData!: any;
  @Prop({ required: true }) orderName!: string;
  @Prop({ required: true }) grants!: any;

  localSegmentData: object[] = [];

  @Watch('localSegmentData', { deep: true })
  hendleRowChange () {
    this.$emit('update:segmentData', this.localSegmentData)
  }

  created () {
    this.localSegmentData = _cloneDeep(this.segmentData)
  }
}
</script>
