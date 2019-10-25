<template>
  <div>
    <h2 class="text-black font-bold mb-40">Bio Parts</h2>
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
        { text: 'Project', datafield: 'project', width: '20%' },
        { text: 'CDS Name', datafield: 'name', width: '20%' },
        { text: 'Version', datafield: 'version', width: '10%' },
        { text: 'Accession', datafield: 'accession', width: '10%' },
        { text: 'Sequence', datafield: 'sequence', width: '40%' }
      ]
    }
  },
  beforeCreate: function () {
    this.$emit('loadOn')
    return httpService.get('query/biopartsReport')
      .then((res) => {
        this.source = {
          localData: res.data.rows,
          datatype: 'array',
          datafields: [
            { name: 'project', type: 'String' },
            { name: 'name', type: 'String' },
            { name: 'version' },
            { name: 'accession', type: 'String' },
            { name: 'sequence', type: 'String' }
          ]
        }
        this.dataAdapter = new jqx.dataAdapter(this.source)
      })
      .catch(err => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }
}
</script>
