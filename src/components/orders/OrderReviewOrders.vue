<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24">
        <h3 class="text-black font-bold">Review Orders</h3>
      </el-col>
      <el-col :span="24">
        <p v-html="modalData.dialogIntro" class="mb-8 break-word"></p>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mb-10 pl-20">
      <el-col :span="3" class="text-black"><h5>Study</h5></el-col>
      <el-col :span="3" class="text-black"><h5>Project</h5></el-col>
      <el-col :span="3" class="text-black"><h5>Assembly</h5></el-col>
      <el-col :span="3" class="text-black"><h5>Grant</h5></el-col>
      <el-col :span="12" class="text-black"><h5>Actions</h5></el-col>
    </el-row>

    <ReviewOrdersRow v-for="(assembly, index) in assembliesList" :key="index" :assembliesData="assembly"></ReviewOrdersRow>

    <!-- Modal action buttons -->
    <div slot="footer" class="text-center mt-20">
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { DialogBase } from '@/utils/interfaces'
import { httpService } from '@/services/http.service'

@Component({ name: 'OrderReviewOrders' })

export default class OrderReviewOrders extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
  @Prop({ required: true }) isLoading!: boolean

  assembliesList: object[] = []

  /* Get initial component data */
  getAssembliesData () {
    this.$emit('loadOn')
    return httpService.get('query/submittedAssemblies')
      .then((res: any) => { this.assembliesList = res.data.assemblies })
      .catch((err: any) => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }

  created () {
    this.getAssembliesData()
  }
}
</script>
