<template>
  <div class="vitrual-select">
    <div class='vitrual-select__input' :class="size"  @click="isShowDropdown = !isShowDropdown" v-click-outside="closeDropdown">
      {{value}}
      <i class="el-icon-arrow-down vitrual-select__input-icon " :class="{ 'up' :isShowDropdown}"></i>
    </div>
    <transition name="el-zoom-in-top">
        <div class="vitrual-select__dropdown" v-if="isShowDropdown">
          <virtual-list :size="20" :remain="10" :start="startPosition" class="vitrual-select__virtual-list bg-white">
            <virtual-list-item v-for="(item, index) of items"
              :key="item"
              :name="item"
              @click.native="selectItem(item, index)"
              class="pl-20 pt-5 vitrual-select__dropdown-item"
              :class="{'text-blue-light font-bold bg-grey-lightest': item === value}" />
          </virtual-list>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

import VirtualListItem from './VirtualListItem.vue'

@Component({ name: 'VirtualSelect', components: { VirtualListItem } })
export default class VirtualSelect extends Vue {
  @Prop({ required: true }) items!: string[]
  @Prop({ required: true }) value!: string
  @Prop({ default: 'large' }) size!: 'mini' | 'small' | 'medium' | 'large'

  startPosition: number = 0
  isShowDropdown: boolean = false

  selectItem (value: string, index: number) {
    this.$emit('input', value)
    this.startPosition = index
    this.closeDropdown()
  }

  closeDropdown () {
    this.isShowDropdown = false
  }
}
</script>
