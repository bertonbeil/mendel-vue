<template>
<div class="users-for-grant-wrapper">
  <el-row :gutter="20" class="mb-20">
    <el-col :span="24" class="mb-20">
      <h3 class="text-black font-bold">Users for Grant</h3>
      <p class="mb-20">Assign Users for Grant</p>
    </el-col>

    <el-form :model="GrantsUsersForGrantForm" label-position="top" :rules="rules" ref="GrantsUsersForGrantForm">
      <el-col :span="24">
        <el-form-item label="Grants:" prop="grant">
          <el-select
            v-model="GrantsUsersForGrantForm.grant"
            @change="getUserForGrants"
            placeholder="Select grant"
            class="w-full">
            <el-option v-for="(retriver,index) in grantRetriver" :key="index" :label="retriver" :value="retriver"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <!-- Draggable zones -->
      <el-row :gutter="20" class="mb-30 flex px-10" v-if="isShowGrants">
        <el-col :span="12">
          <h5 class="mb-20 text-black">Grants:</h5>
          <draggable
            class="el-card is-never-shadow p-10 h-400 overflow-auto"
            v-model="collaboratorList"
            group="usersGrantsList">
            <div
              class="inline-block w-1/2 p-1 cursor-pointer"
              v-for="(colaborator,index) in collaboratorList"
              :key="index">
              <el-card shadow="hover" body-style="padding:10px">{{ colaborator }}</el-card>
            </div>
          </draggable>
        </el-col>
        <el-col :span="12">
          <h5 class="mb-20 text-black">Users Grants:</h5>
          <draggable
            class=" el-card is-never-shadow p-10 h-400 overflow-auto"
            v-model="usersGrantsList"
            group="usersGrantsList">
            <div
              class="inline-block w-1/2 p-1 cursor-pointer"
              v-for="(grant,index) in usersGrantsList"
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
import { GrantsUsersForGrantForm } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({ name: 'GrantsUsersForGrant' })
export default class GrantsUsersForGrant extends Vue {
  @Prop({ required: true }) isLoading!: boolean

  collaboratorList: string[] = []
  usersGrantsList: string[] = []
  grantRetriver: string[] = []
  isShowGrants: boolean = false

  GrantsUsersForGrantForm: GrantsUsersForGrantForm = {
    grant: ''
  }

  rules: object = {
    grant: [{ required: true, message: 'Grant is required' }]
  }

  $refs!: {
    GrantsUsersForGrantForm: HTMLFormElement
  }

  get sendData () {
    return { grant: this.GrantsUsersForGrantForm.grant, users: this.usersGrantsList }
  }

  /* submit Modal data */
  save (next?: string) {
    this.$refs['GrantsUsersForGrantForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: this.sendData })
      else return false
    })
  }

  getUserForGrants () {
    this.$emit('loadOn')
    return httpService.post('query/usersForGrant', { grant: this.GrantsUsersForGrantForm.grant })
      .then((res: any) => {
        this.usersGrantsList = res.data.users.map((item: any) => {
          this.collaboratorList.splice(this.collaboratorList.indexOf(item.user), 1)
          return item.user
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
