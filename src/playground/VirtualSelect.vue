<template>
  <div class="vitrual-select">
    <div class="vitrual-select__input" @click="isShowDropdown = !isShowDropdown" v-click-outside="closeDropdown">
      {{value}}
      <i class="el-icon-arrow-down vitrual-select__input-icon " :class="{ 'up' :isShowDropdown}"></i>
    </div>
    <transition name="el-zoom-in-top">
        <div class="vitrual-select__dropdown" v-if="isShowDropdown">
          <virtual-list :size="20" :remain="8" :start="startPosition" class="vitrual-select__virtual-list">
            <ItemFoo
            @click.native="selectItem(item, index)"
            class="h-30 pl-20 pt-5 vitrual-select__dropdown-item"
            :class="{'text-blue-light font-bold bg-grey-lightest': item === value}"
            v-for="(item, index) of promoters"
            :key="item"
            :name="item"> </ItemFoo>
          </virtual-list>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import virtualList from 'vue-virtual-scroll-list'
import ItemFoo from './Item'
import { httpService } from '@/services/http.service'
import vClickOutside from 'v-click-outside'

Vue.use(vClickOutside)
@Component({
  name: 'VirtualSelect',
  components: { virtualList: virtualList, ItemFoo }
})
export default class VirtualSelect extends Vue {
  @Prop({ required: true }) promoters: any
  @Prop({ required: true }) value: string
  startPosition: nubmer = 0

  isShowDropdown: boolean = false
  selectItem (value, index) {
    this.$emit('input', value)
    this.startPosition = index
    this.isShowDropdown = false
  }

  closeDropdown () {
    this.isShowDropdown = false
  }
}
</script>
