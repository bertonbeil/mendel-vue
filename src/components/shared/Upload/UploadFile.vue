<template>
  <el-upload
    action="https://jsonplaceholder.typicode.com/posts/"
    :on-change="uploadFile"
    :file-list="fileList"
    :accept="accept"
    class="mt-10">
    <el-button size="mini" type="primary">Click to upload</el-button>
  </el-upload>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({ name: 'UploadFile' })

export default class UploadFile extends Vue {
  @Prop({ required: true }) accept!: string

  fileList: object[] = []

  uploadFile (file: any) {
    const fileReader = new FileReader()
    fileReader.readAsText(file.raw)
    fileReader.onload = (e: any) => { this.$emit('getUploadFile', e.target.result) }
  }
}
</script>
