<template>
  <div class="w-full">
      {{ name }}
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  name: 'VirtualListItem'
})

export default class VirtualListItem extends Vue {
  @Prop() name!: string
}
</script>
