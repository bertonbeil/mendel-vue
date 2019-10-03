<template>
  <el-row class="w-full min-h-full bg-white">
    <el-col :span="8" :offset="8" class="h-full flex items-center">
      <el-card class="box-card w-full bg-grey-lighter p-10 rounded">
        <el-form :model="loginForm" label-position="top" :rules="rules" ref="loginForm">
          <h3 class="text-center">Mendel login</h3>
          <el-form-item label="Username:" prop="user">
            <el-input v-model="loginForm.user" placeholder="Username"></el-input>
          </el-form-item>
          <el-form-item label="Password:" prop="pwd">
            <el-input type="password" v-model="loginForm.pwd" placeholder="Password"></el-input>
          </el-form-item>
          <el-form-item class="text-center">
            <el-button type="primary" @click="submitForm">Login</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { httpService } from '@/services/http.service'
import { alertMixin } from '@/utils/mixins'

@Component({ name: 'Login', mixins: [ alertMixin ] })

export default class Login extends Vue {
  loginForm: object = {
    user: '',
    pwd: ''
  }

  rules: object = {
    user: [ { required: true, message: 'Username is required' } ],
    pwd: [ { required: true, message: 'Password is required' } ]
  }

  $refs!: {
    loginForm: HTMLFormElement
  }

  submitForm () {
    this.$refs['loginForm'].validate((valid: any) => {
      if (valid) {
        return httpService.post('query/authorization', this.loginForm)
          .then((res: any) => {
            if (res.data.lims_response === 'Invalid user / password combination. Please try again.') {
              (this as any).alert({ type: 'error', msg: res.data.lims_response })
            } else {
              (this as any).$message({ message: res.data.lims_response, type: 'success' })
              this.$store.state.isAuth = true
              this.$router.push('/')
            }
          })
      } else return false
    })
  }
}
</script>
