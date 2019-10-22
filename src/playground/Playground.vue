<template>
  <div class="w-full">

    <div class="w-1/2">
      <el-select v-model="selected" placeholder="">
        <el-option v-for="item in promoters"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </div>

    <div class="w-1/2">
      Virtual select

      <div class="p-30 bg-grey h-200">
        <virtual-list :size="20" :remain="8" :start="0">
          <ItemFoo @click.native="testIvent(item)" class="h-20" style="box-sizing: border-box" v-for="item of promoters" :key="item" :name="item"> </ItemFoo>
        </virtual-list>
      </div>
    </div>

    <div class="w-1/2">
      <!-- vistual-select @change(return selected item) v-model/sync prop-->
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import virtualList from 'vue-virtual-scroll-list'
import ItemFoo from './Item'
import { httpService } from '@/services/http.service'

@Component({
  name: 'Playground',
  components: { virtualList: virtualList, ItemFoo }
})

export default class Playground extends Vue {
  promotersNotFiltered = []
  promoters = []
  selected = ''

  testIvent (item) {
    console.log('selected item: ', item)
  }

  getPromoters () {
    return httpService.get('query/promoterNameList')
      .then((res: any) => { this.promotersNotFiltered = res.data.rows })
      .catch((err: any) => { throw new Error(err) })
  }

  filterUniqItems () {
    let uniqItems = new Map()

    this.promotersNotFiltered.forEach((p: any) => {
      uniqItems.set(p.name, p.name)
    })

    for (var value of uniqItems.values()) {
      // console.log('value: ', value)
      this.promoters.push(value)
    }

    console.log('this.promoters: ', this.promoters)
  }

  created () {
    this.getPromoters()
      .then(() => {
        this.filterUniqItems()
      })
  }

}
</script>
