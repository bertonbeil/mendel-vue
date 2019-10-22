<template>
  <div class="w-full">
    <div class="w-200 h-30">
      {{ name }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  name: 'ItemFoo'
})

export default class ItemFoo extends Vue {
  @Prop() name!: string

}
</script>
