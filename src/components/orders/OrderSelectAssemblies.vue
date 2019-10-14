<template>
    <div class="order-select-assemblies-wrapper">
      <el-row :gutter="20" class="mb-20">
        <el-col :span="24">
          <h3 class="text-black font-bold">Select Assemblies for review and order</h3>
          <p class="break-words">{{modalData.dialogIntro}}</p>
        </el-col>
      </el-row>

      <el-form :model="orderSelectAssemblyForm" :rules="rules" ref="orderSelectAssemblyForm">
        <el-row :gutter="20" class="mb-30">
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
                v-model="orderSelectAssemblyForm.assemblies"
                @change="selectAssembly"
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
                placeholder="Select Grant"
                class="w-full">
                <el-option v-for="item in grantsList" :key="item.name" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-card v-if="selectedAssembly.length" class="box-card">
          <el-tag
            v-for="tag in selectedAssembly"
            :key="tag"
            closable
            effect="dark"
            class="mx-20"
            @close="handleClose(tag)">>
            {{tag}}
         </el-tag>
      </el-card>

      <div slot="footer" class="text-center">
        <el-button type="danger" @click="$emit('close')">Cancel</el-button>
        <el-button type="primary" @click="save">save</el-button>
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

    orderSelectAssemblyForm : OrderAssembly = {
      study: '',
      project: '',
      assemblies: '',
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

    handleClose (tag: any) {
      this.selectedAssembly = this.selectedAssembly.filter((existTag: any) => tag !== existTag)
    }

    selectAssembly (value: any) {
      this.selectedAssembly = [...this.selectedAssembly, value]
    }

    getGrantsList () {
      this.$emit('loadOn')
      return httpService.post('query/grantsForUser', { user: this.$store.state.user.id })
        .then((res: any) => { this.grantsList = res.data.grantsList })
        .catch((err: any) => { throw new Error(err) })
        .finally(() => this.$emit('loadOff'))
    }

    getAssemblyList () {
      this.$emit('loadOn')
      return httpService.post('query/availableAssemblyList', { study: this.orderSelectAssemblyForm.study, project: this.orderSelectAssemblyForm.project })
        .then((res: any) => { this.assemblyList = res.data.assemblies })
        .catch((err: any) => { throw new Error(err) })
        .finally(() => this.$emit('loadOff'))
    }

    getProjectList () {
      this.$emit('loadOn')
      return httpService.post('query/projectNameList', { study: this.orderSelectAssemblyForm.study })
        .then((res: any) => { this.projectList = res.data.rows })
        .catch((err: any) => { throw new Error(err) })
        .finally(() => this.$emit('loadOff'))
    }

    getStudyList () {
      this.$emit('loadOn')
      return httpService.get('query/studyNameList')
        .then((res: any) => { this.studyList = res.data.rows })
        .catch((err: any) => { throw new Error(err) })
        .finally(() => this.$emit('loadOff'))
    }

    created () {
      this.getStudyList()
    }
}
</script>
