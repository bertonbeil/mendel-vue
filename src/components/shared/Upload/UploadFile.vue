<template>
  <el-row>
    <el-col :span="6" class="mt-10 flex items-center">
      <label for="uploadFileInput" class="upLoad-file-input">Click to upload</label>
      <input
        type="file"
        @change="uploadFile"
        :file-list="fileList"
        :accept="accept"
        id="uploadFileInput"
        class="hidden"
      />
      <button v-if="!updateImmediately" title="show sequence" type="button" @click="showSequence" class="show-sequence-btn el-icon-view ml-10"></button>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({ name: 'UploadFile' })
export default class UploadFile extends Vue {
  @Prop({ required: true }) accept!: string;
  @Prop({ required: true }) dnaSequence!: string;
  @Prop({ default: false }) updateImmediately!: boolean;

  result: null | string = null;
  fileList: object[] = [];

  showSequence () {
    this.$emit('update:dnaSequence', this.result)
  }

  uploadFile (e: any) {
    const fileReader = new FileReader()
    fileReader.readAsText(e.target.files[0])
    fileReader.onload = (e: any) => {
      this.result = e.target.result
      if (this.updateImmediately) this.$emit('update:dnaSequence', e.target.result)
    }
  }
}
</script>
