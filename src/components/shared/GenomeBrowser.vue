<template>
  <el-col :span="24">
    <h4 class="text-xl text-black mt-3">Genome browser:</h4>
    <iframe class="w-full h-500" :src="iframeSrc" frameborder="0"></iframe>
  </el-col>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({ name: 'GenomeBrowser' })

export default class GenomeBrowser extends Vue {
  @Prop({ required: true }) iframeSrc!: string
}
</script>
