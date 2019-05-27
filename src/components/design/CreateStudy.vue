<template>
  <div>
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
@Component({
  name: 'CreateStudy'
})
export default class CreateStudy extends Vue {
  @Prop({ required: true }) modalData!: DialogBase

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

  save () {
    this.$refs['studyForm'].validate((valid: any) => {
      if (valid) this.$emit('save', this.studyForm); else return false
    })
  }
}
</script>
