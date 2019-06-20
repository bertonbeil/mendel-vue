<template>
  <div class='flex flex-wrap w-40 h-40'>
    <div v-for="(item, i) in 4" :key="i"
      class="w-20 h-20 border border-solid border-black rounded-full"
      :class="[ activeCell === i ? 'bg-green-light' : '' ]">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({ name: 'EchoQuadrant' })

export default class EchoQuadrant extends Vue {
  @Prop({ required: true }) activeCell!: number
}
</script>
