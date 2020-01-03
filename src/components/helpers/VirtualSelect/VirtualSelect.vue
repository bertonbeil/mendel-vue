<template>
  <div class="vitrual-select" v-click-outside="closeDropdown">
    <div class='vitrual-select__input' :class="selectClasses" @click="isShowDropdown = !isShowDropdown" ref="virtualSelectInput">
      {{selectedItem ? selectedItem : 'None'}}
      <i class="el-icon-arrow-down vitrual-select__input-icon " :class="{ 'up' :isShowDropdown}"></i>
    </div>
    <transition name="el-fade-in">
        <div class="vitrual-select__dropdown" v-if="isShowDropdown" :class="dropdownPosition">
          <virtual-list :size="20" :remain="10" :start="startPosition" class="vitrual-select__virtual-list bg-white">
            <virtual-list-item v-for="item of items"
              :key="item"
              :name="item"
              @click.native="selectItem(item)"
              class="pl-20 py-5 vitrual-select__dropdown-item"
              :class="{'text-purple font-bold': item === selectedItem}" />
          </virtual-list>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model } from 'vue-property-decorator'
import VirtualListItem from './VirtualListItem.vue'

@Component({ name: 'VirtualSelect' })
export default class VirtualSelect extends Vue {
  @Prop({ required: true }) items!: string[]
  @Prop({ default: 'large' }) size!: 'mini' | 'small' | 'medium' | 'large'
  @Model('input') selectedItem!: string
  maxDropdownHeight: number = 220
  isShowDropdown: boolean = false

  $refs!: {
    virtualSelectInput: HTMLFormElement
    virtualList: HTMLFormElement
  }

  get selectClasses () {
    if (this.isShowDropdown) {
      return `${this.size} open`
    } else {
      return `${this.size}`
    }
  }

  get startPosition () {
    return this.items.indexOf(this.selectedItem)
  }

  get dropdownPosition () {
    if (this.isShowDropdown) {
      if (this.isShowDropdownAbove()) {
        return 'above'
      } else {
        return 'below'
      }
    }
  }

  getHeightBtwSelectAndBottom () {
    return window.innerHeight - this.$refs.virtualSelectInput.getBoundingClientRect().bottom
  }

  isShowDropdownAbove () {
    return this.getHeightBtwSelectAndBottom() < this.maxDropdownHeight
  }

  closeDropdown () {
    this.isShowDropdown = false
  }

  selectItem (selectedItem: string) {
    this.$emit('input', selectedItem)
    this.closeDropdown()
  }
}
</script>
