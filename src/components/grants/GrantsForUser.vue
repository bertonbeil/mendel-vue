<template>
<div class="grants-for-user-wrapper">
  <el-row :gutter="20" class="mb-20">
    <el-col :span="24" class="mb-20">
      <h3 class="text-black font-bold">Grants for User</h3>
      <p class="mb-20">Assign Grants for User</p>
    </el-col>

    <el-form :model="grantForUserForm" label-position="top" :rules="rules" ref="grantForUserForm">
      <el-col :span="24">
        <el-form-item label="Study name:" prop="user">
          <el-select
            v-model="grantForUserForm.user"
            @change="getGrantsForUser"
            placeholder="Select name"
            class="w-full">
            <el-option v-for="colaborator in collaboratorList" :key="colaborator" :label="colaborator" :value="colaborator"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <!-- Draggable zones -->
      <el-row :gutter="20" class="mb-30 flex px-10" v-if="isShowGrants">
        <el-col :span="12">
          <h5 class="mb-20 text-black">Grants:</h5>
          <draggable
            class="el-card is-never-shadow p-10 h-400 overflow-auto"
            v-model="grantRetriver"
            group="grantsList">
            <div
              class="inline-block w-1/2 p-1 cursor-pointer"
              v-for="(retriver,index) in grantRetriver"
              :key="index" >
              <el-card shadow="hover" body-style="padding:10px">{{ retriver }}</el-card>
            </div>
          </draggable>
        </el-col>
        <el-col :span="12">
          <h5 class="mb-20 text-black">Users Grants:</h5>
          <draggable
            class=" el-card is-never-shadow p-10 h-400 overflow-auto"
            v-model="grantsList"
            group="grantsList">
            <div
              class="inline-block w-1/2 p-1 cursor-pointer"
              v-for="(grant,index) in grantsList"
              :key="index">
              <el-card shadow="hover" body-style="padding:10px">{{ grant }}</el-card>
            </div>
          </draggable>
        </el-col>
      </el-row>

    </el-form>
  </el-row>
  <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
      <el-button type="success" @click="save">Save</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { grantsForUserForm } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({ name: 'GrantsForUser' })

export default class GrantsForUser extends Vue {
  @Prop({ required: true }) isLoading!: boolean

  collaboratorList: string[] = []
  grantsList: string[] = []
  grantRetriver: string[] = []
  isShowGrants: boolean = false

  grantForUserForm: grantsForUserForm = {
    user: ''
  }

  rules: object = {
    user: [{ required: true, message: 'User name is required' }]
  }

  $refs!: {
    grantForUserForm: HTMLFormElement
  }

  get sendData () {
    return { user: this.grantForUserForm.user, grants: this.grantsList }
  }

  /* submit Modal data */
  save (next?: string) {
    this.$refs['grantForUserForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: this.sendData })
      else return false
    })
  }

  getGrantsForUser () {
    this.$emit('loadOn')
    return httpService.post('query/grantsForUser', { user: this.grantForUserForm.user })
      .then((res: any) => {
        this.grantsList = res.data.grants.map((item: any) => {
          this.grantRetriver.splice(this.grantRetriver.indexOf(item.grant), 1)
          return item.grant
        })
        this.isShowGrants = true
      })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  getGrantRetriever () {
    return httpService.get('query/grantRetriever').then((res: any) => {
      this.grantRetriver = res.data.grants.map((grant: any) => grant.name)
    })
  }

  getCollaboratorList () {
    return httpService.get('query/collaboratorList').then((res: any) => {
      this.collaboratorList = res.data.rows.map((colaborator: any) => colaborator.id)
    })
  }

  getInitialData () {
    this.$emit('loadOn')
    Promise.all([this.getGrantRetriever(), this.getCollaboratorList()])
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  created () {
    this.getInitialData()
  }
}
</script>
