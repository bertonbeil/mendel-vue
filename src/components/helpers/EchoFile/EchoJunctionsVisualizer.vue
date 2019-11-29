<template>
  <div v-if="assembly.segments !== 0" class="visualizer-echo-file-row">
    <div class="visualizer-echo-file-wrap">
      <ul class="visualizer-echo-file">
        <li class='visualizer-echo-file__item' v-for="(item, index) in localJunction" :key="item.junction" :class="{'is-last': index === localJunction.length - 1}">
          <span class='echo-segment-index'>{{ item.junction }}</span>
          <el-button
            class="echo-segment-arrow outline-none"
            icon="el-icon-bottom"
            circle
            :type="item.isActive ? 'success' : null"
            :disabled="!isSegmentDisabled"
            @click.native="item.isActive = !item.isActive"
            ></el-button>

          <div class="visualizer-echo-file__item-segment"></div>
        </li>
        <div class="echo-closet"></div>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { EchoFileAssemblyRow } from '@/utils/interfaces'

@Component({ name: 'EchoJunctionsVisualizer' })

export default class EchoJunctionsVisualizer extends Vue {
  // @Prop({ required: true }) index!: number
  @Prop({ required: true }) assembly!: EchoFileAssemblyRow

  localJunction: any[] = []

  createJunctionArray () {
    this.localJunction = [...Array(this.assembly.segments + 1).keys()].map((item: any, index: number) => {
      const junction = item + 1 // Start index 1

      if (this.assembly.step === 'None') {
        return { isActive: false, junction }
      }

      return { isActive: (junction % (this.assembly.step as number)) === 0, junction }
    })
  }

  get isSegmentDisabled () {
    return this.assembly.step === 'None'
  }

  @Watch('assembly.step', { immediate: true, deep: true })
  handleStepChange (newVal: EchoFileAssemblyRow, oldVal: EchoFileAssemblyRow) {
    if (newVal === oldVal) return
    this.createJunctionArray()
  }

  @Watch('localJunction', { immediate: true, deep: true })
  handleJunctionChange () {
    this.$emit('change', { junctions: this.localJunction, id: this.assembly.id })
  }
}
</script>
