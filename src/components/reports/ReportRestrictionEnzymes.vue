<template>
  <div>
    <h2 class="text-black font-bold mb-40">Restriction Enzymes</h2>
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
        { text: 'Name', datafield: 'name', width: '15%' },
        { text: 'Sequence', datafield: 'recognition_sequence', width: '15%' },
        { text: 'Type', datafield: 'type', width: '15%' },
        { text: 'Sequence 5', datafield: 'sequence_5', width: '15%' },
        { text: 'Sequence 3', datafield: 'sequence_3', width: '15%' },
        { text: 'Description', datafield: 'description', width: '25%' }
      ]
    }
  },
  beforeCreate: function () {
    this.$emit('loadOn')
    return httpService.get('query/restrictionEnzymesReport')
      .then((res) => {
        this.source = {
          localData: res.data.rows,
          datatype: 'array',
          datafields: [
            { name: 'name', type: 'String' },
            { name: 'recognition_sequence', type: 'String' },
            { name: 'type', type: 'String' },
            { name: 'sequence_5', type: 'String' },
            { name: 'sequence_3', type: 'String' },
            { name: 'description', type: 'String' }
          ]
        }
        this.dataAdapter = new jqx.dataAdapter(this.source)
      })
      .catch(err => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }
}
</script>
