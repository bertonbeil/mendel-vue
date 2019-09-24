<template>
  <el-col :span="8">
    <el-form :model="selectForm" label-position="top" :rules="rules">
      <el-form-item :label="labelTemplate" prop="name">
        <el-select v-model="selectForm.name" @change="listMethod" :placeholder="placeholderTemplate" class="w-full">
          <el-option v-for="(item, i) in list" :key="i" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-col>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { httpService } from '@/services/http.service'

@Component({ name: 'ProjectSelect' })

export default class ProjectSelect extends Vue {
  @Prop({ required: false }) getList!: any
  @Prop({ required: true }) label!: any
  @Prop({ required: true }) list!: any

  labelTemplate: string = `${this.label} name:`
  placeholderTemplate: string = `Select ${this.label}`

  selectForm: any = {
    name: ''
  }

  rules: object = {
    name: [ { required: true } ]
  }

  listMethod () {
    this.$emit('update:name', this.selectForm.name)
    if (this.label !== 'Assembly') this.getList()
  }
}
</script>
