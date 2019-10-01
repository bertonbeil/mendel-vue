<template>
  <div class='flex flex-wrap w-40 h-40'>
    <div class="w-20 h-20 border border-solid border-black rounded-full"
      v-for="item in quadrant"
      :key="item"
      :class="{ 'bg-green-light': activeCell === item}">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({ name: 'EchoQuadrant' })

export default class EchoQuadrant extends Vue {
  @Prop({ required: true }) activeCell!: number

  quadrant: string[] = [ 'A1', 'A2', 'B1', 'B2' ]
}
</script>
