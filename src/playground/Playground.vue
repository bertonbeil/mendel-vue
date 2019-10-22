<template>
  <div class="w-full">
    <div class="w-1/2">
      Virtual select

      <div class="p-30 bg-grey h-200">
        <virtual-list :size="20" :remain="8" :start="0">
          <ItemFoo class="h-20" style="box-sizing: border-box" v-for="item of promoters" :key="item.name" :name="item.name"> </ItemFoo>
        </virtual-list>
      </div>
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
  promoters = []

  getPromoters () {
    return httpService.get('query/promoterNameList')
      .then((res: any) => { this.promoters = res.data.rows })
      .catch((err: any) => { throw new Error(err) })
  }

  created () {
    this.getPromoters()
  }

}
</script>
