<template>
    <div class="order-select-assemblies-wrapper">
      <el-row :gutter="20" class="mb-20">
        <el-col :span="24">
          <h3 class="text-black font-bold">Select Assemblies for review and order</h3>
          <p class="break-words">{{ modalData.dialogIntro }}</p>
        </el-col>
      </el-row>

      <el-form :model="orderSelectAssemblyForm" :rules="rules" ref="orderSelectAssemblyForm">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="Study:" prop="study">
              <el-select
                v-model="orderSelectAssemblyForm.study"
                @change="getProjectList"
                placeholder="Select study"
                class="w-full">
                <el-option v-for="item in studyList" :key="item.name" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="Project:" prop="project">
              <el-select
                v-model="orderSelectAssemblyForm.project"
                @change="getAssemblyList"
                :disabled="!orderSelectAssemblyForm.study"
                placeholder="Select Project"
                class="w-full">
                <el-option v-for="item in projectList" :key="item.name" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="Assembly:" prop="assemblies">
              <el-select
                multiple
                collapse-tags
                v-model="orderSelectAssemblyForm.assemblies"
                :disabled="!orderSelectAssemblyForm.project"
                placeholder="Select Assembly"
                class="w-full">
                <el-option v-for="item in assemblyList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="Grant:" prop="grant_name">
              <el-select
                v-model="orderSelectAssemblyForm.grant_name"
                :disabled="!orderSelectAssemblyForm.assemblies.length"
                placeholder="Select Grant"
                class="w-full">
                <el-option v-for="item in grantsList" :key="item.name" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-card class="min-h-100 box-card mb-20">
          <el-tag
            v-for="tag in orderSelectAssemblyForm.assemblies"
            :key="tag"
            closable
            effect="dark"
            class="mx-20"
            @close="removeTag(tag)">>
            {{tag}}
         </el-tag>
      </el-card>

      <div slot="footer" class="text-center">
        <el-button type="danger" @click="$emit('close')">Cancel</el-button>
        <el-button type="primary" @click="save">Save</el-button>
      </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { DialogBase, OrderAssembly } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({ name: 'OrderSelectAssemblies' })

export default class OrderSelectAssemblies extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  studyList: string[] = []
  projectList: string[] = []
  assemblyList: string[] = []
  grantsList: string[] = []
  selectedAssembly: string[] = []

  orderSelectAssemblyForm: OrderAssembly = {
    study: '',
    project: '',
    assemblies: [],
    grant_name: ''
  }

  rules: object = {
    study: [{ required: true, message: 'Study name is required' }],
    project: [{ required: true, message: 'Project name is required' }],
    assemblies: [{ required: true, message: 'Assemblies name is required' }],
    grant_name: [{ required: true, message: 'Grant name is required' }]
  }

  $refs!: {
    orderSelectAssemblyForm: HTMLFormElement
  }

  get sendData () {
    return this.orderSelectAssemblyForm
  }

  save () {
    this.$refs['orderSelectAssemblyForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: this.sendData })
      else return false
    })
  }

  removeTag (tag: any) {
    this.orderSelectAssemblyForm.assemblies = this.orderSelectAssemblyForm.assemblies!.filter((existTag: any) => tag !== existTag)
  }

  getStudyList () {
    return httpService.get('query/studyNameList')
      .then((res: any) => { this.studyList = res.data.rows })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  getProjectList () {
    this.$emit('loadOn')
    return httpService.post('query/projectNameList', { study: this.orderSelectAssemblyForm.study })
      .then((res: any) => {
        this.orderSelectAssemblyForm.project = ''
        this.orderSelectAssemblyForm.assemblies = []
        this.orderSelectAssemblyForm.grant_name = ''
        this.projectList = res.data.rows
      })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  getAssemblyList () {
    this.$emit('loadOn')
    return httpService.post('query/availableAssemblyList', {
      study: this.orderSelectAssemblyForm.study,
      project: this.orderSelectAssemblyForm.project
    }).then((res: any) => {
      this.orderSelectAssemblyForm.assemblies = []
      this.orderSelectAssemblyForm.grant_name = ''
      this.assemblyList = res.data.assemblies
    }).catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  getGrantsList () {
    return httpService.post('query/grantsForUser', { user: this.$store.state.user.id })
      .then((res: any) => { this.grantsList = res.data.grantsList })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  getInitialData () {
    this.$emit('loadOn')
    Promise.all([this.getStudyList(), this.getGrantsList()])
      .then(() => { })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  created () {
    this.getInitialData()
  }
}
</script>
