<template>
    <div class="create-mpdify-grant-wrapper">
        <el-row :gutter="20" class="mb-20">
        <el-col :span="24">
          <h3 class="text-black font-bold">Create/Modify Grant</h3>
        </el-col>
      </el-row>

        <el-form :model="CreateModifyGrantForm" label-position="top" :rules="rules" ref="CreateModifyGrantForm">
        <el-row :gutter="10" class="mb-30">
          <el-col :span="12">
            <el-form-item label="Grant name:" prop="name">
               <el-autocomplete
                class="inline-input"
                v-model="CreateModifyGrantForm.name"
                :fetch-suggestions="querySearch"
                placeholder="Enter or choose grant name.."
                @select="getGrantData"
             ></el-autocomplete>
            </el-form-item>
          </el-col>

          <el-col :span='24' class="mb-20">
            <el-form-item label="Grant description:" prop="description">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="Enter description of your grant..."
                v-model="CreateModifyGrantForm.description">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="Purchase Order (PO):" prop="purchaseOrder">
              <el-input placeholder="Enter purchase order" v-model="CreateModifyGrantForm.purchaseOrder"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="Start Date:" prop="startDate">
              <el-date-picker
                size="large"
                v-model="CreateModifyGrantForm.startDate"
                type="date"
                placeholder="dd.mm.yyyy">
            </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="End Date:" prop="endDate">
              <el-date-picker
                size="large"
                v-model="CreateModifyGrantForm.endDate"
                type="date"
                placeholder="dd.mm.yyyy">
            </el-date-picker>
            </el-form-item>
          </el-col>
          </el-row>

          <el-row :gutter="20" class="mb-20">
            <el-col :span="6">
              <el-form-item label="IDT allocated amount:" prop="idtAmount">
                <el-input-number v-model="CreateModifyGrantForm.idtAmount" ></el-input-number>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="IDT spent amount" prop="idtSpentAmount">
                <el-input-number v-model="CreateModifyGrantForm.idtSpentAmount" ></el-input-number>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="Qinglan allocated amount:" prop="qlAmount">
                <el-input-number v-model="CreateModifyGrantForm.qlAmount" ></el-input-number>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="Qinglan spent amount:" prop="qlSpentAmount">
                <el-input-number v-model="CreateModifyGrantForm.qlSpentAmount" ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
      </el-form>

      <div slot="footer" class="text-center">
        <el-button type="danger" @click="$emit('close')">Cancel</el-button>
        <el-button type="primary" :disabled="!isUpdate" @click="save(isUpdateData)">Update</el-button>
        <el-button type="primary" :disabled="!isCreate" @click="save(!isUpdateData)">Create</el-button>
      </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { DialogBase, CreateModifyGrant } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({ name: 'GrantCreateModifyGrant' })
export default class GrantCreateModifyGrant extends Vue {
    @Prop({ required: true }) modalData!: DialogBase
    @Prop({ required: true }) isLoading!: boolean

    retriverGrantsList: string[] = []
    isUpdateData: boolean = true;
    isAlreadyExist: string | undefined = ''
    localCopyForm: object = {};
    isUpdate: boolean = true;
    isCreate: boolean = true;

  CreateModifyGrantForm : CreateModifyGrant = {
    name: '',
    description: '',
    purchaseOrder: '',
    startDate: '',
    endDate: '',
    idtAmount: 0,
    idtSpentAmount: 0,
    qlAmount: 0,
    qlSpentAmount: 0
  }

  $refs!: {
    CreateModifyGrantForm: HTMLFormElement
  }

  rules: object = {
    name: [{ required: true, message: 'Grant name is required' }],
    description: [{ required: true, message: 'Description name is required' }],
    purchaseOrder: [{ required: true, message: 'Purchase order name is required' }],
    startDate: [{ required: true, message: 'Start date is required' }],
    endDate: [{ required: true, message: 'End date is required' }],
    idtAmount: [{ required: true, message: 'Idt amount is required' }],
    idtSpentAmount: [{ required: true, message: 'Idt spent amount is required' }],
    qlAmount: [{ required: true, message: 'Ql amount is required' }],
    qlSpentAmount: [{ required: true, message: 'Ql spent amount is required' }]
  }

  querySearch (queryString: string, cb: any) {
    cb(this.retriverGrantsList)
  }

  getGrunts () {
    this.$emit('loadOn')
    return httpService.get('query/grantRetriever')
      .then((res: any) => {
        this.retriverGrantsList = res.data.grants.map((item: any) => {
          return {
            value: item.name
          }
        })
      })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  getGrantData () {
    this.$emit('loadOn')
    return httpService.post('query/grantRetriever', { name: this.CreateModifyGrantForm.name })
      .then((res: any) => {
        this.CreateModifyGrantForm = { name: this.CreateModifyGrantForm.name, ...res.data.lims_response }
        this.localCopyForm = { ...this.CreateModifyGrantForm }
      })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  get sendData () {
    return this.CreateModifyGrantForm
  }

  save (isUpdateData : boolean) {
    this.$refs['CreateModifyGrantForm'].validate((valid: boolean) => {
      if (valid) this.$emit('save', { data: { action: isUpdateData ? 'edit' : 'create', ...this.sendData } })
      else return false
    })
  }

  // isTheSameString (oldString: string, newString: string) {
  //   return JSON.stringify(this.localCopyForm) === JSON.stringify(this.CreateModifyGrantForm)
  // }

  // @Watch('CreateModifyGrantForm', { deep: true })
  // handleFormChange () {
  //   if (this.isTheSameString && this.isAlreadyExist) {
  //     this.isCreate = false
  //     this.isUpdate = false
  //   } else if (!this.isTheSameString && !this.isAlreadyExist) {
  //     this.isUpdate = false
  //     this.isCreate = true
  //   } else {
  //     this.isUpdate = true
  //     this.isCreate = true
  //   }
  // }

  @Watch('CreateModifyGrantForm.name')
  handleGrantName (inputNameGrant: any) {
    this.isAlreadyExist = this.retriverGrantsList.find((grant: any) => grant.value === inputNameGrant)
  }

  created () {
    this.getGrunts()
  }
}
</script>
