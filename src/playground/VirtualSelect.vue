<template>
  <div class="vitrual-select">
    <div class='vitrual-select__input' :class="size"  @click="isShowDropdown = !isShowDropdown" v-click-outside="closeDropdown">
      {{value}}
      <i class="el-icon-arrow-down vitrual-select__input-icon " :class="{ 'up' :isShowDropdown}"></i>
    </div>
    <transition name="el-zoom-in-top">
        <div class="vitrual-select__dropdown" v-if="isShowDropdown">
          <virtual-list :size="sizeList" :remain="8" :start="startPosition" class="vitrual-select__virtual-list bg-white">
            <virtual-list-item
            @click.native="selectItem(item, index)"
            class="pl-20 pt-5 vitrual-select__dropdown-item"
            :class="{'text-blue-light font-bold bg-grey-lightest': item === value}"
            v-for="(item, index) of promoters"
            :key="item"
            style="height: 30px"
            :name="item"></virtual-list-item>
          </virtual-list>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

import VirtualListItem from './VirtualListItem.vue'

@Component({ name: 'VirtualSelect' })
export default class VirtualSelect extends Vue {
  @Prop({ required: true }) promoters: any
  @Prop({ required: true }) value: any
  @Prop({ default: 'large' }) size: any
  @Prop({ default: 20 }) sizeList: any

  startPosition: number = 0
  isShowDropdown: boolean = false

  selectItem (value: any, index: number) {
    this.$emit('input', value)
    this.startPosition = index
    console.log(this.startPosition)
    this.closeDropdown()
  }

  closeDropdown () {
    this.isShowDropdown = false
  }
}
</script>
