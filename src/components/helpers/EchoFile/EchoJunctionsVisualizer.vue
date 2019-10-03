<template>
  <div class='flex flex-wrap w-full'>
    <div class='visualizer-echo-file__item' v-for="junction in segments + 1" :key="junction">
      <span class='echo-segment-index'>{{ junction }}</span>
      <img class='echo-segment-arrow echo-segment-arrow-disabled' src='~@/assets/img/down-arrow.svg'/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { EchoFileAssemblyRow } from '@/utils/interfaces'

@Component({ name: 'EchoJunctionsVisualizer' })

export default class EchoJunctionsVisualizer extends Vue {
  @Prop({ required: true }) segments!: number
  @Prop({ required: true }) step!: string | number
}
</script>
