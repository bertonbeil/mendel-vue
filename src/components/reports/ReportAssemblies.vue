<template>
  <div>
    <h2 class="text-black font-bold mb-40">Assemblies</h2>
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
        { text: 'Study', datafield: 'study', width: '10%' },
        { text: 'Project', datafield: 'project', width: '15%' },
        { text: 'Assembly ', datafield: 'assembly', width: '20%' },
        { text: 'Type ', datafield: 'assembly_type', width: '5%' },
        { text: 'Investigator', datafield: 'investigator', width: '10%' },
        { text: 'Assembly Status ', datafield: 'assembly_status', width: '10%' },
        { text: 'Segment Status', datafield: 'segment_status', width: '10%' },
        { text: 'Segment Primer Status', datafield: 'segment_primer_status', width: '10%' },
        { text: 'Junction Primer Status', datafield: 'junction_primer_status', width: '10%' }
      ]
    }
  },
  beforeCreate: function () {
    this.$emit('loadOn')
    return httpService.get('query/assembly')
      .then((res) => {
        this.source = {
          localData: res.data.rows,
          datatype: 'array',
          datafields: [
            { name: 'study', type: 'String' },
            { name: 'project', type: 'String' },
            { name: 'assembly', type: 'String' },
            { name: 'assembly_type', type: 'String' },
            { name: 'investigator', type: 'String' },
            { name: 'assembly_status', type: 'String' },
            { name: 'segment_status', type: 'String' },
            { name: 'segment_primer_status', type: 'String' },
            { name: 'junction_primer_status', type: 'String' }
          ]
        }
        this.dataAdapter = new jqx.dataAdapter(this.source)
      })
      .catch(err => { throw new Error(err) })
      .finally(() => this.$emit('loadOff'))
  }
}
</script>
