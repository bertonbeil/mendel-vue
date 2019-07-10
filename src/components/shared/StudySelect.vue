<template>
  <el-col :span="8">
    <el-form :model="studySelectForm" label-position="top" :rules="rules">
      <el-form-item label="Study name:" prop="studyName">
        <el-select v-model="studySelectForm.studyName" @change="projectsList" placeholder="Select study" class="w-full">
          <el-option v-for="(item, i) in studyList" :key="i" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-col>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { httpService } from '@/services/http.service'

@Component({ name: 'StudySelect' })

export default class StudySelect extends Vue {
  @Prop({ required: true }) studyList!: any
  @Prop({ required: true }) getProjectsList!: any

  studySelectForm: any = {
    studyName: ''
  }

  rules: object = {
    studyName: [ { required: true } ]
  }

  projectsList () {
    this.$emit('update:studyName', this.studySelectForm.studyName)
    this.getProjectsList()
  }
}
</script>
