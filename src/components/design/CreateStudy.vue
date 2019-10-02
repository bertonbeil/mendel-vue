<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24">
        <h3 class="text-black font-bold">Create new Study</h3>
      </el-col>
      <el-col :span="23">
        <p v-html="modalData.dialogIntro" class="mb-8 break-word"></p>
      </el-col>
      <el-col :span="1">
        <el-popover placement="top-start" width="300" trigger="hover">
          <i slot="reference" class="el-icon-info cursor-pointer text-green"></i>
          <div v-html="modalData.dialogInfo" class="break-word"></div>
        </el-popover>
      </el-col>
    </el-row>
    <!-- Main modal content -->
    <div>
      <el-form :model="studyForm" label-position="top" :rules="rules" ref="studyForm">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Study name:" prop="name">
              <el-input v-model="studyForm.name" placeholder="Study name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Study description (optional):">
              <el-input v-model="studyForm.description" placeholder="Enter a brief but memorable description of your study"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="mb-20">
          <el-col :span="24">
            <h4 class="text-xl text-black mt-3">Collaborators:</h4>
            <p>If you will have lab members working with you on this study, assign them here. Drag names from the left box to the right-hand ‘collaborators’ box to assign them as a collaborator. Study collaborators will have read and write access to all of the projects within this study.</p>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="mb-20">
          <el-col :span="12">
            <p class="text-xl text-black">Investigators</p>
          </el-col>
          <el-col :span="12">
            <p class="text-xl text-black">Collaborators</p>
          </el-col>
          <el-col :span="24" class="mt-2">
            <p>Note: Investigators that you add here as collaborators will have read and write access to all of the projects and assemblies in this study</p>
          </el-col>
        </el-row>

        <!-- Draggable zones -->
        <el-row :gutter="20" class="mb-30 flex">
          <el-col :span="12">
            <draggable class="p-3 rounded shadow-lg" v-model="investigators" group="collaborators">
              <div class="inline-block w-1/2 p-1 cursor-pointer" v-for="investigator in investigators" :key="investigator">
                <el-card shadow="hover" body-style="padding:10px">{{ investigator }}</el-card>
              </div>
            </draggable>
          </el-col>
          <el-col :span="12">
            <draggable class="min-h-full p-3 rounded shadow-lg" v-model="collaborators" group="collaborators">
              <div class="inline-block w-1/2 p-1 cursor-pointer" v-for="collaborator in collaborators" :key="collaborator">
                <el-card shadow="hover" body-style="padding:10px">{{ collaborator }}</el-card>
              </div>
            </draggable>
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
import { DialogBase, Study } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({ name: 'CreateStudy' })

export default class CreateStudy extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  investigators: string[] = []
  collaborators: string[] = []

  studyForm: Study = {
    name: '',
    description: ''
  }

  rules: object = {
    name: [ { required: true, message: 'Study name is required' } ]
  }

  $refs!: {
    studyForm: HTMLFormElement
  }

  get sendData () {
    return JSON.stringify({ new_study: this.studyForm, collaborators: this.collaborators })
  }

  /* submit Modal data */
  save (next?: string) {
    this.$refs['studyForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: this.sendData }, next === 'next' ? this.modalData.saveAndNext : null)
      else return false
    })
  }

  /* loda Modal data */
  getCollaboratorList () {
    this.$emit('loadOn')
    return httpService.get('query/collaboratorList')
      .then((res: any) => { this.investigators = res.data.rows.map((investigator: any) => investigator.id) })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  created () {
    this.getCollaboratorList()
  }
}
</script>
