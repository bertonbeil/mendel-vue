<template>
  <div>
    <h2 class="text-black font-bold mb-40">Primers</h2>
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
        { text: 'Assembly', datafield: 'primer_id', width: '25%' },
        { text: 'Junction', datafield: 'junction', width: '10%' },
        { text: 'Pair', datafield: 'pair', width: '5%' },
        { text: 'Version', datafield: 'version', width: '5%', cellsalign: 'right' },
        { text: 'Status', datafield: 'status', width: '10%' },
        { text: 'Position', datafield: 'position', width: '10%', cellsalign: 'right' },
        { text: 'Length', datafield: 'length', width: '5%', cellsalign: 'right' },
        { text: 'Value', datafield: 'value', width: '25%' },
        { text: 'Well', datafield: 'well', width: '5%' }
      ]
    }
  },
  beforeCreate: function () {
    this.$emit('loadOn')
    return httpService.get('query/dnaprimers')
      .then((res) => {
        this.source = {
          localData: res.data.rows,
          datatype: 'array',
          datafields: [
            { name: 'primer_id' },
            { name: 'junction' },
            { name: 'pair', type: 'String' },
            { name: 'version' },
            { name: 'status', type: 'String' },
            { name: 'well', type: 'String' },
            { name: 'value', type: 'String' },
            { name: 'position' },
            { name: 'length' }
          ]
        }
        this.dataAdapter = new jqx.dataAdapter(this.source)
      })
      .catch(err => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }
}
</script>
