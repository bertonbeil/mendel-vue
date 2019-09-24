<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :span="23">
        <p v-html="modalData.dialogIntro" class="mb-8"></p>
      </el-col>
    </el-row>
    <!-- Main modal content -->
    <div class="mb-30">

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { DialogBase } from '@/utils/interfaces'

@Component({ name: 'AccountInfo' })

export default class AccountInfo extends Vue {
  @Prop({ required: true }) modalData!: DialogBase
}
</script>
