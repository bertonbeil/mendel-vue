<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="23">
        <p v-html="modalData.dialogIntro" class="mb-8"></p>
      </el-col>
      <el-col :span="1">
        <el-popover
          placement="top-start"
          width="300"
          trigger="hover">
          <i slot="reference" class="el-icon-info cursor-pointer text-green-600"></i>
          <div v-html="modalData.dialogInfo"></div>
        </el-popover>
      </el-col>
    </el-row>
    <!-- Main modal content -->
    <div>
      <el-form :model="studyForm" label-position="top" :rules="rules" ref="studyForm">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Study name:" prop="name">
              <el-input v-model="studyForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Study description (optional):" prop="description">
              <el-input v-model="studyForm.description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <h4 class="text-xl text-black mt-3">Collaborators:</h4>
            <p>If you will have lab members working with you on this study, assign them here. Drag names from the left box to the right-hand ‘collaborators’ box to assign them as a collaborator. Study collaborators will have read and write access to all of the projects within this study.</p>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="mt-6">
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
        <el-row :gutter="20" class="mt-4 mb-8 flex">
          <el-col :span="12">
            <draggable class="p-3 rounded shadow-lg" v-model="investigators" group="collaborators">
              <div class="inline-block w-1/2 p-1 cursor-pointer"
                v-for="investigator in investigators" :key="investigator">
                <el-card shadow="hover" body-style="padding:10px">
                  {{ investigator }}
                </el-card>
              </div>
            </draggable>
          </el-col>
          <el-col :span="12">
            <draggable class="min-h-full p-3 rounded shadow-lg" v-model="collaborators" group="collaborators">
              <div class="inline-block w-1/2 p-1 cursor-pointer"
                v-for="collaborator in collaborators" :key="collaborator">
                <el-card shadow="hover" body-style="padding:10px">
                  {{ collaborator }}
                </el-card>
              </div>
            </draggable>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
      <el-button type="success" @click="$emit('saveAndNext')">Save and Next</el-button>
      <el-button type="primary" @click="save">Save</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { DialogBase } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'
import { loader } from '@/utils/helpers'
import draggable from 'vuedraggable'

@Component({
  name: 'CreateStudy',
  components: {
    draggable
  }
})

export default class CreateStudy extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  investigators: any = []
  collaborators: any = []

  studyForm: any = {
    name: '',
    description: ''
  }

  rules: any = {
    name: [
      { required: true, message: 'Please input Study name', trigger: 'blur' }
    ]
  }

  $refs!: {
    studyForm: any
  }

  /* submit Modal data */
  save () {
    this.$refs['studyForm'].validate((valid: any) => {
      if (valid) this.$emit('save', { data: { new_study: this.studyForm, collaborators: this.collaborators } })
      else return false
    })
  }

  /* loda Modal data */
  getCollaboratorList () {
    this.$emit('loadOn')
    return httpService.get('query/collaboratorList')
      .then((res: any) => {
        res.data.rows.map((investigator: any) => this.investigators.push(investigator.id))
        this.$emit('loadOff')
      }).catch((err: any) => { this.$emit('loadOff'); console.log(err) })
  }

  created () {
    this.getCollaboratorList()
  }
}
</script>
