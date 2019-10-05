
<template>
      <div class="mt-10 flex items-center" :class="isFileLoading">
        <label for="uploadFileInput" :class="{'cursor-wait':fileLoading}" class="upLoad-file-input">Click to upload</label>
          <input
            type="file"
            @change="uploadFile"
            :file-list="fileList"
            :accept="accept"
            :disabled="fileLoading"
            id="uploadFileInput"
            class="hidden"/>
          <el-button
            circle
            v-if="!updateImmediately"
            title="show sequence"
            icon="el-icon-view"
            type="button"
            size="small"
            :class="{'cursor-wait':fileLoading}"
            @click="showSequence"
            class="ml-10">
          </el-button>
          <p v-if="fileName" class="ml-10">
            <i class="el-icon-document"></i>
            {{fileName}}
          </p>
    </div>

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
  fileLoading: boolean = false;
  fileName: string = '';

  showSequence () {
    this.$emit('update:dnaSequence', this.result)
  }

  get isFileLoading () {
    if (this.fileLoading) {
      return 'cursor-wait opacity-50'
    }
  }

  uploadFile (e: any) {
    this.fileLoading = true
    const fileReader = new FileReader()
    fileReader.readAsText(e.target.files[0])
    this.fileName = e.target.files[0].name
    fileReader.onload = (e: any) => {
      this.result = e.target.result
      if (this.updateImmediately) this.$emit('update:dnaSequence', e.target.result)
    }
    this.fileLoading = false
  }
}
</script>
