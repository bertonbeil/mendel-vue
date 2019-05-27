<template>
  <div>
    <div>hhoo</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MainHeader from '@/components/layouts/MainHeader.vue'
@Component({
  name: 'CreateStudy'
})
export default class CreateStudy extends Vue {
  dialogVisible: boolean = false
  activeComponent: string = ''
}
</script>
