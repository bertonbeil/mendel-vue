<template>
  <div>
    <!-- Main modal content -->
    <div>

    </div>
    <!-- Modal action buttons -->
    <div slot="footer" class="text-center">
      <el-button type="danger" @click="$emit('close')">Cancel</el-button>
      <el-button type="success" @click="$emit('saveAndNext')">Save and Next</el-button>
      <el-button type="primary" @click="$emit('save')">Save</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MainHeader from '@/components/layouts/MainHeader.vue'
@Component({
  name: 'CreateStudy'
})
export default class CreateStudy extends Vue {

}
</script>
