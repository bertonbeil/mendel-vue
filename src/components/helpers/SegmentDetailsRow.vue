<template>
  <el-row class="mb-20 mt-20 rounded bg-gray-200 border-solid border-gray-300">
    <el-col :span="4">
      <p class="truncate p-5 ">{{orderName}}</p>
    </el-col>
    <el-col :span="2">
      <p class="truncate p-5 ">{{segmentData.name}}</p>
    </el-col>
    <el-col :span="6">
      <p class="truncate p-5 ">{{segmentData.value}}</p>
    </el-col>
    <el-col :span="5" class="mr-10">
      <el-select placeholder="Select marker" v-model="data.grands" :value="data.grands" class="w-full">
        <el-option v-for="grand in segmentData.grands" :key="grand" :value="grand" :label="grand"></el-option>
      </el-select>
    </el-col>
    <el-col :span="5">
      <el-select placeholder="Select marker" v-model="data.marker" :value="data.marker" class="w-full">
        <el-option value="amp" label="amp">amp</el-option>
        <el-option value="kan" label="kan">kan</el-option>
      </el-select>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({ name: 'SegmentDetailsRow' })
export default class SegmentDetailsRow extends Vue {
  @Prop({ required: true }) segmentData!: any;
  @Prop({ required: true }) orderName!: string;

  data = {
    [name]: this.segmentData,
    value: this.segmentData.value,
    grands: '',
    marker: ''

  } as object;
}
</script>
