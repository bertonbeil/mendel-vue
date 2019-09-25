<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="23">
        <p v-html="modalData.dialogIntro" class="mb-8"></p>
      </el-col>
      <el-col :span="1">
        <el-popover
          placement="top-start"
          width="300"
          trigger="hover">
          <i slot="reference" class="el-icon-info cursor-pointer text-green"></i>
          <div v-html="modalData.dialogInfo"></div>
        </el-popover>
      </el-col>
    </el-row>
    <!-- Main modal content -->
    <div class="mb-30">
      <el-form :model="projectForm" label-position="top" :rules="rules" ref="projectForm">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Study name:" prop="study">
              <el-select v-model="projectForm.study" placeholder="Select" class="w-full">
                <el-option v-for="item in studyList" :key="item.name" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Project name:" prop="name">
              <el-input v-model="projectForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Project description (optional):">
              <el-input v-model="projectForm.description"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Project type">
              <el-radio-group v-model="projectType" class="flex flex-col">
                <el-radio label="denovo" class="my-12">Denovo assembly (design a pathway from scratch)</el-radio>
                <el-radio label="adapto" >Adapto assembly (re-write a sequence that exists in nature)</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
      <el-button type="success" @click="save('next')">Save and Next</el-button>
      <el-button type="primary" @click="save">Save</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { DialogBase, Project } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

type ProjectType = 'denovo' | 'adapto'

@Component({ name: 'CreateProject' })

export default class CreateProject extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  studyList: object[] = []
  projectType: ProjectType = 'denovo'

  projectForm: Project = {
    study: '',
    name: '',
    description: ''
  }

  rules: object = {
    study: [ { required: true } ],
    name: [ { required: true, message: 'Please input Project name', trigger: 'blur' } ]
  }

  $refs!: {
    projectForm: HTMLFormElement
  }

  get sendData () {
    return { ...this.projectForm, type: this.projectType }
  }

  /* submit Modal data */
  save (next?: string) {
    this.$refs['projectForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: this.sendData }, next === 'next' ? this.modalData.saveAndNext : null)
      else return false
    })
  }

  /* loda Modal data */
  getStudyList () {
    this.$emit('loadOn')
    return httpService.get('query/studyNameList')
      .then((res: any) => {
        this.studyList = res.data.rows
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  created () {
    this.getStudyList()
      .then(() => {
        if (this.modalData.hasOwnProperty('saveAndNextData')) this.projectForm.study = this.modalData.saveAndNextData.new_study.name
      })
  }
}
</script>
