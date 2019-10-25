<template>
  <div>
    <h2 class="text-black font-bold mb-40">Vegas Adapters</h2>
        <JqxGrid class="mt-10" v-if="dataAdapter" :theme="'energyblue'" :width="getWidth" :source="dataAdapter" :columns="columns"
                 :pageable="true" :autoheight="true" :sortable="true" :filterable="true" :altrows="true"
                 :editable="true" :selectionmode="'multiplecellsadvanced'">
        </JqxGrid>
  </div>
    </template>
<script>
import JqxGrid from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue'
import { httpService } from '@/services/http.service'

export default {
  components: {
    JqxGrid
  },
  data: function () {
    return {
      getWidth: '99%',
      dataAdapter: null,
      columns: [
        { text: 'Name', datafield: 'id', width: '15%' },
        { text: 'Sequence', datafield: 'sequence', width: '70%' },
        { text: 'Length', datafield: 'size', width: '15%', cellsalign: 'right' }
      ]
    }
  },
  beforeCreate: function () {
    this.$emit('loadOn')
    return httpService.get('query/vegasAdaptersReport')
      .then((res) => {
        this.source = {
          localData: res.data.rows,
          datatype: 'array',
          datafields: [
            { name: 'id', type: 'String' },
            { name: 'sequence', type: 'String' },
            { name: 'size' }
          ]
        }
        this.dataAdapter = new jqx.dataAdapter(this.source)
      })
      .catch(err => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }
}
</script>
