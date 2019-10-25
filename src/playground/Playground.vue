<template>
  <div class="w-1/2">
      <VirtualSelect :items="test" v-model="selectedItem" size="mini"></VirtualSelect>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import VirtualSelect from './VirtualSelect.vue'
import { httpService } from '@/services/http.service'

@Component({
  name: 'Playground',
  components: { VirtualSelect }
})

export default class Playground extends Vue {
  noFiltredPromoters: object[] = []
  filtredPromoters: string[] = []
  selectedItem: string = ''
  test: string [] = []

  getPromoters () {
    return httpService.get('query/promoterNameList')
      .then((res: any) => { this.noFiltredPromoters = res.data.rows })
      .catch((err: any) => { throw new Error(err) })
  }

  filterUniqItems () {
    let uniqItems = new Map()

    this.noFiltredPromoters.forEach((p: any) => {
      uniqItems.set(p.name, p.name)
    })

    for (var value of uniqItems.values()) {
      this.filtredPromoters.push(value)
    }
  }

  created () {
    this.getPromoters()
      .then(() => {
        this.filterUniqItems()
      })
  }
}
</script>
