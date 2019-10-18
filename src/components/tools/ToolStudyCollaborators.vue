<template>
  <div class="tool-primer-coverage-wrapper">
    <div class="tool-rimer-coverage">
      <el-row :gutter="20" class="mb-20">
        <el-col :span="24">
          <h3 class="text-black font-bold">Study Collaborators Tool</h3>
        </el-col>
        <el-col :span="24" class="mb-40">
          <p v-html="modalData.dialogIntro"></p>
        </el-col>
        <el-form :model="ToolStudyCollaboratorsForm" label-position="top" :rules="rules" ref="ToolStudyCollaboratorsForm">
          <el-row :gutter="10" class="mb-30">
            <el-col :span="24">
              <el-form-item label="Study:" prop="studyName">
                <el-select
                  v-model="ToolStudyCollaboratorsForm.studyName"
                  @change="getAllColaborators"
                  placeholder="Select study"
                  class="w-full">
                  <el-option v-for="item in studyList" :key="item.name" :label="item.name" :value="item.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          </el-form>
          <el-col :span="24">
            <h5 class="text-black">Collaborators:</h5>
          </el-col>
          <el-col :span="24">
            <p class="mb-20">Drag names from the left box to the right-hand ‘collaborators’ box to assign them as a collaborator. Drag from right to left to remove collaborators. Study collaborators will have read and write access to all of the projects within this study.</p>
          </el-col>
      </el-row>
    </div>

    <!-- Draggable zones -->
    <el-row :gutter="20" class="mb-30 flex" v-if="dataToSend.collaborators.length">
      <el-col :span="12">
        <h3 class="text-black font-bold">MenDEL investigators:</h3>
        <draggable class="min-h-450 el-card is-never-shadow p-10" v-model="investigators" group="collaborators">
          <div class="inline-block w-1/2 p-1 cursor-pointer" v-for="(investigator, index) in investigators" :key="index">
            <el-card shadow="hover" body-style="padding:10px">{{ investigator }}</el-card>
          </div>
        </draggable>
      </el-col>
      <el-col :span="12">
        <h3 class="text-black font-bold">Collaborators:</h3>
        <draggable class="min-h-450 el-card is-never-shadow p-10" v-model="dataToSend.collaborators" group="collaborators">
          <div class="inline-block w-1/2 p-1 cursor-pointer" v-for="(collaborator, index) in dataToSend.collaborators" :key="index">
            <el-card shadow="hover" body-style="padding:10px">{{ collaborator }}</el-card>
          </div>
        </draggable>
      </el-col>
    </el-row>
    <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
      <el-button type="success" @click="save">Save</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { DialogBase, ToolStudysCollaborators } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({ name: 'ToolStudyCollaborators' })

export default class ToolStudyCollaborators extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  studyList: object[] = []
  investigators: object[] = []
  dataToSend = {
    update_study: {},
    collaborators: []
  }

  ToolStudyCollaboratorsForm: ToolStudysCollaborators = {
    studyName: ''
  }

  rules: object = {
    studyName: [{ required: true, message: 'Study name is required' }]
  }

  $refs!: {
    ToolStudyCollaboratorsForm: HTMLFormElement
  }

  getInvestigators () {
    return httpService.post('query/collaboratorList', { study: this.ToolStudyCollaboratorsForm.studyName, scope: 'non_collaborators' })
      .then((res: any) => { this.investigators = res.data.rows.map((investigators : any) => investigators.id) })
      .catch((err: any) => { throw new Error(err) })
  }

  getColaborators () {
    return httpService.post('query/collaboratorList', { study: this.ToolStudyCollaboratorsForm.studyName, scope: 'collaborators' })
      .then((res: any) => { this.dataToSend.collaborators = res.data.rows.map((colaborator : any) => colaborator.id) })
      .catch((err: any) => { throw new Error(err) })
  }

  getAllColaborators () {
    this.$emit('loadOn')
    Promise.all([this.getInvestigators(), this.getColaborators()])
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

  get sendData () {
    this.dataToSend.update_study = { name: this.ToolStudyCollaboratorsForm.studyName }
    return this.dataToSend
  }

  /* submit Modal data */

  save (next?: string) {
    this.$refs['ToolStudyCollaboratorsForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: this.sendData })
      else return false
    })
  }

  created () {
    this.getStudyList()
  }
}
</script>
